import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  DEFAULT_GUIDE_CONTENT,
  mergeGuideContent,
  type GuideContentConfiguration,
} from "@/lib/guide-content-config";

export const dynamic = "force-dynamic";

async function getProperty() {
  const { data, error } = await supabaseAdmin
    .from("properties")
    .select("id")
    .eq("slug", "the-bedroom")
    .single();

  if (error || !data) {
    throw new Error(
      `Logement The Bedroom introuvable : ${error?.message ?? "aucune donnée"}`,
    );
  }

  return data;
}

async function getRow() {
  const property = await getProperty();
  const { data, error } = await supabaseAdmin
    .from("guide_home_settings")
    .select("configuration")
    .eq("property_id", property.id)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return {
    property,
    configuration:
      data?.configuration && typeof data.configuration === "object"
        ? (data.configuration as Record<string, unknown>)
        : {},
  };
}

export async function GET() {
  try {
    const { configuration } = await getRow();
    const content = mergeGuideContent(configuration.guideContent);

    return NextResponse.json({ success: true, content });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const incoming = body.content as GuideContentConfiguration | undefined;

    if (!incoming || typeof incoming !== "object") {
      return NextResponse.json(
        { success: false, error: "Contenu invalide." },
        { status: 400 },
      );
    }

    const { property, configuration } = await getRow();
    const content = mergeGuideContent(incoming);

    const { error } = await supabaseAdmin
      .from("guide_home_settings")
      .upsert(
        {
          property_id: property.id,
          configuration: {
            ...configuration,
            guideContent: content,
          },
          updated_at: new Date().toISOString(),
        },
        { onConflict: "property_id" },
      );

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, content });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Erreur inconnue",
      },
      { status: 500 },
    );
  }
}

export async function POST() {
  return NextResponse.json({ success: true, content: DEFAULT_GUIDE_CONTENT });
}
