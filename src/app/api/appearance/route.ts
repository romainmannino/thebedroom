import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import {
  DEFAULT_HOME_CONFIGURATION,
  type GuideHomeConfiguration,
  type HomeTileConfiguration,
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

function mergeWithDefaults(configuration: GuideHomeConfiguration): GuideHomeConfiguration {
  const currentTiles = Array.isArray(configuration.tiles) ? configuration.tiles : [];
  const currentById = new Map(
    currentTiles.map((tile: HomeTileConfiguration) => [tile.id, tile]),
  );
  const mergedTiles = DEFAULT_HOME_CONFIGURATION.tiles.map((defaultTile) => ({
    ...defaultTile,
    ...currentById.get(defaultTile.id),
  }));
  const unknownTiles = currentTiles.filter(
    (tile) =>
      !DEFAULT_HOME_CONFIGURATION.tiles.some(
        (defaultTile) => defaultTile.id === tile.id,
      ),
  );
  return {
    ...DEFAULT_HOME_CONFIGURATION,
    ...configuration,
    tiles: [...mergedTiles, ...unknownTiles].map((tile, index) => ({
      ...tile,
      position: typeof tile.position === "number" ? tile.position : index,
    })),
  };
}

export async function GET() {
  try {
    const property = await getProperty();
    const { data, error } = await supabaseAdmin
      .from("guide_home_settings")
      .select("configuration")
      .eq("property_id", property.id)
      .maybeSingle();
    if (error) throw new Error(error.message);

    const raw = data?.configuration as Record<string, unknown> | undefined;
    const appearance = raw as GuideHomeConfiguration | undefined;
    const normalized = mustRestoreConfiguration(appearance)
      ? RESTORED_CONFIGURATION
      : mergeWithDefaults(appearance ?? RESTORED_CONFIGURATION);
    const configuration = {
      ...normalized,
      ...(raw?.guideContent ? { guideContent: raw.guideContent } : {}),
    };

    const { error: saveError } = await supabaseAdmin
      .from("guide_home_settings")
      .upsert(
        {
          property_id: property.id,
          configuration,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "property_id" },
      );
    if (saveError) throw new Error(saveError.message);

    return NextResponse.json({ success: true, configuration });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Erreur inconnue" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const incoming = body.configuration;
    if (!incoming || typeof incoming !== "object") {
      return NextResponse.json(
        { success: false, error: "Configuration invalide." },
        { status: 400 },
      );
    }

    const property = await getProperty();
    const { data: existing, error: readError } = await supabaseAdmin
      .from("guide_home_settings")
      .select("configuration")
      .eq("property_id", property.id)
      .maybeSingle();
    if (readError) throw new Error(readError.message);

    const existingConfiguration =
      existing?.configuration && typeof existing.configuration === "object"
        ? (existing.configuration as Record<string, unknown>)
        : {};
    const normalizedAppearance = mergeWithDefaults(incoming);
    const configuration = {
      ...normalizedAppearance,
      ...(existingConfiguration.guideContent
        ? { guideContent: existingConfiguration.guideContent }
        : {}),
    };

    const { error } = await supabaseAdmin
      .from("guide_home_settings")
      .upsert(
        {
          property_id: property.id,
          configuration,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "property_id" },
      );
    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, configuration });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Erreur inconnue" },
      { status: 500 },
    );
  }
}
