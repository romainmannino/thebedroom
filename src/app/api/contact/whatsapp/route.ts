import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { DEFAULT_HOME_CONFIGURATION } from "@/lib/guide-home-config";

export const dynamic = "force-dynamic";

export async function GET() {
  let phone = DEFAULT_HOME_CONFIGURATION.whatsappPhone;

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

      phone = data?.configuration?.whatsappPhone || phone;
    }
  } catch {
    // Le numéro par défaut reste utilisé si Supabase est indisponible.
  }

  const normalizedPhone = String(phone).replace(/[^0-9]/g, "");
  return NextResponse.redirect(`https://wa.me/${normalizedPhone}`);
}
