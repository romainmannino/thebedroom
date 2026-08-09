import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export async function GET() {
  let icon = "/favicon.ico";

  try {
    const { data: property } = await supabaseAdmin
      .from("properties")
      .select("id")
      .eq("slug", "the-bedroom")
      .single();

    if (property) {
      const { data } = await supabaseAdmin
        .from("guide_home_settings")
        .select("configuration")
        .eq("property_id", property.id)
        .maybeSingle();

      const configured = (data?.configuration as { appIcon?: string } | undefined)?.appIcon;
      if (configured) icon = configured;
    }
  } catch {}

  return NextResponse.json(
    {
      name: "The Bedroom Admin",
      short_name: "Bedroom Admin",
      description: "Administration du livret The Bedroom",
      id: "/admin",
      start_url: "/admin",
      scope: "/admin",
      display: "standalone",
      background_color: "#faf8f4",
      theme_color: "#000000",
      icons: [{ src: icon, sizes: "any" }],
    },
    {
      headers: {
        "Content-Type": "application/manifest+json; charset=utf-8",
        "Cache-Control": "no-store",
      },
    },
  );
}
