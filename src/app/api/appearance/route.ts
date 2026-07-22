import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  DEFAULT_HOME_CONFIGURATION,
  GuideHomeConfiguration,
} from "@/lib/guide-home-config";

export const dynamic = "force-dynamic";

const RESTORED_CONFIGURATION: GuideHomeConfiguration = {
  ...DEFAULT_HOME_CONFIGURATION,
  heroImage:
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=88",
};

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

function mustRestoreConfiguration(configuration: unknown): boolean {
  if (!configuration || typeof configuration !== "object") return true;

  const current = configuration as Partial<GuideHomeConfiguration>;

  return (
    current.heroTitle === "TEST" ||
    current.heroSubtitle === "Test" ||
    !Array.isArray(current.tiles) ||
    current.tiles.length === 0
  );
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

    let configuration = data?.configuration;

    if (mustRestoreConfiguration(configuration)) {
      configuration = RESTORED_CONFIGURATION;

      const { error: restoreError } = await supabaseAdmin
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

      if (restoreError) {
        throw new Error(restoreError.message);
      }
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
