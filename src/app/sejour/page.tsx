import {
  CalendarDays,
  Check,
  Clock3,
  Home,
  KeyRound,
} from "lucide-react";
import Link from "next/link";

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

export default async function StayPage({
  searchParams,
}: StayPageProps) {
  const params = await searchParams;

  const guestName = params.prenom?.trim() || "Bienvenue";
  const arrivalTime = params.heure || "15:00";
  const accessCode = params.acces?.trim();

  return (
    <main className="min-h-screen bg-[#e7dfd4]">
      <div className="mx-auto min-h-screen max-w-[720px] bg-[#faf8f4]">
        <section className="relative min-h-[390px] overflow-hidden bg-black p-6 text-white sm:p-9">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(238,227,211,0.25),transparent_45%)]" />

          <div className="relative">
            <p className="text-[10px] font-black tracking-[0.25em] text-white/50">
              THE BEDROOM
            </p>

            <div className="mt-24">
              <p className="font-serif text-4xl italic">
                Bonjour {guestName}
              </p>

              <h1 className="mt-2 text-5xl font-black leading-[0.9] tracking-[-0.055em]">
                VOTRE SÉJOUR
              </h1>

              <p className="mt-5 max-w-md text-sm leading-relaxed text-white/60">
                Retrouvez ici les informations essentielles avant
                votre arrivée.
              </p>
            </div>
          </div>
        </section>

        <section className="-mt-7 rounded-t-[30px] bg-[#faf8f4] px-4 pb-12 pt-7 sm:px-8">
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
                <h2 className="font-black">
                  Votre livret est prêt
                </h2>

                <p className="mt-1 text-sm leading-relaxed text-black/55">
                  Accédez aux informations du logement, au Wi-Fi,
                  aux bonnes adresses et aux activités.
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

        <p className="mt-1 text-sm font-black">
          {value}
        </p>
      </div>
    </article>
  );
}
