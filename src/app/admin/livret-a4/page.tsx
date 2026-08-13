"use client";

import { ArrowLeft, Download, FilePenLine, Home, MapPin, Phone, QrCode } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DEFAULT_GUIDE_CONTENT, mergeGuideContent, type GuideContentBlock, type GuideContentConfiguration, type GuideContentSection } from "@/lib/guide-content-config";
import { DEFAULT_HOME_CONFIGURATION, type GuideHomeConfiguration, type HomeTileConfiguration } from "@/lib/guide-home-config";
import { DEFAULT_MINIBAR_CATALOG, type MinibarCatalog } from "@/lib/minibar-config";

function escapeWifiValue(value: string) {
  return value.replace(/([\\;,:"])/g, "\\$1");
}

async function loadPptxGen() {
  const existing = (window as unknown as { PptxGenJS?: new () => any }).PptxGenJS;
  if (existing) return existing;

  await new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/gh/gitbrent/PptxGenJS@4.0.1/dist/pptxgen.bundle.js";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Impossible de charger le générateur Canva"));
    document.head.appendChild(script);
  });

  const loaded = (window as unknown as { PptxGenJS?: new () => any }).PptxGenJS;
  if (!loaded) throw new Error("Générateur Canva indisponible");
  return loaded;
}

async function imageToDataUri(url: string) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error("Image inaccessible");
  const blob = await response.blob();
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

async function addImageSafe(slide: any, url: string | undefined, options: Record<string, unknown>) {
  if (!url) return;
  try {
    const data = await imageToDataUri(url);
    slide.addImage({ data, ...options });
  } catch {
    // Les textes restent éditables même si une image distante refuse le chargement.
  }
}

