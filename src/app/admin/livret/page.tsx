"use client";

import {
  ArrowLeft,
  BedDouble,
  BookOpen,
  Building2,
  Bus,
  Eye,
  HeartPulse,
  Home,
  Info,
  KeyRound,
  MapPin,
  MessageCircle,
  Palette,
  Plane,
  ScrollText,
  ShoppingBag,
  Utensils,
  Wifi,
} from "lucide-react";
import Link from "next/link";

const sections = [
  ["arrival", "Arrivée & départ", "Horaires, accès et consignes", KeyRound],
  ["wifi", "Wi-Fi", "Réseau et mot de passe", Wifi],
  ["bon-a-savoir", "Bon à savoir", "Équipements et informations utiles", Info],
  ["regles", "Les règles", "Consignes du logement", ScrollText],
  ["linge", "Linge & équipements", "Salle de bain et literie", BedDouble],
  ["restaurants", "Restaurants", "Bonnes adresses à proximité", Utensils],
  ["activites", "À découvrir", "Visites et activités", MapPin],
  ["commerces", "Commerces", "Courses à proximité", ShoppingBag],
  ["centres-commerciaux", "Centres commerciaux", "Shopping et loisirs", Building2],
  ["centres-interet", "Centres d’intérêt", "Aéroport, stade, arena et Eurexpo", Plane],
  ["transports", "Transports", "Bus, tramway et déplacements", Bus],
  ["urgences", "Urgences", "Numéros, hôpitaux et pharmacies", HeartPulse],
] as const;

export default function AdminGuidePage() {
  return (
    <main className="min-h-screen bg-[#e7dfd4] p-3 sm:p-5">
      <div className="mx-auto max-w-[1180px] overflow-hidden rounded-[28px] bg-[#faf8f4] shadow-xl">
        <header className="flex items-center justify-between border-b border-black/5 px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="grid h-10 w-10 place-items-center rounded-full bg-[#eee3d3]"><ArrowLeft size={18} /></Link>
            <div><p className="text-[9px] font-black tracking-[0.22em] text-black/40">THE BEDROOM</p><h1 className="text-lg font-black">Modifier le livret</h1></div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" target="_blank" className="flex h-10 items-center gap-2 rounded-full bg-[#eee3d3] px-4 text-xs font-black"><Eye size={16} />Aperçu</Link>
            <Link href="/admin" className="grid h-10 w-10 place-items-center rounded-full bg-black text-white"><Home size={18} /></Link>
          </div>
        </header>

        <section className="p-4 sm:p-7">
          <div className="rounded-[28px] bg-black p-6 text-white sm:p-8">
            <div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-full bg-white text-black"><BookOpen size={22} /></span><div><p className="font-serif text-2xl italic">Votre livret</p><h2 className="text-3xl font-black tracking-[-0.05em] sm:text-4xl">MODIFIER LE CONTENU</h2></div></div>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/60">Chaque carte ouvre exactement le contenu affiché derrière la même vignette dans le livret voyageur. Vous pouvez aussi ajouter des photos, vidéos et PDF dans chaque bloc.</p>
          </div>

          <section className="mt-8">
            <p className="font-serif text-2xl italic">Les informations</p>
            <h3 className="text-2xl font-black tracking-[-0.04em]">RUBRIQUES DU LIVRET</h3>
            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
              {sections.map(([slug, title, subtitle, Icon], index) => (
                <a key={slug} href={`/admin/${slug}`} className={`group flex min-h-[165px] flex-col rounded-[24px] p-4 transition hover:-translate-y-1 hover:shadow-lg ${index === 0 ? "bg-black text-white" : "bg-[#eee3d3] text-black"}`}>
                  <span className={`grid h-11 w-11 place-items-center rounded-full ${index === 0 ? "bg-white text-black" : "bg-white"}`}><Icon size={20} /></span>
                  <div className="mt-auto"><h4 className="font-black leading-tight">{title}</h4><p className={`mt-1 text-xs leading-relaxed ${index === 0 ? "text-white/55" : "text-black/45"}`}>{subtitle}</p><span className="mt-3 inline-block text-[10px] font-black uppercase tracking-[0.12em] opacity-45 group-hover:opacity-100">Modifier →</span></div>
                </a>
              ))}
            </div>
          </section>

          <section className="mt-10 border-t border-black/5 pt-8">
            <p className="font-serif text-2xl italic">Personnaliser</p><h3 className="text-2xl font-black tracking-[-0.04em]">APPARENCE & COORDONNÉES</h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <Setting href="/admin/apparence" icon={Palette} title="Apparence" subtitle="Photos, ordre et taille des vignettes" />
              <Setting href="/admin/contact" icon={MessageCircle} title="Contact & WhatsApp" subtitle="Numéro affiché aux voyageurs" />
              <Setting href="/" icon={Eye} title="Aperçu" subtitle="Voir la version voyageur" />
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}

function Setting({ href, icon: Icon, title, subtitle }: { href: string; icon: React.ElementType; title: string; subtitle: string }) {
  return <Link href={href} className="flex min-h-[135px] items-start gap-4 rounded-[24px] bg-white p-4 shadow-sm transition hover:-translate-y-1"><span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-[#eee3d3]"><Icon size={20} /></span><div><h4 className="font-black">{title}</h4><p className="mt-1 text-xs leading-relaxed text-black/45">{subtitle}</p></div></Link>;
}
