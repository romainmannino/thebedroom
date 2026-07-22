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
  Settings,
  ShoppingBag,
  Utensils,
  Wifi,
} from "lucide-react";
import Link from "next/link";

const contentSections = [
  {
    id: "arrival",
    title: "Arrivée & départ",
    subtitle: "Horaires, accès et consignes",
    icon: KeyRound,
    href: "/admin/parametres",
  },
  {
    id: "wifi",
    title: "Wi-Fi",
    subtitle: "Réseau et mot de passe",
    icon: Wifi,
    href: "/admin/parametres",
  },
  {
    id: "know",
    title: "Bon à savoir",
    subtitle: "Équipements et informations utiles",
    icon: Info,
    href: "/admin/bon-a-savoir",
  },
  {
    id: "rules",
    title: "Les règles",
    subtitle: "Consignes du logement",
    icon: ScrollText,
    href: "/admin/regles",
  },
  {
    id: "linen",
    title: "Linge & équipements",
    subtitle: "Salle de bain et literie",
    icon: BedDouble,
    href: "/admin/linge",
  },
  {
    id: "restaurants",
    title: "Restaurants",
    subtitle: "Bonnes adresses à proximité",
    icon: Utensils,
    href: "/admin/restaurants",
  },
  {
    id: "activities",
    title: "À découvrir",
    subtitle: "Visites et activités",
    icon: MapPin,
    href: "/admin/activites",
  },
  {
    id: "shops",
    title: "Commerces",
    subtitle: "Courses à proximité",
    icon: ShoppingBag,
    href: "/admin/commerces",
  },
  {
    id: "malls",
    title: "Centres commerciaux",
    subtitle: "Shopping et loisirs",
    icon: Building2,
    href: "/admin/centres-commerciaux",
  },
  {
    id: "interests",
    title: "Centres d’intérêt",
    subtitle: "Aéroport, stade, arena et Eurexpo",
    icon: Plane,
    href: "/admin/centres-interet",
  },
  {
    id: "transport",
    title: "Transports",
    subtitle: "Bus, tramway et déplacements",
    icon: Bus,
    href: "/admin/transports",
  },
  {
    id: "emergencies",
    title: "Urgences",
    subtitle: "Numéros, hôpitaux et pharmacies",
    icon: HeartPulse,
    href: "/admin/urgences",
  },
];

const settingsSections = [
  {
    title: "Apparence",
    subtitle: "Photos, ordre et taille des vignettes",
    icon: Palette,
    href: "/admin/apparence",
  },
  {
    title: "Contact & WhatsApp",
    subtitle: "Numéro de téléphone affiché aux voyageurs",
    icon: MessageCircle,
    href: "/admin/contact",
  },
  {
    title: "Paramètres généraux",
    subtitle: "Logement, accès et informations principales",
    icon: Settings,
    href: "/admin/parametres",
  },
];

export default function AdminGuidePage() {
  return (
    <main className="min-h-screen bg-[#e7dfd4] p-3 sm:p-5">
      <div className="mx-auto min-h-[calc(100vh-24px)] max-w-[1180px] overflow-hidden rounded-[28px] bg-[#faf8f4] shadow-xl">
        <header className="flex items-center justify-between border-b border-black/5 px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="grid h-10 w-10 place-items-center rounded-full bg-[#eee3d3]"
              aria-label="Retour à l’administration"
            >
              <ArrowLeft size={18} />
            </Link>

            <div>
              <p className="text-[9px] font-black tracking-[0.22em] text-black/40">
                THE BEDROOM
              </p>
              <h1 className="text-lg font-black">Modifier le livret</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="flex h-10 items-center gap-2 rounded-full bg-[#eee3d3] px-4 text-xs font-black"
            >
              <Eye size={16} />
              Aperçu
            </Link>
            <Link
              href="/admin"
              className="grid h-10 w-10 place-items-center rounded-full bg-black text-white"
              aria-label="Accueil admin"
            >
              <Home size={18} />
            </Link>
          </div>
        </header>

        <section className="p-4 sm:p-7">
          <div className="rounded-[28px] bg-black p-6 text-white sm:p-8">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-white text-black">
                <BookOpen size={22} />
              </span>
              <div>
                <p className="font-serif text-2xl italic">Votre livret</p>
                <h2 className="text-3xl font-black tracking-[-0.05em] sm:text-4xl">
                  MODIFIER LE CONTENU
                </h2>
              </div>
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/60">
              Choisissez directement la rubrique que vous souhaitez modifier. L’organisation reprend celle du livret visible par les voyageurs.
            </p>
          </div>

          <section className="mt-8">
            <p className="font-serif text-2xl italic">Les informations</p>
            <h3 className="text-2xl font-black tracking-[-0.04em]">
              RUBRIQUES DU LIVRET
            </h3>

            <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
              {contentSections.map((section, index) => {
                const Icon = section.icon;
                return (
                  <Link
                    key={section.id}
                    href={section.href}
                    className={`group flex min-h-[165px] flex-col rounded-[24px] p-4 transition hover:-translate-y-1 hover:shadow-lg ${
                      index === 0
                        ? "bg-black text-white"
                        : "bg-[#eee3d3] text-black"
                    }`}
                  >
                    <span
                      className={`grid h-11 w-11 place-items-center rounded-full ${
                        index === 0 ? "bg-white text-black" : "bg-white"
                      }`}
                    >
                      <Icon size={20} />
                    </span>
                    <div className="mt-auto">
                      <h4 className="font-black leading-tight">{section.title}</h4>
                      <p
                        className={`mt-1 text-xs leading-relaxed ${
                          index === 0 ? "text-white/55" : "text-black/45"
                        }`}
                      >
                        {section.subtitle}
                      </p>
                      <span className="mt-3 inline-block text-[10px] font-black uppercase tracking-[0.12em] opacity-45 group-hover:opacity-100">
                        Modifier →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>

          <section className="mt-10 border-t border-black/5 pt-8">
            <p className="font-serif text-2xl italic">Personnaliser</p>
            <h3 className="text-2xl font-black tracking-[-0.04em]">
              APPARENCE & COORDONNÉES
            </h3>

            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {settingsSections.map((section) => {
                const Icon = section.icon;
                return (
                  <Link
                    key={section.title}
                    href={section.href}
                    className="flex min-h-[135px] items-start gap-4 rounded-[24px] bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-[#eee3d3]">
                      <Icon size={20} />
                    </span>
                    <div>
                      <h4 className="font-black">{section.title}</h4>
                      <p className="mt-1 text-xs leading-relaxed text-black/45">
                        {section.subtitle}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        </section>
      </div>
    </main>
  );
}
