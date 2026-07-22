"use client";

import {
  ArrowLeft,
  BedDouble,
  Car,
  Check,
  ChevronRight,
  CircleAlert,
  Clock3,
  Coffee,
  Compass,
  Copy,
  Home,
  Info,
  KeyRound,
  MapPin,
  MessageCircle,
  Phone,
  ScrollText,
  ShoppingBag,
  Sparkles,
  ThermometerSun,
  Trash2,
  Tv,
  Utensils,
  WashingMachine,
  Wifi,
  X,
} from "lucide-react";
import { useState } from "react";

type GuideSection =
  | "arrival"
  | "wifi"
  | "know"
  | "rules"
  | "linen"
  | "restaurants"
  | "activities"
  | "shops"
  | "contact";

type Tile = {
  id: GuideSection;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  image?: string;
  accent?: boolean;
};

const tiles: Tile[] = [
  {
    id: "arrival",
    title: "Arrivée & départ",
    subtitle: "Horaires et accès",
    icon: KeyRound,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=85",
    accent: true,
  },
  {
    id: "wifi",
    title: "Wi-Fi",
    subtitle: "Se connecter",
    icon: Wifi,
  },
  {
    id: "know",
    title: "Bon à savoir",
    subtitle: "Infos du logement",
    icon: Info,
  },
  {
    id: "rules",
    title: "Les règles",
    subtitle: "Pour votre séjour",
    icon: ScrollText,
  },
  {
    id: "linen",
    title: "Linge & équipements",
    subtitle: "Salle de bain",
    icon: BedDouble,
  },
  {
    id: "restaurants",
    title: "Restaurants",
    subtitle: "Nos bonnes adresses",
    icon: Utensils,
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "activities",
    title: "À découvrir",
    subtitle: "Visites et activités",
    icon: Compass,
    image:
      "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "shops",
    title: "Commerces",
    subtitle: "Courses et shopping",
    icon: ShoppingBag,
  },
];

const restaurants = [
  {
    name: "Le Grillesia",
    distance: "100 m",
    description:
      "Cuisine créative et traditionnelle, viandes maturées et plats traditionnels.",
  },
  {
    name: "Le Temps des Saisons",
    distance: "300 m",
    description:
      "Cuisine du marché réalisée avec des produits frais et locaux.",
  },
  {
    name: "Per Lei Jons",
    distance: "3,2 km",
    description:
      "Pizzas, pâtes et salades à déguster sur place, en terrasse ou à emporter.",
  },
  {
    name: "Le Bon Vivant",
    distance: "4,8 km",
    description:
      "Cuisine travaillée à partir de produits frais, locaux et de saison.",
  },
];

const activities = [
  {
    name: "Grand Parc Miribel-Jonage",
    distance: "16 km",
    description:
      "Nature, baignade, sports nautiques, promenades, spectacles et détente.",
  },
  {
    name: "Parc de la Tête-d’Or",
    distance: "20 km",
    description:
      "Grand parc lyonnais avec espaces verts, zoo, lac, manèges et activités.",
  },
  {
    name: "Fourvière",
    distance: "21 km",
    description:
      "La basilique et la colline offrant une vue remarquable sur Lyon.",
  },
  {
    name: "Lyon centre et Vieux Lyon",
    distance: "22 km",
    description:
      "Presqu’île, monuments, musées, commerces et quartiers historiques.",
  },
  {
    name: "Crémieu",
    distance: "20 km",
    description:
      "Une cité médiévale historique ayant conservé un patrimoine remarquable.",
  },
  {
    name: "Pérouges",
    distance: "À vérifier",
    description:
      "Village médiéval célèbre pour ses ruelles pavées et son architecture.",
  },
];

