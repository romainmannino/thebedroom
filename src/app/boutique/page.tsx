"use client";

import { ArrowLeft, BatteryCharging, CupSoda, Grid2X2, Minus, Plus, Search, ShoppingBag, Sparkles, UtensilsCrossed, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DEFAULT_MINIBAR_CATALOG, type MinibarCatalog } from "@/lib/minibar-config";

type FilterKey = "Tout" | "Boissons" | "Alimentation" | "Hygiène" | "Dépannage";

const FILTERS: { key: FilterKey; label: string; icon: React.ElementType }[] = [
  { key: "Boissons", label: "Boissons", icon: CupSoda },
  { key: "Alimentation", label: "Alimentation", icon: UtensilsCrossed },
  { key: "Hygiène", label: "Hygiène", icon: Sparkles },
  { key: "Dépannage", label: "Dépannage", icon: BatteryCharging },
  { key: "Tout", label: "Tout", icon: Grid2X2 },
];

export default function BoutiquePage() {
  const [catalog, setCatalog] = useState<MinibarCatalog>(DEFAULT_MINIBAR_CATALOG);
  const [cart, setCart] = useState<Record<string, number>>({});
  const [activeFilter, setActiveFilter] = useState<FilterKey>("Tout");
  const [search, setSearch] = useState("");
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/minibar", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => { if (data.success) setCatalog(data.catalog); })
      .catch(() => undefined);
  }, []);

  const products = useMemo(
    () => catalog.products.filter((p) => p.active).sort((a, b) => a.position - b.position),
    [catalog.products],
  );

  const displayedProducts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("fr");
    return products.filter((product) => {
      const matchesFilter = activeFilter === "Tout" || product.category === activeFilter;
      const matchesSearch = !query || `${product.name} ${product.description} ${product.category}`.toLocaleLowerCase("fr").includes(query);
      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, products, search]);

  const categoryCounts = useMemo(() => {
    const counts = new Map<FilterKey, number>();
    counts.set("Tout", products.length);
    for (const filter of FILTERS) {
      if (filter.key === "Tout") continue;
      counts.set(filter.key, products.filter((product) => product.category === filter.key).length);
    }
    return counts;
  }, [products]);

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
    setPaying(true);
    setError("");
    try {
      const items = Object.entries(cart).map(([id, quantity]) => ({ id, quantity }));
      const response = await fetch("/api/minibar/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });
      const data = await response.json();
      if (!response.ok || !data.success || !data.url) throw new Error(data.error || "Paiement impossible");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Paiement impossible");
      setPaying(false);
    }
  }

  const activeLabel = search.trim()
    ? `${displayedProducts.length} résultat${displayedProducts.length > 1 ? "s" : ""}`
    : `${activeFilter} · ${displayedProducts.length} article${displayedProducts.length > 1 ? "s" : ""}`;

  return <main className="min-h-screen bg-[#e7dfd4] p-3 sm:p-6">
    <div className="mx-auto max-w-[900px] overflow-hidden rounded-[32px] bg-[#faf8f4] shadow-2xl">
      <header className="flex items-center justify-between border-b border-black/5 px-5 py-4">
        <Link href="/" className="grid h-11 w-11 place-items-center rounded-full bg-[#eee3d3]"><ArrowLeft size={20}/></Link>
        <div className="text-center"><p className="text-[9px] font-black tracking-[0.22em] text-black/35">THE BEDROOM</p><strong className="text-sm">Mini bar</strong></div>
        <div className="grid h-11 w-11 place-items-center rounded-full bg-black text-white"><ShoppingBag size={19}/></div>
      </header>

      <section className="p-4 sm:p-8">
        <div className="px-1 py-2 sm:px-2">
          <p className="font-serif text-3xl italic text-black sm:text-4xl">{catalog.subtitle}</p>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-black/65">{catalog.instructions}</p>
        </div>

        <div className="mt-7 flex items-end justify-between gap-4 px-1 sm:px-2">
          <div><p className="text-[9px] font-black uppercase tracking-[0.18em] text-black/35">Mini bar</p><h2 className="text-2xl font-black tracking-[-0.03em]">Sélectionnez vos articles</h2></div>
          <span className="rounded-full bg-[#eee3d3] px-3 py-2 text-xs font-bold">{count} article{count > 1 ? "s" : ""}</span>
        </div>

        <div className="sticky top-2 z-30 mt-4 rounded-[20px] border border-black/5 bg-[#faf8f4]/95 px-2 py-2 shadow-sm backdrop-blur sm:mx-2">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {FILTERS.map(({ key, label, icon: Icon }) => {
                const active = activeFilter === key;
                return <button
                  key={key}
                  type="button"
                  onClick={() => setActiveFilter(key)}
                  aria-label={`${label} (${categoryCounts.get(key) ?? 0})`}
                  title={label}
                  className={`relative grid h-8 w-8 shrink-0 place-items-center rounded-full border transition active:scale-95 ${active ? "border-black bg-black text-white" : "border-black/10 bg-[#f3ede5] text-black/65 hover:bg-[#ece3d8]"}`}
                >
                  <Icon size={15}/>
                  {(categoryCounts.get(key) ?? 0) > 0 && key !== "Tout" && <span className={`absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full px-1 text-[8px] font-black ${active ? "bg-[#eee3d3] text-black" : "bg-black text-white"}`}>{categoryCounts.get(key)}</span>}
                </button>;
              })}
            </div>
            <span className="hidden text-[10px] font-black text-black/40 sm:block">{activeLabel}</span>
          </div>

          <div className="mt-2 flex items-center gap-2 rounded-full bg-white px-3 py-2 ring-1 ring-black/5">
            <Search size={14} className="shrink-0 text-black/35"/>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher un article…"
              className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-black/30"
            />
            {search && <button type="button" onClick={() => setSearch("")} aria-label="Effacer la recherche" className="grid h-6 w-6 place-items-center rounded-full bg-[#eee3d3] text-black/55"><X size={12}/></button>}
          </div>
          <p className="mt-2 px-1 text-[10px] font-bold text-black/40 sm:hidden">{activeLabel}</p>
        </div>

        <div key={`${activeFilter}-${search}`} className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 animate-[fadeIn_.2s_ease-out]">
          {displayedProducts.map((product) => {
            const quantity = cart[product.id] ?? 0;
            return <article key={product.id} className={`overflow-hidden rounded-[22px] border bg-white p-2 shadow-sm transition ${quantity ? "border-black" : "border-black/5"}`}>
              <div className="relative aspect-square overflow-hidden rounded-[17px] bg-[#eee3d3]">
                {product.image ? <img src={product.image} alt={product.name} className="h-full w-full object-cover"/> : <div className="grid h-full place-items-center px-3 text-center text-xs font-black text-black/30">{product.name}</div>}
                <span className="absolute right-2 top-2 rounded-full bg-black px-2.5 py-1.5 text-xs font-black text-white">{(product.priceCents/100).toFixed(2).replace(".",",")} €</span>
              </div>
              <div className="px-1 pb-1 pt-3">
                <h3 className="text-sm font-black leading-tight text-black">{product.name}</h3>
                <p className="mt-1 min-h-8 text-[10px] leading-relaxed text-black/45">{product.description}</p>
                {quantity === 0 ? <button onClick={()=>setQuantity(product.id,1)} className="mt-3 min-h-10 w-full rounded-full bg-black text-xs font-black text-white">Sélectionner</button> : <div className="mt-3 flex items-center justify-between rounded-full bg-black p-1 text-white"><button onClick={()=>setQuantity(product.id,quantity-1)} className="grid h-9 w-9 place-items-center rounded-full bg-white/10"><Minus size={16}/></button><strong>{quantity}</strong><button onClick={()=>setQuantity(product.id,quantity+1)} className="grid h-9 w-9 place-items-center rounded-full bg-white/10"><Plus size={16}/></button></div>}
              </div>
            </article>;
          })}
        </div>

        {displayedProducts.length === 0 && <div className="mt-5 rounded-[22px] bg-[#eee3d3] p-6 text-center text-sm font-bold text-black/50">Aucun article trouvé.</div>}

        <div className="sticky bottom-3 mt-5 rounded-[26px] border border-black/5 bg-white/95 p-4 shadow-2xl backdrop-blur">
          <div className="flex items-end justify-between"><div><p className="text-[10px] font-black uppercase tracking-[0.15em] text-black/35">Votre panier</p><p className="mt-1 text-sm font-bold">{count ? `${count} article${count>1?"s":""}` : "Aucun article"}</p></div><strong className="text-2xl">{(total/100).toFixed(2).replace(".",",")} €</strong></div>
          {error && <p className="mt-3 rounded-[14px] bg-red-50 px-3 py-2 text-xs font-bold text-red-700">{error}</p>}
          <button disabled={!count || paying} onClick={checkout} className="mt-4 min-h-14 w-full rounded-full bg-black text-sm font-black text-white disabled:opacity-30">{paying ? "Ouverture du paiement…" : count ? "Payer maintenant" : "Sélectionnez un article"}</button>
          <p className="mt-2 text-center text-[10px] text-black/35">Paiement sécurisé. Les moyens disponibles dépendent de votre appareil et de la configuration du compte de paiement.</p>
        </div>
      </section>
    </div>
  </main>;
}
