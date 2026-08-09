import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { DEFAULT_MINIBAR_CATALOG, mergeMinibarCatalog, type MinibarCatalog } from "@/lib/minibar-config";

export const dynamic = "force-dynamic";

async function getProperty() {
  const { data, error } = await supabaseAdmin.from("properties").select("id").eq("slug", "the-bedroom").single();
  if (error || !data) throw new Error(error?.message ?? "Logement introuvable");
  return data;
}

async function getConfiguration() {
  const property = await getProperty();
  const { data, error } = await supabaseAdmin.from("guide_home_settings").select("configuration").eq("property_id", property.id).maybeSingle();
  if (error) throw new Error(error.message);
  const configuration = data?.configuration && typeof data.configuration === "object" ? (data.configuration as Record<string, unknown>) : {};
  return { property, configuration };
}

export async function GET() {
  try {
    const { configuration } = await getConfiguration();
    return NextResponse.json({ success: true, catalog: mergeMinibarCatalog(configuration.minibarCatalog) });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Erreur inconnue", catalog: DEFAULT_MINIBAR_CATALOG }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const incoming = body.catalog as MinibarCatalog | undefined;
    if (!incoming || typeof incoming !== "object") return NextResponse.json({ success: false, error: "Catalogue invalide" }, { status: 400 });
    const { property, configuration } = await getConfiguration();
    const catalog = mergeMinibarCatalog(incoming);
    const { error } = await supabaseAdmin.from("guide_home_settings").upsert({ property_id: property.id, configuration: { ...configuration, minibarCatalog: catalog }, updated_at: new Date().toISOString() }, { onConflict: "property_id" });
    if (error) throw new Error(error.message);
    return NextResponse.json({ success: true, catalog });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Erreur inconnue" }, { status: 500 });
  }
}
