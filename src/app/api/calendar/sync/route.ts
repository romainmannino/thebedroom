import { NextResponse } from "next/server";
import ical from "ical";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CalendarProvider = "airbnb" | "booking" | "other";

type CalendarSource = {
  id: string;
  property_id: string;
  provider: CalendarProvider;
  name: string;
  ical_url: string;
};

type ICalEvent = {
  type?: string;
  uid?: string;
  summary?: string;
  description?: string;
  location?: string;
  start?: Date;
  end?: Date;
};

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function normalizeTitle(summary?: string): string {
  const value = summary?.trim();

  if (!value) {
    return "Réservation";
  }

  return value;
}

export async function POST() {
  try {
    const { data: sources, error: sourcesError } = await supabaseAdmin
      .from("calendar_sources")
      .select("id, property_id, provider, name, ical_url")
      .eq("is_enabled", true);

    if (sourcesError) {
      throw new Error(`Impossible de lire les calendriers : ${sourcesError.message}`);
    }

    const synchronizationResults = [];

    for (const source of (sources ?? []) as CalendarSource[]) {
      const synchronizationDate = new Date().toISOString();

      try {
        const response = await fetch(source.ical_url, {
          cache: "no-store",
          headers: {
            "User-Agent": "TheBedroomCalendarSync/1.0",
            Accept: "text/calendar,text/plain,*/*",
          },
        });

        if (!response.ok) {
          throw new Error(`Téléchargement iCal impossible : HTTP ${response.status}`);
        }

        const calendarText = await response.text();
        const parsedCalendar = ical.parseICS(calendarText);

        const seenExternalUids: string[] = [];
        let importedCount = 0;

        for (const calendarEntry of Object.values(parsedCalendar)) {
          const event = calendarEntry as ICalEvent;

          if (
            event.type !== "VEVENT" ||
            !event.uid ||
            !event.start ||
            !event.end
          ) {
            continue;
          }

          const startDate = formatDate(event.start);
          const endDate = formatDate(event.end);

          if (endDate <= startDate) {
            continue;
          }

          seenExternalUids.push(event.uid);

          const { error: upsertError } = await supabaseAdmin
            .from("reservations")
            .upsert(
              {
                property_id: source.property_id,
                calendar_source_id: source.id,
                external_uid: event.uid,
                source: source.provider,
                title: normalizeTitle(event.summary),
                start_date: startDate,
                end_date: endDate,
                status: "detected",
                raw_ical_data: {
                  summary: event.summary ?? null,
                  description: event.description ?? null,
                  location: event.location ?? null,
                },
                imported_at: synchronizationDate,
                last_seen_at: synchronizationDate,
              },
              {
                onConflict: "calendar_source_id,external_uid",
              },
            );

          if (upsertError) {
            throw new Error(
              `Erreur d'enregistrement de ${event.uid} : ${upsertError.message}`,
            );
          }

          importedCount += 1;
        }

        if (seenExternalUids.length > 0) {
          const { error: cancelledError } = await supabaseAdmin
            .from("reservations")
            .update({
              status: "cancelled",
              updated_at: synchronizationDate,
            })
            .eq("calendar_source_id", source.id)
            .not("external_uid", "in", `(${seenExternalUids.map((uid) => `"${uid.replaceAll('"', '\\"')}"`).join(",")})`)
            .neq("status", "completed");

          if (cancelledError) {
            console.error(
              `Impossible de marquer les anciennes réservations comme annulées pour ${source.name}:`,
              cancelledError.message,
            );
          }
        }

        const { error: sourceUpdateError } = await supabaseAdmin
          .from("calendar_sources")
          .update({
            last_synced_at: synchronizationDate,
            last_success_at: synchronizationDate,
            last_error: null,
          })
          .eq("id", source.id);

        if (sourceUpdateError) {
          throw new Error(
            `Calendrier importé mais statut non mis à jour : ${sourceUpdateError.message}`,
          );
        }

        synchronizationResults.push({
          source: source.name,
          provider: source.provider,
          success: true,
          imported: importedCount,
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Erreur inconnue";

        await supabaseAdmin
          .from("calendar_sources")
          .update({
            last_synced_at: synchronizationDate,
            last_error: message,
          })
          .eq("id", source.id);

        synchronizationResults.push({
          source: source.name,
          provider: source.provider,
          success: false,
          imported: 0,
          error: message,
        });
      }
    }

    const allSuccessful = synchronizationResults.every(
      (result) => result.success,
    );

    return NextResponse.json(
      {
        success: allSuccessful,
        synchronizedAt: new Date().toISOString(),
        sources: synchronizationResults,
      },
      {
        status: allSuccessful ? 200 : 207,
      },
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erreur inconnue";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      {
        status: 500,
      },
    );
  }
}
