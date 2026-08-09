import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { mergeMinibarCatalog } from "@/lib/minibar-config";

export const runtime = "nodejs";

async function getCatalog() {
  const { data: property, error: propertyError } = await supabaseAdmin.from("properties").select("id").eq("slug", "the-bedroom").single();
  if (propertyError || !property) throw new Error("Logement introuvable");
  const { data, error } = await supabaseAdmin.from("guide_home_settings").select("configuration").eq("property_id", property.id).maybeSingle();
  if (error) throw new Error(error.message);
  const configuration = data?.configuration && typeof data.configuration === "object" ? (data.configuration as Record<string, unknown>) : {};
  return mergeMinibarCatalog(configuration.minibarCatalog);
}

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.STRIPE_SECRET_KEY;
    if (!secret) return NextResponse.json({ success: false, error: "Le paiement n’est pas encore activé. Ajoutez STRIPE_SECRET_KEY dans Vercel." }, { status: 503 });

    const body = await request.json();
    const requested = Array.isArray(body.items) ? body.items : [];
    const catalog = await getCatalog();
    const lines = requested.map((item: { id?: string; quantity?: number }) => {
      const product = catalog.products.find((p) => p.id === item.id && p.active);
      const quantity = Math.min(20, Math.max(1, Math.floor(Number(item.quantity) || 1)));
      return product ? { product, quantity } : null;
    }).filter(Boolean) as { product: (typeof catalog.products)[number]; quantity: number }[];

    if (!lines.length) return NextResponse.json({ success: false, error: "Votre panier est vide." }, { status: 400 });

    const params = new URLSearchParams();
    params.set("mode", "payment");
    params.set("success_url", `${request.nextUrl.origin}/boutique/succes?session_id={CHECKOUT_SESSION_ID}`);
    params.set("cancel_url", `${request.nextUrl.origin}/boutique?paiement=annule`);
    params.set("locale", "auto");
    params.set("automatic_payment_methods[enabled]", "true");
    lines.forEach(({ product, quantity }, index) => {
      params.set(`line_items[${index}][price_data][currency]`, "eur");
      params.set(`line_items[${index}][price_data][unit_amount]`, String(product.priceCents));
      params.set(`line_items[${index}][price_data][product_data][name]`, product.name);
      if (product.description) params.set(`line_items[${index}][price_data][product_data][description]`, product.description.slice(0, 500));
      if (product.image?.startsWith("https://")) params.set(`line_items[${index}][price_data][product_data][images][0]`, product.image);
      params.set(`line_items[${index}][quantity]`, String(quantity));
    });

    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
    const session = await response.json();
    if (!response.ok || !session.url) throw new Error(session?.error?.message || "Impossible de créer le paiement");
    return NextResponse.json({ success: true, url: session.url });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Erreur de paiement" }, { status: 500 });
  }
}
