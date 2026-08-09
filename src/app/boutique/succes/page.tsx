import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

async function verifySession(sessionId: string) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret || !sessionId) return false;
  const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(sessionId)}`, { headers: { Authorization: `Bearer ${secret}` }, cache: "no-store" });
  if (!response.ok) return false;
  const session = await response.json();
  return session.payment_status === "paid";
}

export default async function MinibarSuccessPage({ searchParams }: { searchParams: Promise<{ session_id?: string }> }) {
  const { session_id = "" } = await searchParams;
  const paid = await verifySession(session_id);
  return <main className="grid min-h-screen place-items-center bg-[#e7dfd4] p-5"><section className="w-full max-w-[520px] rounded-[32px] bg-[#faf8f4] p-6 text-center shadow-2xl sm:p-10"><span className={`mx-auto grid h-20 w-20 place-items-center rounded-full ${paid ? "bg-black text-white" : "bg-[#eee3d3]"}`}><CheckCircle2 size={38}/></span><p className="mt-6 font-serif text-3xl italic">{paid ? "Merci !" : "Paiement à vérifier"}</p><h1 className="mt-1 text-4xl font-black leading-[0.92] tracking-[-0.05em]">{paid ? "VOUS POUVEZ VOUS SERVIR" : "PAIEMENT NON CONFIRMÉ"}</h1><p className="mx-auto mt-5 max-w-sm text-sm leading-relaxed text-black/55">{paid ? "Votre paiement est confirmé. Vous pouvez maintenant prendre dans le mini bar uniquement les articles que vous venez de régler. Bon séjour !" : "Nous n’avons pas pu confirmer le paiement. Ne prenez pas les articles et revenez à la boutique pour réessayer."}</p><Link href={paid ? "/" : "/boutique"} className="mt-7 flex min-h-14 items-center justify-center rounded-full bg-black px-6 font-black text-white">{paid ? "Retour au livret" : "Retour à la boutique"}</Link></section></main>;
}
