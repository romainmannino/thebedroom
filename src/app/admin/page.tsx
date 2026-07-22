"use client";

import {
  BookOpen,
  Check,
  Copy,
  Home,
  KeyRound,
  MessageCircle,
  Palette,
  Settings,
  Share2,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type PreparedStay = {
  guestName: string;
  arrivalDate: string;
  departureDate: string;
  arrivalTime: string;
  accessCode: string;
  phone: string;
  notes: string;
  link: string;
};

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function compactDate(value: string) {
  return value.replaceAll("-", "");
}

function compactTime(value: string) {
  return value.replace(":", "");
}

export default function AdminPage() {
  const [guestName, setGuestName] = useState("");
  const [arrivalDate, setArrivalDate] = useState(todayIso());
  const [departureDate, setDepartureDate] = useState("");
  const [arrivalTime, setArrivalTime] = useState("15:00");
  const [accessCode, setAccessCode] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [savedStay, setSavedStay] = useState<PreparedStay | null>(null);

  useEffect(() => {
    const storedStay = localStorage.getItem("the-bedroom-current-stay");
    if (!storedStay) return;

    try {
      const parsedStay = JSON.parse(storedStay) as PreparedStay;
      setSavedStay(parsedStay);
      setGuestName(parsedStay.guestName);
      setArrivalDate(parsedStay.arrivalDate);
      setDepartureDate(parsedStay.departureDate);
      setArrivalTime(parsedStay.arrivalTime);
      setAccessCode(parsedStay.accessCode);
      setPhone(parsedStay.phone);
      setNotes(parsedStay.notes);
      setGeneratedLink(parsedStay.link);
    } catch {
      localStorage.removeItem("the-bedroom-current-stay");
    }
  }, []);

  const isArrivalToday = arrivalDate === todayIso();

  const personalizedPath = useMemo(() => {
    if (!guestName.trim() || !arrivalDate || !departureDate) return "";

    const params = new URLSearchParams({
      p: guestName.trim(),
      a: compactDate(arrivalDate),
      d: compactDate(departureDate),
      h: compactTime(arrivalTime),
    });

    if (accessCode.trim()) params.set("c", accessCode.trim());
    return `/sejour?${params.toString()}`;
  }, [guestName, arrivalDate, departureDate, arrivalTime, accessCode]);

  function prepareStay() {
    if (!guestName.trim() || !arrivalDate || !departureDate) {
      window.alert(
        "Renseigne au minimum le prénom, la date d’arrivée et la date de départ.",
      );
      return;
    }

    const link = `${window.location.origin}${personalizedPath}`;
    const stay: PreparedStay = {
      guestName: guestName.trim(),
      arrivalDate,
      departureDate,
      arrivalTime,
      accessCode: accessCode.trim(),
      phone: phone.trim(),
      notes: notes.trim(),
      link,
    };

    localStorage.setItem("the-bedroom-current-stay", JSON.stringify(stay));
    setGeneratedLink(link);
    setSavedStay(stay);
  }

  async function shareOrCopyLink() {
    if (!generatedLink) return;

    const message = `Bonjour, vous trouverez via ce lien toutes les informations nécessaires pour votre séjour, dont le code de la boîte à clés :\n${generatedLink}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Votre séjour à The Bedroom",
          text: message,
        });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(message);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = message;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }

      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      window.alert("Impossible de partager automatiquement. Maintenez le lien pour le copier.");
    }
  }

  function resetStay() {
    localStorage.removeItem("the-bedroom-current-stay");
    setGuestName("");
    setArrivalDate(todayIso());
    setDepartureDate("");
    setArrivalTime("15:00");
    setAccessCode("");
    setPhone("");
    setNotes("");
    setGeneratedLink("");
    setSavedStay(null);
  }

  return (
    <main className="min-h-screen bg-[#e7dfd4]">
      <div className="mx-auto min-h-screen w-full max-w-[1280px] bg-[#faf8f4]">
        <header className="flex items-center justify-between border-b border-black/5 px-5 py-4 sm:px-8">
          <div>
            <p className="text-[9px] font-black tracking-[0.24em] text-black/40">THE BEDROOM</p>
            <h1 className="mt-1 text-xl font-black">Administration</h1>
          </div>
          <Link href="/" className="grid h-10 w-10 place-items-center rounded-full bg-black text-white" aria-label="Voir le livret">
            <Home size={18} />
          </Link>
        </header>

        <div className="grid lg:grid-cols-[215px_1fr]">
          <aside className="hidden border-r border-black/5 p-4 lg:block">
            <nav className="space-y-1.5">
              <AdminLink href="/admin" icon={Home} label="Préparer un séjour" active />
              <AdminLink href="/admin/livret" icon={BookOpen} label="Contenu du livret" />
              <AdminLink href="/admin/apparence" icon={Palette} label="Apparence" />
              <AdminLink href="/admin/contact" icon={MessageCircle} label="Contact & WhatsApp" />
              <AdminLink href="/admin/parametres" icon={Settings} label="Paramètres" />
            </nav>
            <div className="mt-8 rounded-[20px] bg-black p-4 text-white">
              <Sparkles size={19} />
              <p className="mt-3 text-sm font-black">Livret publié</p>
              <p className="mt-1.5 text-[11px] leading-relaxed text-white/50">La version voyageur est accessible en ligne.</p>
            </div>
          </aside>

          <section className="px-4 pb-24 pt-7 sm:px-8 lg:px-10">
            <div>
              <p className="font-serif text-3xl italic">Bonjour Romain</p>
              <h2 className="text-4xl font-black leading-none tracking-[-0.05em]">PRÉPARER UN SÉJOUR</h2>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-black/45">Renseigne le voyageur puis partage son lien personnalisé.</p>
            </div>

            {savedStay && isArrivalToday && (
              <div className="mt-7 flex items-center gap-4 rounded-[22px] bg-[#dcebdd] p-4">
                <span className="grid h-10 w-10 flex-none place-items-center rounded-full bg-white"><Check size={19} /></span>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.14em] text-black/45">Arrivée aujourd’hui</p>
                  <p className="mt-1 font-black">{savedStay.guestName} à {savedStay.arrivalTime}</p>
                </div>
              </div>
            )}

            <div className="mt-7 grid gap-6 xl:grid-cols-[1fr_360px]">
              <section className="rounded-[25px] bg-white p-5 shadow-sm sm:p-6">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[#eee3d3]"><KeyRound size={19} /></span>
                  <div>
                    <p className="font-serif text-xl italic">Nouvelle arrivée</p>
                    <h3 className="text-lg font-black">INFORMATIONS DU VOYAGEUR</h3>
                  </div>
                </div>

                <div className="mt-6 grid gap-4">
                  <Field label="Prénom ou nom du voyageur" value={guestName} onChange={setGuestName} placeholder="Julien" />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Date d’arrivée" type="date" value={arrivalDate} onChange={setArrivalDate} />
                    <Field label="Date de départ" type="date" value={departureDate} onChange={setDepartureDate} />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Heure d’arrivée" type="time" value={arrivalTime} onChange={setArrivalTime} />
                    <Field label="Code d’accès" value={accessCode} onChange={setAccessCode} placeholder="Ex. 2580" />
                  </div>
                  <Field label="Téléphone facultatif" type="tel" value={phone} onChange={setPhone} placeholder="06 00 00 00 00" />
                  <label>
                    <span className="mb-2 block text-xs font-black">Notes privées</span>
                    <textarea value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Lit bébé, arrivée tardive, demande particulière…" rows={4} className="w-full resize-none rounded-[17px] border border-black/10 bg-[#faf8f4] px-4 py-3 text-sm outline-none focus:border-black" />
                  </label>
                </div>

                <button type="button" onClick={prepareStay} className="mt-6 flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-black px-5 text-sm font-black text-white">
                  <KeyRound size={18} /> Générer le lien personnalisé
                </button>
              </section>

              <aside className="rounded-[25px] bg-black p-5 text-white sm:p-6">
                <p className="font-serif text-2xl italic">Lien voyageur</p>
                <h3 className="text-xl font-black">LIVRET PERSONNALISÉ</h3>

                {generatedLink ? (
                  <>
                    <div className="mt-6 rounded-[18px] bg-white/10 p-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.15em] text-white/40">Voyageur</p>
                      <p className="mt-1 text-xl font-black">{guestName}</p>
                      <p className="mt-3 text-xs text-white/55">{arrivalDate} → {departureDate}</p>
                    </div>
                    <p className="mt-5 break-all rounded-[15px] bg-white/10 p-3 text-[11px] leading-relaxed text-white/65">{generatedLink}</p>
                    <button type="button" onClick={shareOrCopyLink} className="mt-4 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#eee3d3] text-sm font-black text-black">
                      {copied ? <><Check size={17} /> Message copié</> : <><Share2 size={17} /> Partager ou copier</>}
                    </button>
                    <Link href={personalizedPath || "/"} target="_blank" className="mt-3 flex min-h-12 items-center justify-center rounded-full border border-white/25 text-sm font-black">Voir comme le voyageur</Link>
                    <button type="button" onClick={resetStay} className="mt-3 w-full text-xs font-bold text-white/45">Préparer un autre séjour</button>
                  </>
                ) : (
                  <p className="mt-5 text-sm leading-relaxed text-white/50">Le lien apparaîtra ici après avoir complété le formulaire.</p>
                )}
              </aside>
            </div>

            <section className="mt-8">
              <p className="font-serif text-2xl italic">Gérer</p>
              <h3 className="text-2xl font-black">VOTRE LIVRET</h3>
              <p className="mt-2 max-w-xl text-sm text-black/45">Les anciens raccourcis en double ont été retirés. Chaque fonction possède maintenant un accès clair.</p>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                <QuickLink href="/admin/livret" icon={BookOpen} title="Contenu" subtitle="Toutes les rubriques" dark />
                <QuickLink href="/admin/apparence" icon={Palette} title="Apparence" subtitle="Photos et vignettes" />
                <QuickLink href="/admin/contact" icon={MessageCircle} title="Contact" subtitle="Téléphone et WhatsApp" />
                <QuickLink href="/admin/parametres" icon={Settings} title="Paramètres" subtitle="Logement et accès" />
                <QuickLink href="/" icon={Home} title="Aperçu" subtitle="Version voyageur" />
              </div>
            </section>
          </section>
        </div>
      </div>
    </main>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string; type?: string }) {
  return (
    <label>
      <span className="mb-2 block text-xs font-black">{label}</span>
      <input type={type} value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="min-h-12 w-full rounded-[17px] border border-black/10 bg-[#faf8f4] px-4 text-sm outline-none focus:border-black" />
    </label>
  );
}

function AdminLink({ href, icon: Icon, label, active = false }: { href: string; icon: React.ElementType; label: string; active?: boolean }) {
  return <Link href={href} className={`flex min-h-11 items-center gap-3 rounded-[14px] px-3 text-sm font-bold ${active ? "bg-black text-white" : "text-black/55 hover:bg-[#eee3d3]"}`}><Icon size={17} />{label}</Link>;
}

function QuickLink({ href, icon: Icon, title, subtitle, dark = false }: { href: string; icon: React.ElementType; title: string; subtitle: string; dark?: boolean }) {
  return (
    <Link href={href} className={`flex min-h-[125px] flex-col rounded-[21px] p-4 ${dark ? "bg-black text-white" : "bg-[#eee3d3] text-black"}`}>
      <span className={`grid h-9 w-9 place-items-center rounded-full ${dark ? "bg-white text-black" : "bg-white"}`}><Icon size={18} /></span>
      <div className="mt-auto"><strong className="block text-sm">{title}</strong><span className={`mt-1 block text-[10px] ${dark ? "text-white/50" : "text-black/45"}`}>{subtitle}</span></div>
    </Link>
  );
}