export default function A4GuidePage() {
  const [home, setHome] = useState<GuideHomeConfiguration>(DEFAULT_HOME_CONFIGURATION);
  const [content, setContent] = useState<GuideContentConfiguration>(DEFAULT_GUIDE_CONTENT);
  const [catalog, setCatalog] = useState<MinibarCatalog>(DEFAULT_MINIBAR_CATALOG);
  const [loading, setLoading] = useState(true);
  const [canvaLoading, setCanvaLoading] = useState(false);
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

  const minibarVisible = useMemo(
    () => home.tiles.some((tile) => tile.id === "minibar" && tile.visible),
    [home.tiles],
  );

  const shopUrl = origin ? `${origin}/boutique` : "https://www.thebedroom.fr/boutique";
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=360x360&margin=12&data=${encodeURIComponent(shopUrl)}`;

  async function downloadCanvaVersion() {
    setCanvaLoading(true);
    try {
      const PptxGenJS = await loadPptxGen();
      const pptx = new PptxGenJS();
      pptx.defineLayout({ name: "A4", width: 8.27, height: 11.69 });
      pptx.layout = "A4";
      pptx.author = "The Bedroom";
      pptx.subject = "Livret d’accueil éditable dans Canva";
      pptx.title = "The Bedroom · Livret d’accueil";
      pptx.company = "The Bedroom";
      pptx.lang = "fr-FR";
      pptx.theme = {
        headFontFace: "Arial",
        bodyFontFace: "Arial",
        lang: "fr-FR",
      };

      const addFooter = (slide: any, pageNumber: number, dark = false) => {
        slide.addText("THE BEDROOM · LIVRET D’ACCUEIL", { x: 0.55, y: 11.08, w: 4.2, h: 0.18, fontFace: "Arial", fontSize: 7.5, bold: true, color: dark ? "8F8F8F" : "A9A096", charSpacing: 1.2, margin: 0 });
        slide.addText(String(pageNumber), { x: 7.05, y: 11.08, w: 0.55, h: 0.18, fontFace: "Arial", fontSize: 7.5, bold: true, color: dark ? "8F8F8F" : "A9A096", align: "right", margin: 0 });
      };

      const cover = pptx.addSlide();
      cover.background = { color: "F7F1E8" };
      await addImageSafe(cover, home.heroImage, { x: 0, y: 0, w: 8.27, h: 6.65 });
      cover.addText("THE BEDROOM · JONAGE", { x: 5.8, y: 7.05, w: 1.9, h: 0.2, fontSize: 7.5, bold: true, color: "9E968B", charSpacing: 1.4, align: "right", margin: 0 });
      cover.addText(home.greeting, { x: 0.65, y: 7.1, w: 6.6, h: 0.55, fontFace: "Georgia", fontSize: 30, italic: true, color: "5A5650", margin: 0 });
      cover.addText(home.heroTitle, { x: 0.65, y: 7.8, w: 6.8, h: 1.65, fontSize: 38, bold: true, color: "111111", breakLine: false, fit: "shrink", margin: 0 });
      cover.addText(home.heroSubtitle, { x: 0.65, y: 9.65, w: 5.7, h: 0.55, fontSize: 12, color: "77716A", margin: 0 });
      addFooter(cover, 1);

      for (let index = 0; index < sections.length; index += 1) {
        const tile = sections[index];
        const section = content[tile.id];
        const slide = pptx.addSlide();
        slide.background = { color: "FBF9F5" };

        slide.addText(section.script, { x: 0.55, y: 0.55, w: 4.9, h: 0.35, fontFace: "Georgia", fontSize: 20, italic: true, color: "77716A", margin: 0 });
        slide.addText(section.title, { x: 0.55, y: 0.95, w: 5.1, h: 0.78, fontSize: 27, bold: true, color: "111111", fit: "shrink", margin: 0 });
        slide.addText(section.description, { x: 0.55, y: 1.85, w: 5.2, h: 0.4, fontSize: 9, color: "837C73", margin: 0 });
        await addImageSafe(slide, tile.image, { x: 5.85, y: 0.55, w: 1.85, h: 1.45 });

        let top = 2.55;
        if (section.id === "wifi") {
          const network = section.blocks.find((block) => block.id === "wifi-network")?.copyValue ?? section.blocks.find((block) => block.id === "wifi-network")?.content ?? "";
          const password = section.blocks.find((block) => block.id === "wifi-password")?.copyValue ?? section.blocks.find((block) => block.id === "wifi-password")?.content ?? "";
          const payload = network ? `WIFI:T:WPA;S:${escapeWifiValue(network)};P:${escapeWifiValue(password)};;` : "";
          if (payload) {
            const wifiQr = `https://api.qrserver.com/v1/create-qr-code/?size=420x420&margin=14&data=${encodeURIComponent(payload)}`;
            slide.addText("CONNEXION RAPIDE", { x: 2.35, y: 2.6, w: 2.7, h: 0.22, fontSize: 8, bold: true, color: "9A9389", charSpacing: 1.1, margin: 0 });
            slide.addText("Scannez pour rejoindre le Wi-Fi", { x: 2.35, y: 2.9, w: 4.4, h: 0.35, fontSize: 15, bold: true, color: "111111", margin: 0 });
            slide.addText("Le QR code contient automatiquement le nom du réseau et le mot de passe.", { x: 2.35, y: 3.35, w: 4.5, h: 0.45, fontSize: 8.5, color: "77716A", margin: 0 });
            await addImageSafe(slide, wifiQr, { x: 0.65, y: 2.5, w: 1.4, h: 1.4 });
            top = 4.15;
          }
        }

        const blocks = section.blocks;
        const cols = blocks.length === 1 ? 1 : 2;
        const rows = Math.ceil(blocks.length / cols);
        const availableHeight = 10.65 - top;
        const gap = 0.16;
        const cardHeight = Math.min(2.25, (availableHeight - gap * Math.max(0, rows - 1)) / Math.max(1, rows));
        const cardWidth = cols === 1 ? 7.1 : 3.45;

        for (let i = 0; i < blocks.length; i += 1) {
          const block = blocks[i];
          const col = i % cols;
          const row = Math.floor(i / cols);
          const x = 0.55 + col * (cardWidth + 0.18);
          const y = top + row * (cardHeight + gap);
          const image = (block.media ?? []).find((media) => media.type === "image");
          const imageHeight = image ? Math.min(0.95, Math.max(0.55, cardHeight * 0.42)) : 0;

          slide.addText("", { x, y, w: cardWidth, h: cardHeight, fill: { color: "EEE3D3" }, line: { color: "EEE3D3" }, radius: 0.12, margin: 0 });
          if (image) await addImageSafe(slide, image.url, { x, y, w: cardWidth, h: imageHeight });
          const textTop = y + imageHeight + 0.15;
          slide.addText(block.title, { x: x + 0.18, y: textTop, w: cardWidth - 0.36, h: 0.34, fontSize: 11, bold: true, color: "111111", fit: "shrink", margin: 0 });
          slide.addText(block.content, { x: x + 0.18, y: textTop + 0.43, w: cardWidth - 0.36, h: Math.max(0.4, cardHeight - imageHeight - 0.72), fontSize: 8, color: "6F6962", fit: "shrink", valign: "top", margin: 0 });
          if (block.badge) slide.addText(block.badge, { x: x + cardWidth - 1.35, y: textTop - 0.04, w: 1.15, h: 0.27, fontSize: 6.5, bold: true, align: "center", fill: { color: "FFFFFF" }, color: "111111", margin: 0.03 });
        }
        addFooter(slide, index + 2);
      }

      if (minibarVisible) {
        const slide = pptx.addSlide();
        slide.background = { color: "171717" };
        slide.addText(catalog.subtitle, { x: 0.55, y: 0.55, w: 5.2, h: 0.4, fontFace: "Georgia", fontSize: 20, italic: true, color: "111111", fill: { color: "EEE3D3" }, margin: 0.05 });
        slide.addText(catalog.title, { x: 0.55, y: 1.05, w: 5.3, h: 0.65, fontSize: 26, bold: true, color: "111111", fill: { color: "EEE3D3" }, margin: 0.05 });
        slide.addText(catalog.instructions, { x: 0.55, y: 1.8, w: 5.4, h: 0.5, fontSize: 8.5, color: "6F6962", fill: { color: "EEE3D3" }, margin: 0.05 });
        await addImageSafe(slide, qrUrl, { x: 6.15, y: 0.65, w: 1.35, h: 1.35 });

        const products = [...catalog.products].filter((product) => product.active).sort((a, b) => a.position - b.position);
        const cols = 4;
        const rows = Math.ceil(products.length / cols);
        const gap = 0.12;
        const cardW = 1.78;
        const cardH = Math.min(1.62, (8.1 - gap * Math.max(0, rows - 1)) / Math.max(1, rows));
        for (let i = 0; i < products.length; i += 1) {
          const product = products[i];
          const col = i % cols;
          const row = Math.floor(i / cols);
          const x = 0.45 + col * (cardW + 0.12);
          const y = 2.65 + row * (cardH + gap);
          slide.addText("", { x, y, w: cardW, h: cardH, fill: { color: "FFFFFF" }, line: { color: "FFFFFF" }, margin: 0 });
          if (product.image) await addImageSafe(slide, product.image, { x, y, w: cardW, h: Math.min(0.72, cardH * 0.45) });
          const textY = y + (product.image ? Math.min(0.72, cardH * 0.45) : 0.08);
          slide.addText(product.name, { x: x + 0.1, y: textY + 0.08, w: cardW - 0.2, h: 0.3, fontSize: 7.6, bold: true, color: "111111", fit: "shrink", margin: 0 });
          slide.addText(`${(product.priceCents / 100).toFixed(2).replace(".", ",")} €`, { x: x + 0.1, y: y + cardH - 0.31, w: cardW - 0.2, h: 0.2, fontSize: 8, bold: true, color: "111111", align: "right", margin: 0 });
        }
        addFooter(slide, sections.length + 2, true);
      }

      await pptx.writeFile({ fileName: "The-Bedroom-Livret-Canva.pptx" });
    } catch (error) {
      console.error(error);
      alert("La version Canva n’a pas pu être générée. Réessayez dans quelques secondes.");
    } finally {
      setCanvaLoading(false);
    }
  }

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

    <div className="no-print sticky top-3 z-50 mx-auto mb-5 flex max-w-[980px] items-center justify-between rounded-full bg-black p-2 pl-3 text-white shadow-2xl">
      <Link href="/admin/livret" className="flex items-center gap-2 px-3 text-sm font-bold"><ArrowLeft size={18}/>Retour</Link>
      <div className="flex gap-2">
        <Link href="/admin" className="grid h-11 w-11 place-items-center rounded-full bg-white/10"><Home size={18}/></Link>
        <button onClick={downloadCanvaVersion} disabled={canvaLoading} className="flex h-11 items-center gap-2 rounded-full bg-white/10 px-5 text-sm font-black text-white disabled:opacity-50"><FilePenLine size={17}/>{canvaLoading ? "Création…" : "Version Canva"}</button>
        <button onClick={()=>window.print()} className="flex h-11 items-center gap-2 rounded-full bg-[#eee3d3] px-5 text-sm font-black text-black"><Download size={17}/>Télécharger le PDF</button>
      </div>
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

    {minibarVisible && <MinibarPage catalog={catalog} shopUrl={shopUrl} qrUrl={qrUrl} pageNumber={sections.length + 2} />}
  </main>;
}

