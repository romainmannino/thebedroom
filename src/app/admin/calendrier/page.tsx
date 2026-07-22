import { DateTime } from "luxon";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Home,
} from "lucide-react";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  normalizeReservations,
  type NormalizedStay,
  type RawReservation,
} from "@/lib/calendar-normalizer";

export const dynamic = "force-dynamic";

type CalendarPageProps = {
  searchParams: Promise<{
    month?: string;
  }>;
};

function sourceClasses(source: NormalizedStay["source"]) {
  if (source === "airbnb") {
    return "bg-[#ffe0dc] text-[#9d3029] border-[#f6bab3]";
  }

  if (source === "booking") {
    return "bg-[#dce8ff] text-[#174d9b] border-[#b8cff8]";
  }

  if (source === "manual") {
    return "bg-[#dedbd5] text-[#55514b] border-[#c6c1ba]";
  }

  return "bg-[#eee3d3] text-black border-[#d9cbb8]";
}

function sourceLabel(source: NormalizedStay["source"]) {
  if (source === "airbnb") return "Airbnb";
  if (source === "booking") return "Booking";
  if (source === "manual") return "Blocage";

  return "Indisponible";
}

export default async function CalendarPage({
  searchParams,
}: CalendarPageProps) {
  const params = await searchParams;

  let currentMonth = params.month
    ? DateTime.fromFormat(params.month, "yyyy-MM", {
        zone: "Europe/Paris",
      })
    : DateTime.now().setZone("Europe/Paris");

  if (!currentMonth.isValid) {
    currentMonth = DateTime.now().setZone("Europe/Paris");
  }

  currentMonth = currentMonth.startOf("month");

  const calendarStart = currentMonth.startOf("week");
  const calendarEnd = currentMonth.endOf("month").endOf("week");

  const { data, error } = await supabaseAdmin
    .from("reservations")
    .select("id, title, source, start_date, end_date, status")
    .neq("status", "cancelled")
    .lt(
      "start_date",
      calendarEnd.plus({ days: 1 }).toISODate()!,
    )
    .gt("end_date", calendarStart.toISODate()!)
    .order("start_date", { ascending: true });

  if (error) {
    throw new Error(
      `Impossible de charger le calendrier : ${error.message}`,
    );
  }

  const stays = normalizeReservations(
    (data ?? []) as RawReservation[],
  );

  const days: DateTime[] = [];
  let dayCursor = calendarStart;

  while (dayCursor <= calendarEnd) {
    days.push(dayCursor);
    dayCursor = dayCursor.plus({ days: 1 });
  }

  const previousMonth = currentMonth
    .minus({ months: 1 })
    .toFormat("yyyy-MM");

  const nextMonth = currentMonth
    .plus({ months: 1 })
    .toFormat("yyyy-MM");

  const currentRealMonth = DateTime.now()
    .setZone("Europe/Paris")
    .toFormat("yyyy-MM");

  return (
    <main className="min-h-screen bg-[#e7dfd4] px-3 py-3 sm:px-5 sm:py-5">
      <div className="mx-auto min-h-[calc(100vh-24px)] max-w-[1380px] overflow-hidden rounded-[24px] bg-[#faf8f4] shadow-lg">
        <header className="flex items-center justify-between border-b border-black/5 px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="grid h-10 w-10 place-items-center rounded-full bg-[#eee3d3]"
            >
              <ArrowLeft size={18} />
            </Link>

            <div>
              <p className="text-[9px] font-black tracking-[0.22em] text-black/40">
                THE BEDROOM
              </p>
              <h1 className="text-lg font-black">Calendrier unique</h1>
            </div>
          </div>

          <Link
            href="/admin"
            className="grid h-10 w-10 place-items-center rounded-full bg-black text-white"
          >
            <Home size={18} />
          </Link>
        </header>

        <section className="p-4 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-serif text-2xl italic">Planning</p>

              <h2 className="text-3xl font-black uppercase leading-none tracking-[-0.045em]">
                {currentMonth
                  .setLocale("fr")
                  .toFormat("LLLL yyyy")}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href={`/admin/calendrier?month=${previousMonth}`}
                className="grid h-10 w-10 place-items-center rounded-full bg-[#eee3d3]"
              >
                <ChevronLeft size={18} />
              </Link>

              <Link
                href={`/admin/calendrier?month=${currentRealMonth}`}
                className="flex h-10 items-center rounded-full bg-black px-4 text-xs font-black text-white"
              >
                Aujourd’hui
              </Link>

              <Link
                href={`/admin/calendrier?month=${nextMonth}`}
                className="grid h-10 w-10 place-items-center rounded-full bg-[#eee3d3]"
              >
                <ChevronRight size={18} />
              </Link>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-bold">
            <Legend color="bg-[#f0776d]" label="Airbnb" />
            <Legend color="bg-[#5688dc]" label="Booking" />
            <Legend color="bg-[#9c9993]" label="Blocage manuel" />
          </div>

          <div className="mt-5 overflow-x-auto rounded-[18px] border border-black/10 bg-white">
            <div className="min-w-[920px]">
              <div className="grid grid-cols-7 border-b border-black/10">
                {["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"].map(
                  (weekday) => (
                    <div
                      key={weekday}
                      className="border-r border-black/10 bg-[#eee3d3] px-3 py-2.5 text-center text-[11px] font-black uppercase last:border-r-0"
                    >
                      {weekday}
                    </div>
                  ),
                )}
              </div>

              <div className="grid grid-cols-7">
                {days.map((day) => {
                  const date = day.toISODate()!;

                  const dayStays = stays.filter(
                    (stay) =>
                      stay.start_date <= date &&
                      stay.end_date > date,
                  );

                  const isCurrentMonth =
                    day.month === currentMonth.month &&
                    day.year === currentMonth.year;

                  const isToday =
                    date ===
                    DateTime.now()
                      .setZone("Europe/Paris")
                      .toISODate();

                  return (
                    <article
                      key={date}
                      className={`min-h-[118px] border-b border-r border-black/[0.08] p-2 ${
                        isCurrentMonth
                          ? "bg-white"
                          : "bg-black/[0.025]"
                      }`}
                    >
                      <div className="flex justify-end">
                        <span
                          className={`grid h-7 w-7 place-items-center rounded-full text-[11px] font-black ${
                            isToday
                              ? "bg-black text-white"
                              : isCurrentMonth
                                ? "text-black"
                                : "text-black/25"
                          }`}
                        >
                          {day.day}
                        </span>
                      </div>

                      <div className="mt-1.5 space-y-1.5">
                        {dayStays.slice(0, 3).map((stay) => {
                          const beginsToday =
                            stay.start_date === date;

                          return (
                            <div
                              key={stay.id}
                              title={`${stay.title} — ${sourceLabel(
                                stay.source,
                              )}`}
                              className={`truncate rounded-md border px-2 py-1.5 text-[10px] font-black ${sourceClasses(
                                stay.source,
                              )}`}
                            >
                              {beginsToday
                                ? stay.title
                                : sourceLabel(stay.source)}
                            </div>
                          );
                        })}

                        {dayStays.length > 3 && (
                          <p className="px-1 text-[9px] font-bold text-black/40">
                            + {dayStays.length - 3} autre(s)
                          </p>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>

          <section className="mt-6">
            <div className="mb-3">
              <p className="font-serif text-xl italic">Ce mois-ci</p>
              <h3 className="text-xl font-black">SÉJOURS DÉTECTÉS</h3>
            </div>

            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {stays.map((stay) => (
                <article
                  key={stay.id}
                  className="flex items-center gap-3 rounded-[18px] bg-white p-3 shadow-sm"
                >
                  <span
                    className={`h-10 w-1.5 flex-none rounded-full ${
                      stay.source === "airbnb"
                        ? "bg-[#f0776d]"
                        : stay.source === "booking"
                          ? "bg-[#5688dc]"
                          : "bg-[#9c9993]"
                    }`}
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black uppercase text-black/40">
                        {sourceLabel(stay.source)}
                      </span>

                      {stay.inferred && (
                        <span className="rounded-full bg-[#eee3d3] px-2 py-0.5 text-[8px] font-black">
                          DÉDUIT
                        </span>
                      )}
                    </div>

                    <p className="mt-1 truncate text-sm font-black">
                      {stay.title}
                    </p>

                    <p className="mt-1 text-[10px] text-black/45">
                      {DateTime.fromISO(stay.start_date)
                        .setLocale("fr")
                        .toFormat("dd LLL")}{" "}
                      →{" "}
                      {DateTime.fromISO(stay.end_date)
                        .setLocale("fr")
                        .toFormat("dd LLL")}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

function Legend({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
  return (
    <span className="flex items-center gap-2">
      <i className={`h-2.5 w-2.5 rounded-full ${color}`} />
      {label}
    </span>
  );
}
