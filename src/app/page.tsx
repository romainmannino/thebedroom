"use client";

import {
  ArrowLeft,
  BedDouble,
  Building2,
  Bus,
  Check,
  Compass,
  Copy,
  HeartPulse,
  Home,
  Info,
  KeyRound,
  MapPin,
  MessageCircle,
  Phone,
  Plane,
  ScrollText,
  ShoppingBag,
  Utensils,
  Wifi,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  DEFAULT_HOME_CONFIGURATION,
  type GuideHomeConfiguration,
} from "@/lib/guide-home-config";
import {
  DEFAULT_GUIDE_CONTENT,
  mergeGuideContent,
  type GuideContentConfiguration,
  type GuideContentSection,
} from "@/lib/guide-content-config";

type SectionId = keyof typeof DEFAULT_GUIDE_CONTENT | "contact";

const iconById: Record<string, React.ElementType> = {
  arrival: KeyRound,
  wifi: Wifi,
  know: Info,
  rules: ScrollText,
  linen: BedDouble,
  restaurants: Utensils,
  activities: Compass,
  shops: ShoppingBag,
  malls: Building2,
  interests: Plane,
  transport: Bus,
  emergencies: HeartPulse,
};

export default function HomePage() {
  const [activeSection, setActiveSection] = useState<SectionId | null>(null);
  const [homeConfiguration, setHomeConfiguration] = useState<GuideHomeConfiguration>(DEFAULT_HOME_CONFIGURATION);
  const [guideContent, setGuideContent] = useState<GuideContentConfiguration>(DEFAULT_GUIDE_CONTENT);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const [appearanceResponse, contentResponse] = await Promise.all([
        fetch("/api/appearance", { cache: "no-store" }),
        fetch("/api/guide-content", { cache: "no-store" }),
      ]);

      const appearance = await appearanceResponse.json();
      const content = await contentResponse.json();

      if (appearanceResponse.ok && appearance.success) {
        setHomeConfiguration(appearance.configuration);
      }
      if (contentResponse.ok && content.success) {
        setGuideContent(mergeGuideContent(content.content));
      }
    }

    load().catch(console.error);
  }, []);

  const displayedTiles = useMemo(
    () =>
      [...homeConfiguration.tiles]
        .filter((tile) => tile.visible && guideContent[tile.id])
        .sort((a, b) => a.position - b.position),
    [guideContent, homeConfiguration.tiles],
  );

  async function copyValue(id: string, value: string) {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(id);
      window.setTimeout(() => setCopied(null), 1500);
    } catch {
      window.prompt("Copiez cette valeur :", value);
    }
  }

  const section = activeSection && activeSection !== "contact" ? guideContent[activeSection] : null;

  return (
    <main className="bg-[#e8dfd2]">
      <div className="relative mx-auto w-full max-w-[860px] overflow-hidden bg-[#fbf9f5] shadow-2xl">
        <section className="relative h-[46vh] min-h-[390px] max-h-[590px] overflow-hidden">
          <img src={homeConfiguration.heroImage} alt="The Bedroom" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-black/80" />
          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 text-white">
            <div className="text-xs font-bold tracking-[0.25em]">THE BEDROOM</div>
            <button type="button" onClick={() => setActiveSection("contact")} className="grid h-11 w-11 place-items-center rounded-full bg-white/15 backdrop-blur-md"><MessageCircle size={20} /></button>
          </div>
          <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-10">
            <p className="mb-1 font-serif text-4xl italic sm:text-5xl">{homeConfiguration.greeting}</p>
            <h1 className="max-w-lg text-4xl font-black leading-[0.92] tracking-[-0.05em] sm:text-6xl">{homeConfiguration.heroTitle}</h1>
            <p className="mt-3 max-w-md text-sm text-white/80">{homeConfiguration.heroSubtitle}</p>
          </div>
        </section>

        <section className="relative z-10 -mt-5 rounded-t-[30px] bg-[#fbf9f5] px-4 pb-5 pt-7 sm:px-8">
          <div className="mb-6">
            <p className="font-serif text-2xl italic">Votre livret</p>
            <h2 className="text-2xl font-black tracking-[-0.04em]">LES INFORMATIONS</h2>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {displayedTiles.map((tile, index) => {
              const Icon = iconById[tile.id] ?? Info;
              return (
                <button
                  key={tile.id}
                  type="button"
                  onClick={() => setActiveSection(tile.id as SectionId)}
                  className={`relative min-h-[150px] overflow-hidden rounded-[25px] text-left transition active:scale-[0.98] ${
                    tile.size === "full" ? "col-span-2 sm:col-span-3" : tile.size === "large" ? "col-span-2" : "col-span-1"
                  } ${tile.image ? "text-white" : index === 0 ? "bg-black text-white" : "bg-[#eee3d3] text-black"}`}
                >
                  {tile.image && <><img src={tile.image} alt="" className="absolute inset-0 h-full w-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" /></>}
                  <div className="relative flex h-full min-h-[150px] flex-col p-4">
                    <span className={`grid h-10 w-10 place-items-center rounded-full ${tile.image ? "bg-white/20 backdrop-blur" : "bg-white text-black"}`}><Icon size={20} /></span>
                    <div className="mt-auto"><strong className="block text-[15px] leading-tight">{tile.title}</strong><span className={`mt-1 block text-[11px] ${tile.image || index === 0 ? "text-white/70" : "text-black/50"}`}>{tile.subtitle}</span></div>
                  </div>
                </button>
              );
            })}
          </div>

          <nav className="mt-5 grid grid-cols-5 rounded-[24px] border border-black/5 bg-white p-2 shadow-xl">
            {[
              ["Accueil", Home, null],
              ["Séjour", KeyRound, "arrival"],
              ["Découvrir", Compass, "activities"],
              ["Adresses", Utensils, "restaurants"],
              ["Contact", MessageCircle, "contact"],
            ].map(([label, Icon, target]) => (
              <button key={label as string} type="button" onClick={() => setActiveSection(target as SectionId | null)} className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-[18px] text-[9px] font-bold text-black/55 first:bg-[#eee3d3] first:text-black">
                <Icon size={20} />{label as string}
              </button>
            ))}
          </nav>
        </section>

        {activeSection && (
          <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm">
            <section className="absolute inset-x-0 bottom-0 mx-auto max-h-[92vh] w-full max-w-[860px] overflow-y-auto rounded-t-[34px] bg-[#fbf9f5] px-5 pb-12 pt-5 sm:px-9">
              <div className="sticky top-0 z-10 mb-5 flex items-center justify-between bg-[#fbf9f5]/95 pb-3 backdrop-blur">
                <button type="button" onClick={() => setActiveSection(null)} className="flex items-center gap-2 text-sm font-bold"><ArrowLeft size={19} />Retour</button>
                <button type="button" onClick={() => setActiveSection(null)} className="grid h-10 w-10 place-items-center rounded-full bg-[#eee3d3]"><X size={19} /></button>
              </div>

              {section && <SectionContent section={section} copied={copied} onCopy={copyValue} />}

              {activeSection === "contact" && (
                <>
                  <Header script="Une question ?" title="CONTACT" icon={MessageCircle} />
                  <p className="mb-5 text-sm leading-relaxed text-black/60">Nous restons disponibles avant et pendant votre séjour.</p>
                  <div className="grid gap-3">
                    <a href="sms:+33627630932" className="flex min-h-14 items-center justify-center gap-2 rounded-full bg-black font-bold text-white"><MessageCircle size={19} />Envoyer un message WhatsApp</a>
                    <a href="tel:+33627630932" className="flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#eee3d3] font-bold"><Phone size={19} />Appeler le 06 27 63 09 32</a>
                  </div>
                </>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

function SectionContent({ section, copied, onCopy }: { section: GuideContentSection; copied: string | null; onCopy: (id: string, value: string) => void }) {
  const Icon = iconById[section.id] ?? Info;
  return (
    <>
      <Header script={section.script} title={section.title} icon={Icon} />
      <div className="space-y-4">
        {section.blocks.map((block) => (
          <article key={block.id} className={`rounded-[25px] p-5 ${block.copyValue ? "bg-black text-white" : "bg-[#eee3d3]"}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center justify-between gap-2"><h3 className="font-black">{block.title}</h3>{block.badge && <span className="rounded-full bg-white px-3 py-2 text-[10px] font-black text-black">{block.badge}</span>}</div>
                <p className={`mt-3 whitespace-pre-line text-sm leading-relaxed ${block.copyValue ? "text-white/70" : "text-black/65"}`}>{block.content}</p>
              </div>
              {block.copyValue && <button type="button" onClick={() => onCopy(block.id, block.copyValue!)} className="grid h-11 w-11 flex-none place-items-center rounded-full bg-[#eee3d3] text-black">{copied === block.id ? <Check size={19} /> : <Copy size={19} />}</button>}
            </div>
            {(block.mapQuery || block.phone) && <div className="mt-4 flex flex-wrap gap-2">{block.mapQuery && <button type="button" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(block.mapQuery!)}`, "_blank")} className="rounded-full bg-white px-4 py-2 text-xs font-black"><MapPin size={14} className="mr-1 inline" />Itinéraire</button>}{block.phone && <a href={`tel:${block.phone}`} className="rounded-full bg-white px-4 py-2 text-xs font-black"><Phone size={14} className="mr-1 inline" />Appeler</a>}</div>}
          </article>
        ))}
      </div>
    </>
  );
}

function Header({ script, title, icon: Icon }: { script: string; title: string; icon: React.ElementType }) {
  return <div className="mb-7"><span className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-[#eee3d3]"><Icon size={22} /></span><p className="font-serif text-3xl italic">{script}</p><h2 className="text-4xl font-black leading-[0.92] tracking-[-0.05em]">{title}</h2></div>;
}
