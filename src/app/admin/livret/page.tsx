"use client";

import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  Eye,
  Home,
  Info,
  KeyRound,
  MapPin,
  Settings,
  Utensils,
  Wifi,
} from "lucide-react";
import Link from "next/link";

const sections = [
  {
    id: "arrival",
    title: "Arrivée & départ",
    subtitle: "Horaires, accès et code",
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
    subtitle: "Télévision, climatisation, parking…",
    icon: Info,
    href: "/admin/bon-a-savoir",
  },
  {
    id: "restaurants",
    title: "Restaurants",
    subtitle: "Vos bonnes adresses",
    icon: Utensils,
    href: "/admin/restaurants",
  },
  {
    id: "activities",
    title: "Activités",
    subtitle: "Que faire autour",
    icon: MapPin,
    href: "/admin/activites",
  },
];

export default function AdminGuidePage() {
  return (
    <main className="min-h-screen bg-[#e7dfd4] p-3 sm:p-5">
      <div className="mx-auto min-h-[calc(100vh-24px)] max-w-[1180px] overflow-hidden rounded-[26px] bg-[#faf8f4] shadow-xl">
        <header className="flex items-center justify-between border-b border-black/5 px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="grid h-10 w-10 place-items-center rounded-full bg-[#eee3d3]"
            >
              <ArrowLeft size={18} />
            </Link>

            <div>
              <p className="text-[9px] font-black tracking-[0.22em] text-black/40">
                THE BEDROOM
              </p>

              <h1 className="text-lg font-black">
                Modifier le livret
              </h1>
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
            >
              <Home size={18} />
            </Link>
          </div>
        </header>

        <section className="grid lg:grid-cols-[220px_1fr]">
          <aside className="hidden border-r border-black/5 p-4 lg:block">
            <nav className="space-y-2">
              <AdminLink
                href="/admin/livret"
                icon={BookOpen}
                label="Structure du livret"
                active
              />

              <AdminLink
                href="/admin/bon-a-savoir"
                icon={Info}
                label="Bon à savoir"
              />

              <AdminLink
                href="/admin/restaurants"
                icon={Utensils}
                label="Restaurants"
              />

              <AdminLink
                href="/admin/activites"
                icon={MapPin}
                label="Activités"
              />

              <AdminLink
                href="/admin/parametres"
                icon={Settings}
                label="Paramètres"
              />
            </nav>
          </aside>

          <div className="p-4 sm:p-7">
            <p className="font-serif text-3xl italic">
              Votre livret
            </p>

            <h2 className="text-4xl font-black leading-none tracking-[-0.05em]">
              LES RUBRIQUES
            </h2>

            <p className="mt-3 text-sm text-black/45">
              Choisis la rubrique que tu souhaites modifier.
            </p>

            <div className="mt-7 space-y-3">
              {sections.map((section) => {
                const Icon = section.icon;

                return (
                  <Link
                    key={section.id}
                    href={section.href}
                    className="flex items-center gap-4 rounded-[22px] bg-white p-4 shadow-sm transition hover:-translate-y-0.5"
                  >
                    <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-[#eee3d3]">
                      <Icon size={19} />
                    </span>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-black">
                        {section.title}
                      </h3>

                      <p className="mt-1 text-xs text-black/45">
                        {section.subtitle}
                      </p>
                    </div>

                    <ChevronRight size={18} />
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function AdminLink({
  href,
  icon: Icon,
  label,
  active = false,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex min-h-11 items-center gap-3 rounded-[14px] px-3 text-sm font-bold ${
        active
          ? "bg-black text-white"
          : "text-black/55 hover:bg-[#eee3d3]"
      }`}
    >
      <Icon size={17} />
      {label}
    </Link>
  );
}
