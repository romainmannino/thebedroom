"use client";

import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  ChevronRight,
  CircleUserRound,
  Clock3,
  Home,
  Info,
  KeyRound,
  LogOut,
  MapPin,
  Menu,
  Settings,
  Sparkles,
  Utensils,
  X,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";

type Reservation = {
  id: string;
  title: string | null;
  source: string | null;
  start_date: string;
  end_date: string;
  status: string | null;
};

type AdminDashboardProps = {
  today: string;
  arrivals: Reservation[];
  departuresCount: number;
  presentCount: number;
  upcoming: Reservation[];
};

function formatDate(date: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
  }).format(new Date(`${date}T12:00:00`));
}

function formatLongDate(date: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(`${date}T12:00:00`));
}

function sourceLabel(source: string | null) {
  if (source === "airbnb") return "Airbnb";
  if (source === "booking") return "Booking";
  if (source === "manual") return "Manuel";

  return "Réservation";
}

function sourceClasses(source: string | null) {
  if (source === "airbnb") {
    return "bg-[#ffe3df] text-[#b63e34]";
  }

  if (source === "booking") {
    return "bg-[#dfeaff] text-[#174ea6]";
  }

  return "bg-[#eee3d3] text-black";
}

export default function AdminDashboard({
  today,
  arrivals,
  departuresCount,
  presentCount,
  upcoming,
}: AdminDashboardProps) {
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);

  const formattedToday = useMemo(() => formatLongDate(today), [today]);

  return (
    <main className="min-h-screen bg-[#e7dfd4]">
      <div className="mx-auto min-h-screen w-full max-w-[1180px] bg-[#faf8f4]">
        <header className="flex items-center justify-between border-b border-black/5 px-5 py-5 sm:px-8">
          <div>
            <p className="text-[10px] font-black tracking-[0.25em] text-black/45">
              THE BEDROOM
            </p>

            <h1 className="mt-1 text-xl font-black tracking-[-0.04em]">
              Administration
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="grid h-11 w-11 place-items-center rounded-full bg-[#eee3d3]"
              aria-label="Voir le livret"
            >
              <Home size={20} />
            </Link>

            <button
              type="button"
              className="grid h-11 w-11 place-items-center rounded-full bg-black text-white"
              aria-label="Menu"
            >
              <Menu size={20} />
            </button>
          </div>
        </header>

        <div className="grid lg:grid-cols-[230px_1fr]">
          <aside className="hidden min-h-[calc(100vh-82px)] border-r border-black/5 p-5 lg:block">
            <nav className="space-y-2">
              <SidebarLink
                href="/admin"
                icon={Home}
                label="Tableau de bord"
                active
              />

              <SidebarLink
                href="/admin/calendrier"
                icon={CalendarDays}
                label="Calendrier"
              />

              <SidebarLink
                href="/admin/livret"
                icon={BookOpen}
                label="Livret d’accueil"
              />

              <SidebarLink
                href="/admin/restaurants"
                icon={Utensils}
                label="Restaurants"
              />

              <SidebarLink
                href="/admin/activites"
                icon={MapPin}
                label="Activités"
              />

              <SidebarLink
                href="/admin/bon-a-savoir"
                icon={Info}
                label="Bon à savoir"
              />

              <SidebarLink
                href="/admin/parametres"
                icon={Settings}
                label="Paramètres"
              />
            </nav>

            <div className="mt-10 rounded-[24px] bg-black p-5 text-white">
              <Sparkles size={22} />

              <p className="mt-4 text-sm font-black">
                Votre livret est publié
              </p>

              <p className="mt-2 text-xs leading-relaxed text-white/55">
                Les voyageurs peuvent actuellement consulter la version
                publique.
              </p>

              <Link
                href="/"
                className="mt-4 flex items-center justify-between rounded-full bg-white px-4 py-3 text-xs font-black text-black"
              >
                Voir le livret
                <ArrowRight size={15} />
              </Link>
            </div>
          </aside>

          <section className="px-4 pb-28 pt-7 sm:px-8 sm:pt-9">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <p className="font-serif text-3xl italic">Bonjour Romain</p>

                <h2 className="mt-1 text-4xl font-black leading-[0.92] tracking-[-0.055em] sm:text-5xl">
                  VOTRE JOURNÉE
                </h2>

                <p className="mt-3 text-sm capitalize text-black/45">
                  {formattedToday}
                </p>
              </div>

              <button
                type="button"
                onClick={async () => {
                  await fetch("/api/calendar/sync", {
                    method: "POST",
                  });

                  window.location.reload();
                }}
                className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-black px-5 text-sm font-black text-white"
              >
                <CalendarDays size={18} />
                Synchroniser
              </button>
            </div>

            <div className="mt-8 grid grid-cols-3 gap-3">
              <StatCard
                value={arrivals.length}
                label="Arrivée"
                description="aujourd’hui"
                marker="bg-[#63a477]"
              />

              <StatCard
                value={departuresCount}
                label="Départ"
                description="aujourd’hui"
                marker="bg-[#7196ca]"
              />

              <StatCard
                value={presentCount}
                label="Présent"
                description="actuellement"
                marker="bg-[#d99c50]"
              />
            </div>

            <section className="mt-9">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="font-serif text-2xl italic">Aujourd’hui</p>

                  <h3 className="text-2xl font-black tracking-[-0.04em]">
                    ARRIVÉES
                  </h3>
                </div>

                <Link
                  href="/admin/calendrier"
                  className="flex items-center gap-1 text-xs font-black"
                >
                  Calendrier
                  <ChevronRight size={16} />
                </Link>
              </div>

              {arrivals.length > 0 ? (
                <div className="grid gap-4 xl:grid-cols-2">
                  {arrivals.map((reservation) => (
                    <ArrivalCard
                      key={reservation.id}
                      reservation={reservation}
                      onPrepare={() => setSelectedReservation(reservation)}
                    />
                  ))}
                </div>
              ) : (
                <div className="rounded-[28px] border border-dashed border-black/15 bg-white px-6 py-10 text-center">
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[#eee3d3]">
                    <Check size={24} />
                  </span>

                  <h4 className="mt-4 font-black">
                    Aucune arrivée aujourd’hui
                  </h4>

                  <p className="mt-2 text-sm text-black/45">
                    La prochaine réservation apparaîtra automatiquement ici.
                  </p>
                </div>
              )}
            </section>

            <section className="mt-9">
              <div className="mb-4">
                <p className="font-serif text-2xl italic">Les prochains jours</p>

                <h3 className="text-2xl font-black tracking-[-0.04em]">
                  ARRIVÉES À VENIR
                </h3>
              </div>

              <div className="overflow-hidden rounded-[28px] bg-white shadow-sm">
                {upcoming.length > 0 ? (
                  upcoming.map((reservation, index) => (
                    <button
                      key={reservation.id}
                      type="button"
                      onClick={() => setSelectedReservation(reservation)}
                      className={`flex w-full items-center gap-4 p-4 text-left transition hover:bg-black/[0.02] ${
                        index !== upcoming.length - 1
                          ? "border-b border-black/5"
                          : ""
                      }`}
                    >
                      <div className="w-14 flex-none text-center">
                        <strong className="block text-xl">
                          {formatDate(reservation.start_date).split(" ")[0]}
                        </strong>

                        <span className="text-[10px] font-black uppercase text-black/40">
                          {formatDate(reservation.start_date).split(" ")[1]}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-2.5 py-1 text-[9px] font-black ${sourceClasses(
                              reservation.source,
                            )}`}
                          >
                            {sourceLabel(reservation.source)}
                          </span>
                        </div>

                        <p className="mt-2 truncate text-sm font-black">
                          {reservation.title || "Voyageur"}
                        </p>

                        <p className="mt-1 text-xs text-black/40">
                          {formatDate(reservation.start_date)} →{" "}
                          {formatDate(reservation.end_date)}
                        </p>
                      </div>

                      <ChevronRight
                        size={18}
                        className="flex-none text-black/30"
                      />
                    </button>
                  ))
                ) : (
                  <p className="p-6 text-sm text-black/45">
                    Aucune autre arrivée dans les sept prochains jours.
                  </p>
                )}
              </div>
            </section>

            <section className="mt-9">
              <div className="mb-4">
                <p className="font-serif text-2xl italic">Gérer</p>

                <h3 className="text-2xl font-black tracking-[-0.04em]">
                  VOTRE LOGEMENT
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <QuickLink
                  href="/admin/calendrier"
                  icon={CalendarDays}
                  title="Calendrier"
                  subtitle="Airbnb + Booking"
                  dark
                />

                <QuickLink
                  href="/admin/livret"
                  icon={BookOpen}
                  title="Livret"
                  subtitle="Modifier le contenu"
                />

                <QuickLink
                  href="/admin/bon-a-savoir"
                  icon={Info}
                  title="Bon à savoir"
                  subtitle="Infos et notices"
                />

                <QuickLink
                  href="/admin/restaurants"
                  icon={Utensils}
                  title="Restaurants"
                  subtitle="Bonnes adresses"
                />

                <QuickLink
                  href="/admin/activites"
                  icon={MapPin}
                  title="Activités"
                  subtitle="À faire autour"
                />

                <QuickLink
                  href="/admin/parametres"
                  icon={Settings}
                  title="Paramètres"
                  subtitle="Le logement"
                />
              </div>
            </section>
          </section>
        </div>

        <nav className="fixed bottom-3 left-1/2 z-40 grid w-[calc(100%-24px)] max-w-[620px] -translate-x-1/2 grid-cols-4 rounded-[24px] border border-black/5 bg-white/95 p-2 shadow-2xl backdrop-blur-xl lg:hidden">
          <MobileLink href="/admin" icon={Home} label="Accueil" active />

          <MobileLink
            href="/admin/calendrier"
            icon={CalendarDays}
            label="Calendrier"
          />

          <MobileLink
            href="/admin/livret"
            icon={BookOpen}
            label="Livret"
          />

          <MobileLink
            href="/"
            icon={CircleUserRound}
            label="Voyageur"
          />
        </nav>

        {selectedReservation && (
          <ArrivalModal
            reservation={selectedReservation}
            onClose={() => setSelectedReservation(null)}
          />
        )}
      </div>
    </main>
  );
}

function StatCard({
  value,
  label,
  description,
  marker,
}: {
  value: number;
  label: string;
  description: string;
  marker: string;
}) {
  return (
    <article className="rounded-[24px] bg-white p-4 shadow-sm sm:p-5">
      <span className={`block h-2 w-2 rounded-full ${marker}`} />

      <strong className="mt-5 block text-3xl font-black">{value}</strong>

      <p className="mt-1 text-xs font-black">{label}</p>

      <p className="mt-1 text-[10px] text-black/40">{description}</p>
    </article>
  );
}

function ArrivalCard({
  reservation,
  onPrepare,
}: {
  reservation: Reservation;
  onPrepare: () => void;
}) {
  return (
    <article className="overflow-hidden rounded-[30px] bg-black text-white shadow-xl">
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <span
            className={`rounded-full px-3 py-2 text-[10px] font-black ${sourceClasses(
              reservation.source,
            )}`}
          >
            {sourceLabel(reservation.source)}
          </span>

          <span className="flex items-center gap-1.5 text-xs text-white/55">
            <Clock3 size={15} />
            Dès 15 h
          </span>
        </div>

        <p className="mt-8 text-xs font-black tracking-[0.18em] text-white/40">
          ARRIVÉE DU JOUR
        </p>

        <h4 className="mt-2 text-3xl font-black leading-none tracking-[-0.045em]">
          {reservation.title || "Voyageur"}
        </h4>

        <p className="mt-4 text-sm text-white/60">
          {formatDate(reservation.start_date)} →{" "}
          {formatDate(reservation.end_date)}
        </p>

        <button
          type="button"
          onClick={onPrepare}
          className="mt-7 flex min-h-13 w-full items-center justify-between rounded-full bg-[#eee3d3] px-5 text-sm font-black text-black"
        >
          Préparer l’arrivée
          <ArrowRight size={18} />
        </button>
      </div>
    </article>
  );
}

function ArrivalModal({
  reservation,
  onClose,
}: {
  reservation: Reservation;
  onClose: () => void;
}) {
  const [guestName, setGuestName] = useState(
    reservation.title === "Reserved" ||
      reservation.title === "Airbnb (Not available)"
      ? ""
      : reservation.title || "",
  );

  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [arrivalTime, setArrivalTime] = useState("15:00");
  const [saved, setSaved] = useState(false);

  const [checklist, setChecklist] = useState({
    guestDetails: false,
    welcomeBook: false,
    accessCode: false,
    payment: false,
  });

  function toggleChecklist(key: keyof typeof checklist) {
    setChecklist((current) => ({
      ...current,
      [key]: !current[key],
    }));
  }

  function savePreparation() {
    localStorage.setItem(
      `reservation-preparation-${reservation.id}`,
      JSON.stringify({
        guestName,
        phone,
        email,
        arrivalTime,
        checklist,
      }),
    );

    setSaved(true);

    window.setTimeout(() => setSaved(false), 1800);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/45 p-3 backdrop-blur-sm sm:p-6">
      <section className="mx-auto flex max-h-full w-full max-w-[620px] flex-col overflow-hidden rounded-[32px] bg-[#faf8f4] shadow-2xl">
        <header className="flex items-center justify-between border-b border-black/5 p-5">
          <div>
            <p className="font-serif text-2xl italic">Préparer</p>

            <h2 className="text-2xl font-black tracking-[-0.04em]">
              L’ARRIVÉE
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-11 w-11 place-items-center rounded-full bg-[#eee3d3]"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </header>

        <div className="overflow-y-auto p-5">
          <div className="rounded-[25px] bg-black p-5 text-white">
            <span
              className={`inline-flex rounded-full px-3 py-2 text-[10px] font-black ${sourceClasses(
                reservation.source,
              )}`}
            >
              {sourceLabel(reservation.source)}
            </span>

            <p className="mt-5 text-xl font-black">
              {reservation.title || "Voyageur"}
            </p>

            <p className="mt-2 text-sm text-white/55">
              {formatDate(reservation.start_date)} →{" "}
              {formatDate(reservation.end_date)}
            </p>
          </div>

          <div className="mt-6 grid gap-4">
            <Field
              label="Nom du voyageur"
              value={guestName}
              onChange={setGuestName}
              placeholder="Julien Martin"
            />

            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Téléphone"
                value={phone}
                onChange={setPhone}
                placeholder="06 00 00 00 00"
                type="tel"
              />

              <Field
                label="Heure d’arrivée"
                value={arrivalTime}
                onChange={setArrivalTime}
                type="time"
              />
            </div>

            <Field
              label="Adresse e-mail"
              value={email}
              onChange={setEmail}
              placeholder="voyageur@email.com"
              type="email"
            />
          </div>

          <div className="mt-7">
            <p className="font-serif text-2xl italic">Checklist</p>

            <h3 className="text-xl font-black">PRÉPARATION DU SÉJOUR</h3>

            <div className="mt-4 space-y-3">
              <ChecklistRow
                label="Coordonnées du voyageur vérifiées"
                checked={checklist.guestDetails}
                onClick={() => toggleChecklist("guestDetails")}
              />

              <ChecklistRow
                label="Livret d’accueil envoyé"
                checked={checklist.welcomeBook}
                onClick={() => toggleChecklist("welcomeBook")}
              />

              <ChecklistRow
                label="Code d’accès envoyé"
                checked={checklist.accessCode}
                onClick={() => toggleChecklist("accessCode")}
              />

              <ChecklistRow
                label="Paiement et caution vérifiés"
                checked={checklist.payment}
                onClick={() => toggleChecklist("payment")}
              />
            </div>
          </div>
        </div>

        <footer className="border-t border-black/5 bg-white p-5">
          <button
            type="button"
            onClick={savePreparation}
            className="flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-black text-sm font-black text-white"
          >
            {saved ? (
              <>
                <Check size={19} />
                Préparation enregistrée
              </>
            ) : (
              <>
                <KeyRound size={19} />
                Enregistrer la préparation
              </>
            )}
          </button>

          <p className="mt-3 text-center text-[10px] text-black/40">
            Pour l’instant, cette préparation est enregistrée localement sur cet
            appareil.
          </p>
        </footer>
      </section>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-black">{label}</span>

      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-13 w-full rounded-[18px] border border-black/10 bg-white px-4 text-sm outline-none transition focus:border-black"
      />
    </label>
  );
}

function ChecklistRow({
  label,
  checked,
  onClick,
}: {
  label: string;
  checked: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex min-h-14 w-full items-center gap-3 rounded-[19px] px-4 text-left text-sm font-bold transition ${
        checked ? "bg-black text-white" : "bg-[#eee3d3] text-black"
      }`}
    >
      <span
        className={`grid h-7 w-7 flex-none place-items-center rounded-full ${
          checked ? "bg-white text-black" : "bg-white"
        }`}
      >
        {checked && <Check size={16} />}
      </span>

      {label}
    </button>
  );
}

function QuickLink({
  href,
  icon: Icon,
  title,
  subtitle,
  dark = false,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  subtitle: string;
  dark?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex min-h-[150px] flex-col rounded-[25px] p-4 ${
        dark ? "bg-black text-white" : "bg-[#eee3d3] text-black"
      }`}
    >
      <span
        className={`grid h-10 w-10 place-items-center rounded-full ${
          dark ? "bg-white text-black" : "bg-white"
        }`}
      >
        <Icon size={20} />
      </span>

      <div className="mt-auto">
        <strong className="block text-sm">{title}</strong>

        <span
          className={`mt-1 block text-[10px] ${
            dark ? "text-white/50" : "text-black/45"
          }`}
        >
          {subtitle}
        </span>
      </div>
    </Link>
  );
}

function SidebarLink({
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
      className={`flex min-h-12 items-center gap-3 rounded-[16px] px-4 text-sm font-bold ${
        active ? "bg-black text-white" : "text-black/55 hover:bg-[#eee3d3]"
      }`}
    >
      <Icon size={18} />
      {label}
    </Link>
  );
}

function MobileLink({
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
      className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-[18px] text-[9px] font-bold ${
        active ? "bg-[#eee3d3] text-black" : "text-black/45"
      }`}
    >
      <Icon size={20} />
      {label}
    </Link>
  );
}
