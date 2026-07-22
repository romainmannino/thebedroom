import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { DEFAULT_HOME_CONFIGURATION } from "@/lib/guide-home-config";

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

export async function GET() {
  try {
    const property = await getProperty();

    const { data, error } = await supabaseAdmin
      .from("guide_home_settings")
      .select("configuration")
      .eq("property_id", property.id)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({
      success: true,
      configuration:
        data?.configuration &&
        Object.keys(data.configuration).length > 0
          ? data.configuration
          : DEFAULT_HOME_CONFIGURATION,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Erreur inconnue",
      },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const configuration = body.configuration;

    if (!configuration || typeof configuration !== "object") {
      return NextResponse.json(
        {
          success: false,
          error: "Configuration invalide.",
        },
        { status: 400 },
      );
    }

    const property = await getProperty();

    const { error } = await supabaseAdmin
      .from("guide_home_settings")
      .upsert(
        {
          property_id: property.id,
          configuration,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "property_id",
        },
      );

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({
      success: true,
      configuration,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Erreur inconnue",
      },
      { status: 500 },
    );
  }
}
