"use client";

import { ArrowLeft, Download, Home, MapPin, Phone, Printer, QrCode } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DEFAULT_GUIDE_CONTENT, mergeGuideContent, type GuideContentBlock, type GuideContentConfiguration, type GuideContentSection } from "@/lib/guide-content-config";
import { DEFAULT_HOME_CONFIGURATION, type GuideHomeConfiguration, type HomeTileConfiguration } from "@/lib/guide-home-config";
import { DEFAULT_MINIBAR_CATALOG, type MinibarCatalog } from "@/lib/minibar-config";

export default function A4GuidePage() {
  const [home, setHome] = useState<GuideHomeConfiguration>(DEFAULT_HOME_CONFIGURATION);
  const [content, setContent] = useState<GuideContentConfiguration>(DEFAULT_GUIDE_CONTENT);
  const [catalog, setCatalog] = useState<MinibarCatalog>(DEFAULT_MINIBAR_CATALOG);
  const [loading, setLoading] = useState(true);
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
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

  const sections = useMemo(
    () => [...home.tiles]
      .filter((tile) => tile.visible && content[tile.id] && tile.id !== "minibar")
      .sort((a, b) => a.position - b.position),
    [content, home.tiles],
  );

  const shopUrl = origin ? `${origin}/boutique` : "https://thebedroom.vercel.app/boutique";
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=360x360&margin=12&data=${encodeURIComponent(shopUrl)}`;

  if (loading) return <main className="grid min-h-screen place-items-center bg-[#e7dfd4] font-bold">Préparation du livret…</main>;

  return <main className="min-h-screen bg-[#d8d1c7] py-5 print:bg-white print:py-0">
    <style jsx global>{`
      @page { size: A4 portrait; margin: 0; }
      html, body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
      .a4-page { width: 794px; height: 1123px; overflow: hidden; }
      @media print {
        html, body { margin: 0 !important; padding: 0 !important; background: white !important; }
        .no-print { display: none !important; }
        .a4-page {
          width: 210mm !important;
          height: 297mm !important;
          min-height: 297mm !important;
          max-height: 297mm !important;
          margin: 0 !important;
          overflow: hidden !important;
          box-shadow: none !important;
          page-break-after: always !important;
          break-after: page !important;
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        .a4-page:last-child { page-break-after: auto !important; break-after: auto !important; }
      }
    `}</style>

    <div className="no-print sticky top-3 z-50 mx-auto mb-5 flex max-w-[900px] items-center justify-between rounded-full bg-black p-2 pl-3 text-white shadow-2xl">
      <Link href="/admin/livret" className="flex items-center gap-2 px-3 text-sm font-bold"><ArrowLeft size={18}/>Retour</Link>
      <div className="flex gap-2"><Link href="/admin" className="grid h-11 w-11 place-items-center rounded-full bg-white/10"><Home size={18}/></Link><button onClick={()=>window.print()} className="flex h-11 items-center gap-2 rounded-full bg-[#eee3d3] px-5 text-sm font-black text-black"><Download size={17}/>Télécharger le PDF</button></div>
    </div>

    <CoverPage home={home} />

    {sections.map((tile, index) => (
      <GuidePage
        key={tile.id}
        tile={tile}
        section={content[tile.id]}
        pageNumber={index + 2}
      />
    ))}

    <MinibarPage catalog={catalog} shopUrl={shopUrl} qrUrl={qrUrl} pageNumber={sections.length + 2} />
  </main>;
}

function CoverPage({ home }: { home: GuideHomeConfiguration }) {
  return <section className="a4-page relative mx-auto bg-[#f7f1e8] shadow-2xl">
    <div className="h-[54%] overflow-hidden bg-black"><img src={home.heroImage} alt="The Bedroom" className="h-full w-full object-cover" /></div>
    <div className="relative h-[46%] px-14 pb-12 pt-10">
      <div className="absolute right-14 top-10 text-[10px] font-black tracking-[0.28em] text-black/35">THE BEDROOM · JONAGE</div>
      <p className="font-serif text-5xl italic leading-none text-black/70">{home.greeting}</p>
      <h1 className="mt-4 max-w-[650px] text-[58px] font-black uppercase leading-[0.86] tracking-[-0.06em] text-black">{home.heroTitle}</h1>
      <p className="mt-6 max-w-[540px] text-[17px] leading-relaxed text-black/55">{home.heroSubtitle}</p>
      <div className="absolute bottom-12 left-14 flex items-center gap-3 rounded-full bg-black px-6 py-4 text-sm font-black text-white"><Printer size={18}/> LIVRET D’ACCUEIL</div>
      <Footer pageNumber={1} />
    </div>
  </section>;
}

function GuidePage({ tile, section, pageNumber }: { tile: HomeTileConfiguration; section: GuideContentSection; pageNumber: number }) {
  const blocks = section.blocks;
  const compact = blocks.length >= 6;
  return <section className="a4-page relative mx-auto bg-[#fbf9f5] px-12 pb-12 pt-11 shadow-2xl">
    <div className="grid grid-cols-[1fr_190px] items-start gap-8 border-b-2 border-black pb-7">
      <div>
        <p className="font-serif text-[31px] italic leading-none text-black/55">{section.script}</p>
        <h2 className="mt-2 text-[43px] font-black uppercase leading-[0.88] tracking-[-0.05em]">{section.title}</h2>
        <p className="mt-4 max-w-[500px] text-[13px] leading-relaxed text-black/50">{section.description}</p>
      </div>
      {tile.image ? <img src={tile.image} alt="" className="h-[128px] w-[190px] rounded-[22px] object-cover" /> : <div className="grid h-[128px] w-[190px] place-items-center rounded-[22px] bg-[#eee3d3] text-[11px] font-black uppercase tracking-[0.14em] text-black/30">The Bedroom</div>}
    </div>

    <div className={`mt-7 grid ${blocks.length === 1 ? "grid-cols-1" : "grid-cols-2"} gap-4`}>
      {blocks.map((block) => <PrintBlock key={block.id} block={block} compact={compact} />)}
    </div>
    <Footer pageNumber={pageNumber} />
  </section>;
}

function PrintBlock({ block, compact }: { block: GuideContentBlock; compact: boolean }) {
  const image = (block.media ?? []).find((media) => media.type === "image");
  return <article className={`overflow-hidden rounded-[20px] bg-[#eee3d3] ${compact ? "min-h-[126px]" : "min-h-[150px]"}`}>
    {image && <img src={image.url} alt={image.name} className={`${compact ? "h-[72px]" : "h-[96px]"} w-full object-cover`} />}
    <div className={compact ? "p-4" : "p-5"}>
      <div className="flex items-start justify-between gap-3">
        <h3 className={`${compact ? "text-[14px]" : "text-[16px]"} font-black leading-tight`}>{block.title}</h3>
        {block.badge && <span className="whitespace-nowrap rounded-full bg-white px-3 py-1.5 text-[9px] font-black">{block.badge}</span>}
      </div>
      <p className={`mt-2 whitespace-pre-line ${compact ? "text-[10px] leading-[1.4]" : "text-[11px] leading-[1.5]"} text-black/60`}>{block.content}</p>
      {(block.mapQuery || block.phone) && <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[9px] font-bold text-black/45">
        {block.mapQuery && <span className="inline-flex items-center gap-1"><MapPin size={10}/>{block.mapQuery}</span>}
        {block.phone && <span className="inline-flex items-center gap-1"><Phone size={10}/>{block.phone}</span>}
      </div>}
      {(block.media ?? []).some((media) => media.type !== "image") && <p className="mt-2 text-[8px] font-bold uppercase tracking-[0.08em] text-black/30">Vidéo / PDF disponible dans le livret digital</p>}
    </div>
  </article>;
}

function MinibarPage({ catalog, shopUrl, qrUrl, pageNumber }: { catalog: MinibarCatalog; shopUrl: string; qrUrl: string; pageNumber: number }) {
  const products = [...catalog.products].filter((product) => product.active).sort((a, b) => a.position - b.position);
  return <section className="a4-page relative mx-auto bg-[#171717] px-10 pb-12 pt-10 text-white shadow-2xl">
    <div className="grid grid-cols-[1fr_145px] gap-7 rounded-[26px] bg-[#eee3d3] p-6 text-black">
      <div>
        <p className="font-serif text-[29px] italic leading-none">{catalog.subtitle}</p>
        <h2 className="mt-2 text-[40px] font-black uppercase leading-[0.9] tracking-[-0.05em]">{catalog.title}</h2>
        <p className="mt-4 max-w-[480px] text-[12px] leading-relaxed text-black/55">{catalog.instructions}</p>
        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-black px-4 py-2 text-[10px] font-black uppercase tracking-[0.08em] text-white"><QrCode size={13}/> Scannez pour commander</div>
      </div>
      <div className="rounded-[19px] bg-white p-3 text-center shadow-sm"><img src={qrUrl} alt="QR code Mini bar" className="mx-auto h-[116px] w-[116px]"/><p className="mt-2 text-[8px] font-black uppercase tracking-[0.08em]">Mini bar en ligne</p></div>
    </div>

    <div className="mt-6 grid grid-cols-4 gap-2.5">
      {products.map((product) => <article key={product.id} className="overflow-hidden rounded-[14px] bg-white text-black">
        {product.image ? <img src={product.image} alt="" className="h-[48px] w-full object-cover" /> : <div className="grid h-[48px] place-items-center bg-[#eee3d3] px-2 text-center text-[7px] font-black uppercase tracking-[0.06em] text-black/30">{product.category}</div>}
        <div className="p-2.5">
          <div className="flex items-start justify-between gap-1.5"><h3 className="text-[9px] font-black leading-tight">{product.name}</h3><strong className="whitespace-nowrap text-[10px]">{(product.priceCents/100).toFixed(2).replace(".",",")} €</strong></div>
          <p className="mt-1 line-clamp-2 text-[7px] leading-tight text-black/45">{product.description}</p>
        </div>
      </article>)}
    </div>

    <div className="absolute bottom-11 left-10 right-10 flex items-end justify-between border-t border-white/15 pt-4">
      <div><p className="text-[9px] font-black uppercase tracking-[0.15em] text-white/35">Commande & paiement</p><p className="mt-1 text-[10px] text-white/65">{shopUrl}</p></div>
      <span className="text-[10px] font-black text-white/45">THE BEDROOM · {pageNumber}</span>
    </div>
  </section>;
}

function Footer({ pageNumber }: { pageNumber: number }) {
  return <div className="absolute bottom-8 left-12 right-12 flex items-center justify-between border-t border-black/10 pt-3 text-[9px] font-black uppercase tracking-[0.14em] text-black/30"><span>THE BEDROOM · LIVRET D’ACCUEIL</span><span>{pageNumber}</span></div>;
}