function CoverPage({ home }: { home: GuideHomeConfiguration }) {
  return <section className="a4-page relative mx-auto bg-[#f7f1e8] shadow-2xl">
    <div className="h-[57%] overflow-hidden bg-black"><img src={home.heroImage} alt="The Bedroom" className="h-full w-full object-cover" /></div>
    <div className="relative h-[43%] px-14 pb-12 pt-10">
      <div className="absolute right-14 top-10 text-[10px] font-black tracking-[0.28em] text-black/35">THE BEDROOM · JONAGE</div>
      <p className="font-serif text-5xl italic leading-none text-black/70">{home.greeting}</p>
      <h1 className="mt-4 max-w-[650px] text-[58px] font-black uppercase leading-[0.86] tracking-[-0.06em] text-black">{home.heroTitle}</h1>
      <p className="mt-6 max-w-[540px] text-[17px] leading-relaxed text-black/55">{home.heroSubtitle}</p>
      <Footer pageNumber={1} />
    </div>
  </section>;
}

function GuidePage({ tile, section, pageNumber }: { tile: HomeTileConfiguration; section: GuideContentSection; pageNumber: number }) {
  const blocks = section.blocks;
  const roomy = blocks.length <= 4;
  const medium = blocks.length >= 5 && blocks.length <= 6;
  const compact = blocks.length >= 7;
  const wifiNetwork = section.id === "wifi" ? blocks.find((block) => block.id === "wifi-network")?.copyValue ?? blocks.find((block) => block.id === "wifi-network")?.content ?? "" : "";
  const wifiPassword = section.id === "wifi" ? blocks.find((block) => block.id === "wifi-password")?.copyValue ?? blocks.find((block) => block.id === "wifi-password")?.content ?? "" : "";
  const wifiPayload = wifiNetwork ? `WIFI:T:WPA;S:${escapeWifiValue(wifiNetwork)};P:${escapeWifiValue(wifiPassword)};;` : "";
  const wifiQrUrl = wifiPayload ? `https://api.qrserver.com/v1/create-qr-code/?size=420x420&margin=14&data=${encodeURIComponent(wifiPayload)}` : "";

  return <section className="a4-page relative mx-auto bg-[#fbf9f5] px-12 pb-12 pt-11 shadow-2xl">
    <div className={`grid ${roomy ? "grid-cols-[1fr_230px]" : "grid-cols-[1fr_210px]"} items-start gap-8 border-b-2 border-black pb-7`}>
      <div>
        <p className="font-serif text-[31px] italic leading-none text-black/55">{section.script}</p>
        <h2 className="mt-2 text-[43px] font-black uppercase leading-[0.88] tracking-[-0.05em]">{section.title}</h2>
        <p className="mt-4 max-w-[500px] text-[13px] leading-relaxed text-black/50">{section.description}</p>
      </div>
      {tile.image ? <img src={tile.image} alt="" className={`${roomy ? "h-[154px] w-[230px]" : medium ? "h-[142px] w-[210px]" : "h-[128px] w-[190px]"} rounded-[22px] object-cover`} /> : <div className={`grid ${roomy ? "h-[154px] w-[230px]" : medium ? "h-[142px] w-[210px]" : "h-[128px] w-[190px]"} place-items-center rounded-[22px] bg-[#eee3d3] text-[11px] font-black uppercase tracking-[0.14em] text-black/30`}>The Bedroom</div>}
    </div>

    {section.id === "wifi" && wifiQrUrl && <div className="mt-7 grid grid-cols-[150px_1fr] items-center gap-6 rounded-[24px] bg-white p-5 shadow-sm ring-1 ring-black/5">
      <img src={wifiQrUrl} alt="QR code Wi-Fi" className="h-[150px] w-[150px] rounded-[14px]" />
      <div><p className="text-[10px] font-black uppercase tracking-[0.14em] text-black/35">Connexion rapide</p><h3 className="mt-1 text-[20px] font-black">Scannez pour rejoindre le Wi-Fi</h3><p className="mt-2 text-[11px] leading-relaxed text-black/55">Le QR code contient automatiquement le nom du réseau et son mot de passe.</p></div>
    </div>}

    <div className={`mt-7 grid ${blocks.length === 1 ? "grid-cols-1" : "grid-cols-2"} gap-4`}>
      {blocks.map((block) => <PrintBlock key={block.id} block={block} roomy={roomy && section.id !== "wifi"} medium={medium} compact={compact} />)}
    </div>
    <Footer pageNumber={pageNumber} />
  </section>;
}

function PrintBlock({ block, roomy, medium, compact }: { block: GuideContentBlock; roomy: boolean; medium: boolean; compact: boolean }) {
  const image = (block.media ?? []).find((media) => media.type === "image");
  const cardHeight = roomy ? "min-h-[205px]" : medium ? "min-h-[184px]" : compact ? "min-h-[126px]" : "min-h-[160px]";
  const imageHeight = roomy ? "h-[154px]" : medium ? "h-[112px]" : compact ? "h-[72px]" : "h-[108px]";
  const padding = compact ? "p-4" : medium ? "p-[18px]" : "p-5";
  return <article className={`overflow-hidden rounded-[20px] bg-[#eee3d3] ${cardHeight}`}>
    {image && <img src={image.url} alt={image.name} className={`${imageHeight} w-full object-cover`} />}
    <div className={padding}>
      <div className="flex items-start justify-between gap-3">
        <h3 className={`${compact ? "text-[14px]" : medium ? "text-[15px]" : "text-[16px]"} font-black leading-tight`}>{block.title}</h3>
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
