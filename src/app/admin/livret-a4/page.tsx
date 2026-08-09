"use client";

import { ArrowLeft, Download, Home, Printer } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DEFAULT_GUIDE_CONTENT, mergeGuideContent, type GuideContentConfiguration } from "@/lib/guide-content-config";
import { DEFAULT_HOME_CONFIGURATION, type GuideHomeConfiguration } from "@/lib/guide-home-config";
import { DEFAULT_MINIBAR_CATALOG, type MinibarCatalog } from "@/lib/minibar-config";

export default function A4GuidePage() {
  const [home, setHome] = useState<GuideHomeConfiguration>(DEFAULT_HOME_CONFIGURATION);
  const [content, setContent] = useState<GuideContentConfiguration>(DEFAULT_GUIDE_CONTENT);
  const [catalog, setCatalog] = useState<MinibarCatalog>(DEFAULT_MINIBAR_CATALOG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/appearance", { cache: "no-store" }).then((r) => r.json()),
      fetch("/api/guide-content", { cache: "no-store" }).then((r) => r.json()),
      fetch("/api/minibar", { cache: "no-store" }).then((r) => r.json()),
    ]).then(([appearance, guide, shop]) => {
      if (appearance.success) setHome(appearance.configuration);
      if (guide.success) setContent(mergeGuideContent(guide.content));
      if (shop.success) setCatalog(shop.catalog);
    }).finally(() => setLoading(false));
  }, []);

  const sections = useMemo(() => home.tiles.filter((tile) => tile.visible && content[tile.id] && tile.id !== "minibar").sort((a,b)=>a.position-b.position), [content, home.tiles]);

  if (loading) return <main className="grid min-h-screen place-items-center bg-[#e7dfd4] font-bold">Préparation du livret…</main>;

  return <main className="min-h-screen bg-[#d8d1c7] py-5 print:bg-white print:py-0">
    <style jsx global>{`
      @page { size: A4; margin: 0; }
      @media print {
        .no-print { display: none !important; }
        body { background: white !important; }
        .a4-page { width: 210mm !important; min-height: 297mm !important; margin: 0 !important; box-shadow: none !important; page-break-after: always; break-after: page; }
        .a4-page:last-child { page-break-after: auto; break-after: auto; }
      }
    `}</style>

    <div className="no-print sticky top-3 z-50 mx-auto mb-5 flex max-w-[900px] items-center justify-between rounded-full bg-black p-2 pl-3 text-white shadow-2xl"><Link href="/admin/livret" className="flex items-center gap-2 px-3 text-sm font-bold"><ArrowLeft size={18}/>Retour</Link><div className="flex gap-2"><Link href="/admin" className="grid h-11 w-11 place-items-center rounded-full bg-white/10"><Home size={18}/></Link><button onClick={()=>window.print()} className="flex h-11 items-center gap-2 rounded-full bg-[#eee3d3] px-5 text-sm font-black text-black"><Download size={17}/>Télécharger / PDF</button></div></div>

    <section className="a4-page relative mx-auto min-h-[1123px] w-[794px] overflow-hidden bg-[#fbf9f5] shadow-2xl">
      <img src={home.heroImage} alt="" className="absolute inset-0 h-full w-full object-cover"/>
      <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/20 to-black/85"/>
      <div className="absolute left-14 top-14 text-sm font-black tracking-[0.28em] text-white">THE BEDROOM</div>
      <div className="absolute bottom-20 left-14 right-14 text-white"><p className="font-serif text-5xl italic">{home.greeting}</p><h1 className="mt-2 max-w-[650px] text-7xl font-black leading-[0.9] tracking-[-0.06em]">{home.heroTitle}</h1><p className="mt-6 max-w-[520px] text-xl text-white/75">{home.heroSubtitle}</p><div className="mt-10 inline-flex rounded-full bg-[#eee3d3] px-6 py-4 text-base font-black text-black"><Printer size={19} className="mr-2"/>Livret d’accueil - The Bedroom</div></div>
    </section>

    {sections.map((tile) => {
      const section = content[tile.id];
      return <section key={tile.id} className="a4-page mx-auto min-h-[1123px] w-[794px] bg-[#fbf9f5] p-14 shadow-2xl">
        <div className="flex items-start justify-between gap-8 border-b border-black/10 pb-8"><div><p className="font-serif text-4xl italic">{section.script}</p><h2 className="mt-1 text-5xl font-black leading-[0.9] tracking-[-0.05em]">{section.title}</h2><p className="mt-4 max-w-[520px] text-base leading-relaxed text-black/50">{section.description}</p></div>{tile.image && <img src={tile.image} alt="" className="h-40 w-52 rounded-[24px] object-cover"/>}</div>
        <div className="mt-8 grid gap-5">
          {section.blocks.map((block) => <article key={block.id} className="break-inside-avoid overflow-hidden rounded-[24px] bg-[#eee3d3]">
            {(block.media ?? []).filter((m)=>m.type==="image").slice(0,2).length > 0 && <div className="grid grid-cols-2 gap-1">{(block.media ?? []).filter((m)=>m.type==="image").slice(0,2).map((m)=><img key={m.id} src={m.url} alt="" className="h-44 w-full object-cover"/>)}</div>}
            <div className="p-6"><div className="flex items-start justify-between gap-4"><h3 className="text-xl font-black">{block.title}</h3>{block.badge && <span className="rounded-full bg-white px-4 py-2 text-xs font-black">{block.badge}</span>}</div><p className="mt-3 whitespace-pre-line text-base leading-relaxed text-black/65">{block.content}</p>{block.mapQuery && <p className="mt-3 text-sm font-bold text-black/45">📍 {block.mapQuery}</p>}{block.phone && <p className="mt-2 text-sm font-bold">☎ {block.phone}</p>}{(block.media ?? []).some((m)=>m.type!=="image") && <p className="mt-3 text-xs text-black/40">Des vidéos/PDF complémentaires sont disponibles dans le livret digital.</p>}</div>
          </article>)}
        </div>
      </section>;
    })}

    <section className="a4-page mx-auto min-h-[1123px] w-[794px] bg-[#fbf9f5] p-14 shadow-2xl">
      <p className="font-serif text-4xl italic">{catalog.subtitle}</p><h2 className="mt-1 text-5xl font-black leading-[0.9] tracking-[-0.05em]">{catalog.title}</h2><p className="mt-5 max-w-[600px] text-base leading-relaxed text-black/50">{catalog.instructions}</p>
      <div className="mt-8 grid grid-cols-3 gap-4">{catalog.products.filter((p)=>p.active).sort((a,b)=>a.position-b.position).map((product)=><article key={product.id} className="break-inside-avoid overflow-hidden rounded-[22px] bg-[#eee3d3]">{product.image ? <img src={product.image} alt="" className="h-40 w-full object-cover"/> : <div className="grid h-40 place-items-center bg-black text-center text-sm font-black text-white/50">MINI BAR</div>}<div className="p-4"><div className="flex items-start justify-between gap-2"><h3 className="font-black">{product.name}</h3><strong className="whitespace-nowrap">{(product.priceCents/100).toFixed(2).replace(".",",")} €</strong></div><p className="mt-2 text-sm leading-relaxed text-black/50">{product.description}</p></div></article>)}</div>
      <div className="mt-10 rounded-[26px] bg-black p-6 text-white"><h3 className="text-xl font-black">Pour acheter un article</h3><p className="mt-2 text-sm leading-relaxed text-white/60">Ouvrez le livret digital, sélectionnez Mini bar / Boutique, choisissez vos articles et réglez en ligne avant de vous servir.</p></div>
    </section>
  </main>;
}
