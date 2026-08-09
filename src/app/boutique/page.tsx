"use client";

import { ArrowLeft, Minus, Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DEFAULT_MINIBAR_CATALOG, type MinibarCatalog } from "@/lib/minibar-config";

export default function BoutiquePage() {
  const [catalog, setCatalog] = useState<MinibarCatalog>(DEFAULT_MINIBAR_CATALOG);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/minibar", { cache: "no-store" }).then((r) => r.json()).then((data) => { if (data.success) setCatalog(data.catalog); }).catch(() => undefined);
  }, []);

  const products = useMemo(() => catalog.products.filter((p) => p.active).sort((a,b)=>a.position-b.position), [catalog.products]);
  const count = Object.values(cart).reduce((sum, q) => sum + q, 0);
  const total = products.reduce((sum, p) => sum + (cart[p.id] ?? 0) * p.priceCents, 0);

  function setQuantity(id: string, quantity: number) {
    setCart((prev) => {
      const next = { ...prev };
      if (quantity <= 0) delete next[id]; else next[id] = Math.min(20, quantity);
      return next;
    });
  }

  async function checkout() {
    setPaying(true); setError("");
    try {
      const items = Object.entries(cart).map(([id, quantity]) => ({ id, quantity }));
      const response = await fetch("/api/minibar/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items }) });
      const data = await response.json();
      if (!response.ok || !data.success || !data.url) throw new Error(data.error || "Paiement impossible");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Paiement impossible");
      setPaying(false);
    }
  }

  return <main className="min-h-screen bg-[#e7dfd4] p-3 sm:p-6">
    <div className="mx-auto max-w-[900px] overflow-hidden rounded-[32px] bg-[#faf8f4] shadow-2xl">
      <header className="flex items-center justify-between border-b border-black/5 px-5 py-4"><Link href="/" className="grid h-11 w-11 place-items-center rounded-full bg-[#eee3d3]"><ArrowLeft size={20}/></Link><div className="text-center"><p className="text-[9px] font-black tracking-[0.22em] text-black/35">THE BEDROOM</p><strong className="text-sm">Mini bar</strong></div><div className="grid h-11 w-11 place-items-center rounded-full bg-black text-white"><ShoppingBag size={19}/></div></header>

      <section className="p-4 sm:p-8">
        <div className="overflow-hidden rounded-[32px] bg-black p-6 text-white sm:p-8"><p className="font-serif text-3xl italic">{catalog.subtitle}</p><h1 className="mt-1 text-4xl font-black leading-[0.9] tracking-[-0.05em] sm:text-5xl">{catalog.title}</h1><p className="mt-4 max-w-xl text-sm leading-relaxed text-white/60">{catalog.instructions}</p></div>

        <div className="mt-6 rounded-[32px] bg-[#171717] p-4 shadow-inner sm:p-6">
          <div className="mb-4 flex items-center justify-between text-white"><div><p className="text-[9px] font-black uppercase tracking-[0.18em] text-white/40">Distributeur</p><h2 className="text-xl font-black">Sélectionnez vos articles</h2></div><span className="rounded-full bg-white/10 px-3 py-2 text-xs font-bold">{count} article{count > 1 ? "s" : ""}</span></div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {products.map((product) => {
              const quantity = cart[product.id] ?? 0;
              return <article key={product.id} className={`overflow-hidden rounded-[22px] border p-2 transition ${quantity ? "border-white bg-white" : "border-white/10 bg-white/5 text-white"}`}>
                <div className="relative aspect-square overflow-hidden rounded-[17px] bg-[#eee3d3]">{product.image ? <img src={product.image} alt={product.name} className="h-full w-full object-cover"/> : <div className="grid h-full place-items-center px-3 text-center text-xs font-black text-black/30">{product.name}</div>}<span className="absolute right-2 top-2 rounded-full bg-black px-2.5 py-1.5 text-xs font-black text-white">{(product.priceCents/100).toFixed(2).replace(".",",")} €</span></div>
                <div className="px-1 pb-1 pt-3"><h3 className="text-sm font-black leading-tight">{product.name}</h3><p className={`mt-1 min-h-8 text-[10px] leading-relaxed ${quantity ? "text-black/45" : "text-white/45"}`}>{product.description}</p>
                  {quantity === 0 ? <button onClick={()=>setQuantity(product.id,1)} className={`mt-3 min-h-10 w-full rounded-full text-xs font-black ${quantity ? "bg-black text-white" : "bg-white text-black"}`}>Sélectionner</button> : <div className="mt-3 flex items-center justify-between rounded-full bg-black p-1 text-white"><button onClick={()=>setQuantity(product.id,quantity-1)} className="grid h-9 w-9 place-items-center rounded-full bg-white/10"><Minus size={16}/></button><strong>{quantity}</strong><button onClick={()=>setQuantity(product.id,quantity+1)} className="grid h-9 w-9 place-items-center rounded-full bg-white/10"><Plus size={16}/></button></div>}
                </div>
              </article>;
            })}
          </div>
        </div>

        <div className="sticky bottom-3 mt-5 rounded-[26px] border border-black/5 bg-white/95 p-4 shadow-2xl backdrop-blur"><div className="flex items-end justify-between"><div><p className="text-[10px] font-black uppercase tracking-[0.15em] text-black/35">Votre panier</p><p className="mt-1 text-sm font-bold">{count ? `${count} article${count>1?"s":""}` : "Aucun article"}</p></div><strong className="text-2xl">{(total/100).toFixed(2).replace(".",",")} €</strong></div>{error && <p className="mt-3 rounded-[14px] bg-red-50 px-3 py-2 text-xs font-bold text-red-700">{error}</p>}<button disabled={!count || paying} onClick={checkout} className="mt-4 min-h-14 w-full rounded-full bg-black text-sm font-black text-white disabled:opacity-30">{paying ? "Ouverture du paiement…" : count ? "Payer maintenant" : "Sélectionnez un article"}</button><p className="mt-2 text-center text-[10px] text-black/35">Paiement sécurisé. Les moyens disponibles dépendent de votre appareil et de la configuration du compte de paiement.</p></div>
      </section>
    </div>
  </main>;
}
