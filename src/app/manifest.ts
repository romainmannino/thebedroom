import type { MetadataRoute } from "next";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  let icon = "/favicon.ico";
  try {
    const { data: property } = await supabaseAdmin.from("properties").select("id").eq("slug", "the-bedroom").single();
    if (property) {
      const { data } = await supabaseAdmin.from("guide_home_settings").select("configuration").eq("property_id", property.id).maybeSingle();
      const configured = (data?.configuration as { appIcon?: string } | undefined)?.appIcon;
      if (configured) icon = configured;
    }
  } catch {}
  return {
    name: "The Bedroom",
    short_name: "The Bedroom",
    description: "Livret d’accueil The Bedroom à Jonage",
    start_url: "/",
    display: "standalone",
    background_color: "#fbf9f5",
    theme_color: "#000000",
    icons: [{ src: icon, sizes: "any", type: icon.endsWith(".png") ? "image/png" : undefined }],
  };
}