const usefulInformation = [
  {
    icon: Tv,
    title: "Télévision",
    text: "Les chaînes de la TNT sont accessibles depuis l’application Molotov TV sur l’écran d’accueil.",
  },
  {
    icon: ThermometerSun,
    title: "Chauffage et climatisation",
    text: "La température est préréglée. Une télécommande permet de l’adapter à votre convenance.",
  },
  {
    icon: Trash2,
    title: "Poubelles",
    text: "La poubelle ménagère se trouve sous l’évier. Le bac de tri est à l’extérieur du logement.",
  },
  {
    icon: Car,
    title: "Stationnement",
    text: "Places gratuites devant le logement et stationnement possible sur le parking de Carrefour Market.",
  },
  {
    icon: Sparkles,
    title: "Ménage",
    text: "Le nécessaire de ménage se trouve dans le placard en face du lit, à côté du chauffe-eau.",
  },
  {
    icon: CircleAlert,
    title: "Plaque de cuisson",
    text: "Si elle est verrouillée, maintenez quelques secondes la touche portant le symbole cadenas.",
  },
];

function goToMaps(search: string) {
  window.open(
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(search)}`,
    "_blank",
    "noopener,noreferrer",
  );
}

export default function HomePage() {
  const [activeSection, setActiveSection] = useState<GuideSection | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  async function copyText(label: string, value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    window.setTimeout(() => setCopied(null), 1500);
  }

  return (
    <main className="min-h-screen bg-[#e8dfd2]">
      <div className="relative mx-auto min-h-screen w-full max-w-[860px] overflow-hidden bg-[#fbf9f5] shadow-2xl">
        <section className="relative h-[46vh] min-h-[390px] max-h-[590px] overflow-hidden">
          <img
            src="/bedroom-cover.jpg"
            alt="The Bedroom"
            className="absolute inset-0 h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.src =
                "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1400&q=88";
            }}
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/10 to-black/80" />

          <div className="absolute inset-x-0 top-0 flex items-center justify-between p-5 text-white">
            <div className="text-xs font-bold tracking-[0.25em]">
              THE BEDROOM
            </div>

            <button
              type="button"
              onClick={() => setActiveSection("contact")}
              className="grid h-11 w-11 place-items-center rounded-full bg-white/15 backdrop-blur-md"
              aria-label="Contacter l’hôte"
            >
              <MessageCircle size={20} />
            </button>
          </div>

          <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-10">
            <p className="mb-1 font-serif text-4xl italic sm:text-5xl">
              Bonjour !
            </p>

            <h1 className="max-w-lg text-4xl font-black leading-[0.92] tracking-[-0.05em] sm:text-6xl">
              BIENVENUE CHEZ NOUS
            </h1>

            <p className="mt-3 max-w-md text-sm text-white/80">
              Toutes les informations utiles pour profiter de votre séjour.
            </p>
          </div>
        </section>

        <section className="relative z-10 -mt-5 rounded-t-[30px] bg-[#fbf9f5] px-4 pb-28 pt-7 sm:px-8">
          <div className="mb-7 flex items-center justify-between rounded-[24px] bg-[#eee3d3] p-4">
            <div>
              <p className="text-[10px] font-bold tracking-[0.18em] text-black/45">
                VOTRE SÉJOUR
              </p>

              <p className="mt-1 text-sm font-bold">
                Arrivée dès 15 h · Départ avant 10 h
              </p>
            </div>

            <Clock3 size={22} />
          </div>

          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="font-serif text-2xl italic">Votre livret</p>
              <h2 className="text-2xl font-black tracking-[-0.04em]">
                LES INFORMATIONS
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {tiles.map((tile) => {
              const Icon = tile.icon;

              return (
                <button
                  key={tile.id}
                  type="button"
                  onClick={() => setActiveSection(tile.id)}
                  className={`relative min-h-[150px] overflow-hidden rounded-[25px] text-left transition active:scale-[0.98] ${
                    tile.image
                      ? "text-white"
                      : tile.accent
                        ? "bg-[#111] text-white"
                        : "bg-[#eee3d3] text-black"
                  }`}
                >
                  {tile.image && (
                    <>
                      <img
                        src={tile.image}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    </>
                  )}

                  <div className="relative flex h-full min-h-[150px] flex-col p-4">
                    <span
                      className={`grid h-10 w-10 place-items-center rounded-full ${
                        tile.image
                          ? "bg-white/20 backdrop-blur"
                          : tile.accent
                            ? "bg-white text-black"
                            : "bg-white"
                      }`}
                    >
                      <Icon size={20} />
                    </span>

                    <div className="mt-auto">
                      <strong className="block text-[15px] leading-tight">
                        {tile.title}
                      </strong>
                      <span
                        className={`mt-1 block text-[11px] ${
                          tile.image || tile.accent
                            ? "text-white/70"
                            : "text-black/50"
                        }`}
                      >
                        {tile.subtitle}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <nav className="fixed bottom-3 left-1/2 z-40 grid w-[calc(100%-24px)] max-w-[810px] -translate-x-1/2 grid-cols-5 rounded-[24px] border border-black/5 bg-white/95 p-2 shadow-2xl backdrop-blur-xl">
          {[
            { label: "Accueil", icon: Home, action: () => setActiveSection(null) },
            {
              label: "Séjour",
              icon: KeyRound,
              action: () => setActiveSection("arrival"),
            },
            {
              label: "Découvrir",
              icon: Compass,
              action: () => setActiveSection("activities"),
            },
            {
              label: "Adresses",
              icon: Utensils,
              action: () => setActiveSection("restaurants"),
            },
            {
              label: "Contact",
              icon: MessageCircle,
              action: () => setActiveSection("contact"),
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <button
                type="button"
                key={item.label}
                onClick={item.action}
                className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-[18px] text-[9px] font-bold text-black/55 first:bg-[#eee3d3] first:text-black"
              >
                <Icon size={20} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {activeSection && (
          <div className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm">
            <section className="absolute inset-x-0 bottom-0 mx-auto max-h-[92vh] w-full max-w-[860px] overflow-y-auto rounded-t-[34px] bg-[#fbf9f5] px-5 pb-12 pt-5 sm:px-9">
              <div className="sticky top-0 z-10 mb-5 flex items-center justify-between bg-[#fbf9f5]/95 pb-3 backdrop-blur">
                <button
                  type="button"
                  onClick={() => setActiveSection(null)}
                  className="flex items-center gap-2 text-sm font-bold"
                >
                  <ArrowLeft size={19} />
                  Retour
                </button>

                <button
                  type="button"
                  onClick={() => setActiveSection(null)}
                  className="grid h-10 w-10 place-items-center rounded-full bg-[#eee3d3]"
                  aria-label="Fermer"
                >
                  <X size={19} />
                </button>
              </div>

              {activeSection === "arrival" && (
                <DetailHeader
                  script="Les horaires"
                  title="ARRIVÉE & DÉPART"
                  icon={KeyRound}
                >
                  <InformationBlock title="Votre arrivée" badge="À PARTIR DE 15 H">
                    L’arrivée est autonome grâce à la boîte à clés. Vous pouvez
                    arriver à l’heure qui vous convient à partir de 15 h.
                  </InformationBlock>

                  <InformationBlock title="Votre départ" badge="AVANT 10 H">
                    Éteignez les lumières, faites la vaisselle, sortez les
                    poubelles, fermez portes et fenêtres puis remettez les clés
                    dans la boîte.
                  </InformationBlock>
                </DetailHeader>
              )}

              {activeSection === "wifi" && (
                <DetailHeader script="Connexion" title="LE WI-FI" icon={Wifi}>
                  <CopyBlock
                    label="RÉSEAU"
                    value="LIVEBOX-5DD0"
                    copied={copied === "wifi"}
                    onCopy={() => copyText("wifi", "LIVEBOX-5DD0")}
                  />

                  <CopyBlock
                    label="MOT DE PASSE"
                    value="THEROOM69330"
                    copied={copied === "password"}
                    onCopy={() => copyText("password", "THEROOM69330")}
                  />
                </DetailHeader>
              )}

              {activeSection === "know" && (
                <DetailHeader script="Bon" title="À SAVOIR" icon={Info}>
                  <div className="space-y-3">
                    {usefulInformation.map((item) => {
                      const Icon = item.icon;

                      return (
                        <article
                          key={item.title}
                          className="flex gap-4 rounded-[22px] bg-[#eee3d3] p-4"
                        >
                          <span className="grid h-11 w-11 flex-none place-items-center rounded-full bg-white">
                            <Icon size={20} />
                          </span>

                          <div>
                            <h3 className="font-black">{item.title}</h3>
                            <p className="mt-1 text-sm leading-relaxed text-black/60">
                              {item.text}
                            </p>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </DetailHeader>
              )}

              {activeSection === "rules" && (
                <DetailHeader script="Quelques" title="RÈGLES" icon={ScrollText}>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      ["01", "Respect des lieux", "Prenez soin du logement et de ses extérieurs."],
                      ["02", "Animaux", "Les animaux ne sont pas acceptés."],
                      ["03", "Non-fumeur", "Il est interdit de fumer à l’intérieur."],
                      ["04", "Fêtes", "Pas de fêtes et bruit limité après 22 h."],
                      ["05", "Voyageurs", "Aucun voyageur supplémentaire imprévu."],
                      ["06", "Sécurité", "Respectez les équipements et consignes de sécurité."],
                    ].map(([number, title, text]) => (
                      <article
                        key={number}
                        className="min-h-[175px] rounded-[50%] bg-[#eee3d3] p-5 text-center"
                      >
                        <strong className="text-2xl">{number}</strong>
                        <h3 className="mt-2 text-xs font-black uppercase">
                          {title}
                        </h3>
                        <p className="mt-2 text-xs leading-relaxed text-black/65">
                          {text}
                        </p>
                      </article>
                    ))}
                  </div>
                </DetailHeader>
              )}

              {activeSection === "linen" && (
                <DetailHeader
                  script="Le"
                  title="LINGE & ÉQUIPEMENTS"
                  icon={WashingMachine}
                >
                  {[
                    {
                      title: "Serviettes",
                      text: "Elles sont rangées dans le placard sous la vasque. Déposez les serviettes utilisées au sol dans la salle de bain avant votre départ.",
                    },
                    {
                      title: "Linge de lit",
                      text: "Les lits sont préparés avant votre arrivée. Déposez les draps utilisés au sol dans la salle de bain.",
                    },
                    {
                      title: "Sèche-cheveux",
                      text: "Il est disponible dans le meuble vasque de la salle de bain.",
                    },
                    {
                      title: "Machine à laver",
                      text: "Le logement n’en possède pas. Une laverie libre-service est disponible sur le parking de Carrefour Market, près de la station-service.",
                    },
                  ].map((item) => (
                    <InformationBlock key={item.title} title={item.title}>
                      {item.text}
                    </InformationBlock>
                  ))}
                </DetailHeader>
              )}

              {activeSection === "restaurants" && (
                <DetailHeader
                  script="À proximité"
                  title="RESTAURANTS"
                  icon={Utensils}
                >
                  <PlaceList places={restaurants} />
                </DetailHeader>
              )}

              {activeSection === "activities" && (
                <DetailHeader
                  script="À faire, à voir"
                  title="VISITES"
                  icon={Compass}
                >
                  <PlaceList places={activities} />
                </DetailHeader>
              )}

              {activeSection === "shops" && (
                <DetailHeader
                  script="Les"
                  title="COMMERCES"
                  icon={ShoppingBag}
                >
                  <InformationBlock title="Courses à proximité">
                    Carrefour Market et Lidl permettent de faire les courses à
                    quelques minutes du logement.
                  </InformationBlock>

                  <PlaceList
                    places={[
                      {
                        name: "Halles Paul Bocuse",
                        distance: "15 km",
                        description:
                          "Un lieu incontournable pour découvrir la gastronomie lyonnaise.",
                      },
                      {
                        name: "Westfield La Part-Dieu",
                        distance: "22 km",
                        description:
                          "Grand centre commercial regroupant de nombreuses boutiques et restaurants.",
                      },
                      {
                        name: "The Village Outlet",
                        distance: "31 km",
                        description:
                          "Village de marques à Villefontaine avec boutiques, restaurants et espace enfants.",
                      },
                      {
                        name: "Confluence",
                        distance: "36 km",
                        description:
                          "Boutiques, loisirs, restauration et architecture contemporaine.",
                      },
                    ]}
                  />
                </DetailHeader>
              )}

              {activeSection === "contact" && (
                <DetailHeader
                  script="Une question ?"
                  title="CONTACT"
                  icon={MessageCircle}
                >
                  <p className="mb-5 text-sm leading-relaxed text-black/60">
                    Nous restons disponibles avant et pendant votre séjour.
                  </p>

                  <div className="grid gap-3">
                    <button
                      type="button"
                      className="flex min-h-14 items-center justify-center gap-2 rounded-full bg-black font-bold text-white"
                    >
                      <MessageCircle size={19} />
                      Envoyer un message
                    </button>

                    <button
                      type="button"
                      className="flex min-h-14 items-center justify-center gap-2 rounded-full bg-[#eee3d3] font-bold"
                    >
                      <Phone size={19} />
                      Appeler
                    </button>
                  </div>
                </DetailHeader>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  );
}

function DetailHeader({
  script,
  title,
  icon: Icon,
  children,
}: {
  script: string;
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="mb-7">
        <span className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-[#eee3d3]">
          <Icon size={22} />
        </span>

        <p className="font-serif text-3xl italic">{script}</p>
        <h2 className="text-4xl font-black leading-[0.92] tracking-[-0.05em]">
          {title}
        </h2>
      </div>

      <div className="space-y-4">{children}</div>
    </>
  );
}

function InformationBlock({
  title,
  badge,
  children,
}: {
  title: string;
  badge?: string;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-[25px] bg-[#eee3d3] p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="font-black">{title}</h3>
        {badge && (
          <span className="rounded-full bg-white px-3 py-2 text-[10px] font-black">
            {badge}
          </span>
        )}
      </div>

      <p className="mt-3 text-sm leading-relaxed text-black/65">{children}</p>
    </article>
  );
}

function CopyBlock({
  label,
  value,
  copied,
  onCopy,
}: {
  label: string;
  value: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <article className="flex items-center justify-between gap-4 rounded-[24px] bg-black p-5 text-white">
      <div>
        <p className="text-[10px] font-bold tracking-[0.18em] text-white/50">
          {label}
        </p>
        <p className="mt-2 text-xl font-black">{value}</p>
      </div>

      <button
        type="button"
        onClick={onCopy}
        className="grid h-12 w-12 place-items-center rounded-full bg-[#eee3d3] text-black"
      >
        {copied ? <Check size={20} /> : <Copy size={20} />}
      </button>
    </article>
  );
}

function PlaceList({
  places,
}: {
  places: Array<{
    name: string;
    distance: string;
    description: string;
  }>;
}) {
  return (
    <div className="space-y-3">
      {places.map((place) => (
        <article
          key={place.name}
          className="rounded-[25px] border border-black/5 bg-white p-5 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-black">{place.name}</h3>
              <span className="mt-1 inline-flex items-center gap-1 text-xs font-bold text-black/45">
                <MapPin size={13} />
                {place.distance}
              </span>
            </div>

            <button
              type="button"
              onClick={() => goToMaps(`${place.name}, Jonage`)}
              className="grid h-10 w-10 flex-none place-items-center rounded-full bg-[#eee3d3]"
              aria-label={`Voir ${place.name} sur la carte`}
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <p className="mt-3 text-sm leading-relaxed text-black/60">
            {place.description}
          </p>
        </article>
      ))}
    </div>
  );
}
