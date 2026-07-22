import {
  CalendarDays,
  Check,
  Clock3,
  Home,
  KeyRound,
} from "lucide-react";
import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { DEFAULT_HOME_CONFIGURATION } from "@/lib/guide-home-config";

type StayPageProps = {
  searchParams: Promise<{
    prenom?: string;
    arrivee?: string;
    depart?: string;
    heure?: string;
    acces?: string;
  }>;
};

function formatDate(value?: string) {
  if (!value) return "Non renseignée";

  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(`${value}T12:00:00`));
}

async function getHeroImage() {
  try {
    const { data: property } = await supabaseAdmin
      .from("properties")
      .select("id")
      .eq("slug", "the-bedroom")
      .single();

    if (!property) return DEFAULT_HOME_CONFIGURATION.heroImage;

    const { data } = await supabaseAdmin
      .from("guide_home_settings")
      .select("configuration")
      .eq("property_id", property.id)
      .maybeSingle();

    return (
      data?.configuration?.heroImage ||
      DEFAULT_HOME_CONFIGURATION.heroImage
    );
  } catch {
    return DEFAULT_HOME_CONFIGURATION.heroImage;
  }
}

export default async function StayPage({
  searchParams,
}: StayPageProps) {
  const params = await searchParams;
  const heroImage = await getHeroImage();

  const guestName = params.prenom?.trim() || "Bienvenue";
  const arrivalTime = params.heure || "15:00";
  const accessCode = params.acces?.trim();

  return (
    <main className="min-h-screen bg-[#e7dfd4]">
      <div className="mx-auto min-h-screen max-w-[720px] bg-[#faf8f4]">
        <section className="relative min-h-[390px] overflow-hidden bg-black p-6 text-white sm:p-9">
          <img
            src={heroImage}
            alt="The Bedroom"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/25 to-black/85" />

          <div className="relative">
            <p className="text-[10px] font-black tracking-[0.25em] text-white/70">
              THE BEDROOM
            </p>

            <div className="mt-40">
              <p className="font-serif text-4xl italic sm:text-5xl">
                Bonjour {guestName}
              </p>

              <p className="mt-5 max-w-md text-sm leading-relaxed text-white/75">
                Retrouvez ici les informations essentielles avant votre arrivée.
              </p>
            </div>
          </div>
        </section>

        <section className="relative z-10 -mt-7 rounded-t-[30px] bg-[#faf8f4] px-4 pb-12 pt-7 sm:px-8">
          <div className="grid gap-3">
            <InfoCard
              icon={CalendarDays}
              label="Dates du séjour"
              value={`${formatDate(params.arrivee)} → ${formatDate(
                params.depart,
              )}`}
            />

            <InfoCard
              icon={Clock3}
              label="Heure d’arrivée"
              value={`À partir de ${arrivalTime}`}
            />

            {accessCode && (
              <InfoCard
                icon={KeyRound}
                label="Code d’accès"
                value={accessCode}
                dark
              />
            )}
          </div>

          <div className="mt-7 rounded-[24px] bg-[#eee3d3] p-5">
            <div className="flex gap-3">
              <span className="grid h-9 w-9 flex-none place-items-center rounded-full bg-white">
                <Check size={17} />
              </span>

              <div>
                <h2 className="font-black">Votre livret est prêt</h2>
                <p className="mt-1 text-sm leading-relaxed text-black/55">
                  Accédez aux informations du logement, au Wi-Fi, aux bonnes
                  adresses, aux transports et aux numéros utiles.
                </p>
              </div>
            </div>
          </div>

          <Link
            href="/"
            className="mt-6 flex min-h-14 items-center justify-center gap-2 rounded-full bg-black text-sm font-black text-white"
          >
            <Home size={18} />
            Ouvrir le livret d’accueil
          </Link>
        </section>
      </div>
    </main>
  );
}

function InfoCard({
  icon: Icon,
  label,
  value,
  dark = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  dark?: boolean;
}) {
  return (
    <article
      className={`flex items-center gap-4 rounded-[22px] p-4 ${
        dark ? "bg-black text-white" : "bg-white shadow-sm"
      }`}
    >
      <span
        className={`grid h-11 w-11 flex-none place-items-center rounded-full ${
          dark ? "bg-[#eee3d3] text-black" : "bg-[#eee3d3]"
        }`}
      >
        <Icon size={19} />
      </span>

      <div>
        <p
          className={`text-[10px] font-black uppercase tracking-[0.14em] ${
            dark ? "text-white/45" : "text-black/40"
          }`}
        >
          {label}
        </p>
        <p className="mt-1 text-sm font-black">{value}</p>
      </div>
    </article>
  );
}
