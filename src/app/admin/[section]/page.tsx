"use client";

import {
  ArrowLeft,
  BookOpen,
  Car,
  ChevronRight,
  CircleAlert,
  Eye,
  FileText,
  Home,
  Image as ImageIcon,
  Info,
  MapPin,
  Monitor,
  ParkingCircle,
  Plus,
  Settings,
  Snowflake,
  Trash2,
  Tv,
  Upload,
  Utensils,
  Video,
  X,
} from "lucide-react";
import Link from "next/link";
import { use, useEffect, useMemo, useState } from "react";

type SectionPageProps = {
  params: Promise<{
    section: string;
  }>;
};

type ContentType = "text" | "image" | "video" | "pdf";

type ContentBlock = {
  id: string;
  type: ContentType;
  title: string;
  content: string;
  fileName?: string;
  fileUrl?: string;
};

type GuideItem = {
  id: string;
  title: string;
  description: string;
  iconName: string;
  blocks: ContentBlock[];
};

type SectionConfiguration = {
  title: string;
  script: string;
  description: string;
  iconName: string;
  initialItems: GuideItem[];
};

const sectionConfigurations: Record<string, SectionConfiguration> = {
  "bon-a-savoir": {
    title: "BON À SAVOIR",
    script: "Les informations",
    description:
      "Ajoute des explications, photos, vidéos ou notices PDF pour chaque équipement.",
    iconName: "info",
    initialItems: [
      {
        id: "television",
        title: "Télévision",
        description: "Molotov TV, télécommande et fonctionnement.",
        iconName: "tv",
        blocks: [
          {
            id: "tv-text",
            type: "text",
            title: "Regarder la télévision",
            content:
              "Les chaînes de la TNT sont accessibles depuis l’application Molotov TV disponible sur l’écran d’accueil.",
          },
        ],
      },
      {
        id: "climatisation",
        title: "Chauffage et climatisation",
        description: "Réglage de la température et télécommande.",
        iconName: "snowflake",
        blocks: [
          {
            id: "clim-text",
            type: "text",
            title: "Réglage",
            content:
              "La température est préréglée. Utilisez la télécommande pour l’adapter à votre convenance.",
          },
        ],
      },
      {
        id: "parking",
        title: "Stationnement",
        description: "Places disponibles autour du logement.",
        iconName: "parking",
        blocks: [
          {
            id: "parking-text",
            type: "text",
            title: "Où stationner ?",
            content:
              "Des places gratuites sont disponibles devant le logement. Il est également possible de stationner sur le parking de Carrefour Market.",
          },
        ],
      },
      {
        id: "poubelles",
        title: "Poubelles",
        description: "Ordures ménagères et bac de tri.",
        iconName: "trash",
        blocks: [
          {
            id: "trash-text",
            type: "text",
            title: "Tri et déchets",
            content:
              "La poubelle ménagère se trouve sous l’évier. Le bac de tri est situé à l’extérieur.",
          },
        ],
      },
    ],
  },

  restaurants: {
    title: "RESTAURANTS",
    script: "Vos bonnes adresses",
    description:
      "Ajoute, modifie ou supprime les restaurants recommandés aux voyageurs.",
    iconName: "restaurants",
    initialItems: [
      {
        id: "grillesia",
        title: "Le Grillesia",
        description: "À environ 100 mètres.",
        iconName: "restaurants",
        blocks: [
          {
            id: "grillesia-text",
            type: "text",
            title: "Description",
            content:
              "Cuisine créative et traditionnelle, viandes maturées et plats traditionnels.",
          },
        ],
      },
      {
        id: "temps-saisons",
        title: "Le Temps des Saisons",
        description: "À environ 300 mètres.",
        iconName: "restaurants",
        blocks: [
          {
            id: "temps-text",
            type: "text",
            title: "Description",
            content:
              "Cuisine du marché réalisée avec des produits frais et locaux.",
          },
        ],
      },
      {
        id: "per-lei-jons",
        title: "Per Lei Jons",
        description: "À environ 3,2 km.",
        iconName: "restaurants",
        blocks: [
          {
            id: "perlei-text",
            type: "text",
            title: "Description",
            content:
              "Pizzas, pâtes et salades sur place, en terrasse ou à emporter.",
          },
        ],
      },
      {
        id: "bon-vivant",
        title: "Le Bon Vivant",
        description: "À environ 4,8 km.",
        iconName: "restaurants",
        blocks: [
          {
            id: "bonvivant-text",
            type: "text",
            title: "Description",
            content:
              "Cuisine élaborée avec des produits frais, locaux et de saison.",
          },
        ],
      },
    ],
  },

  activites: {
    title: "ACTIVITÉS",
    script: "À découvrir",
    description:
      "Présente les activités, visites et sorties recommandées autour du logement.",
    iconName: "activities",
    initialItems: [
      {
        id: "miribel",
        title: "Grand Parc Miribel-Jonage",
        description: "Nature, baignade et sports nautiques.",
        iconName: "activities",
        blocks: [
          {
            id: "miribel-text",
            type: "text",
            title: "À découvrir",
            content:
              "Un grand espace naturel pour se baigner, se promener, pratiquer des activités nautiques ou simplement se détendre.",
          },
        ],
      },
      {
        id: "tete-or",
        title: "Parc de la Tête-d’Or",
        description: "Parc, lac, zoo et activités familiales.",
        iconName: "activities",
        blocks: [
          {
            id: "teteor-text",
            type: "text",
            title: "À découvrir",
            content:
              "Le grand parc lyonnais avec son lac, son zoo, ses espaces verts et ses manèges.",
          },
        ],
      },
      {
        id: "lyon",
        title: "Lyon et le Vieux Lyon",
        description: "Quartiers historiques et gastronomie.",
        iconName: "activities",
        blocks: [
          {
            id: "lyon-text",
            type: "text",
            title: "À découvrir",
            content:
              "Découvrez la Presqu’île, le Vieux Lyon, les traboules, les musées et les nombreux restaurants.",
          },
        ],
      },
      {
        id: "perouges",
        title: "Pérouges",
        description: "Village médiéval.",
        iconName: "activities",
        blocks: [
          {
            id: "perouges-text",
            type: "text",
            title: "À découvrir",
            content:
              "Un village médiéval connu pour ses ruelles pavées, ses bâtiments historiques et sa galette au sucre.",
          },
        ],
      },
    ],
  },

  parametres: {
    title: "PARAMÈTRES",
    script: "Le logement",
    description:
      "Modifie les informations générales, les horaires et les accès.",
    iconName: "settings",
    initialItems: [
      {
        id: "horaires",
        title: "Horaires",
        description: "Arrivée dès 15 h, départ avant 10 h.",
        iconName: "info",
        blocks: [
          {
            id: "horaires-text",
            type: "text",
            title: "Horaires du séjour",
            content:
              "L’arrivée est possible à partir de 15 h. Le départ doit avoir lieu avant 10 h.",
          },
        ],
      },
      {
        id: "wifi",
        title: "Wi-Fi",
        description: "Réseau et mot de passe.",
        iconName: "monitor",
        blocks: [
          {
            id: "wifi-text",
            type: "text",
            title: "Connexion",
            content:
              "Réseau : LIVEBOX-5DD0\nMot de passe : THEROOM69330",
          },
        ],
      },
      {
        id: "acces",
        title: "Accès au logement",
        description: "Boîte à clés et arrivée autonome.",
        iconName: "info",
        blocks: [
          {
            id: "acces-text",
            type: "text",
            title: "Arrivée autonome",
            content:
              "Le code de la boîte à clés est transmis dans le lien personnalisé du voyageur.",
          },
        ],
      },
    ],
  },
};

export default function AdminSectionPage({
  params,
}: SectionPageProps) {
  const { section } = use(params);

  const configuration =
    sectionConfigurations[section] ?? sectionConfigurations["bon-a-savoir"];

  const storageKey = `the-bedroom-admin-section-${section}`;

  const [items, setItems] = useState<GuideItem[]>(
    configuration.initialItems,
  );

  const [selectedItemId, setSelectedItemId] = useState<string | null>(
    null,
  );

  const [showAddItem, setShowAddItem] = useState(false);
  const [newItemTitle, setNewItemTitle] = useState("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem(storageKey);

    if (!storedData) return;

    try {
      setItems(JSON.parse(storedData) as GuideItem[]);
    } catch {
      localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  const selectedItem = useMemo(
    () => items.find((item) => item.id === selectedItemId) ?? null,
    [items, selectedItemId],
  );

  function saveItems(nextItems = items) {
    localStorage.setItem(storageKey, JSON.stringify(nextItems));
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1500);
  }

  function updateItem(updatedItem: GuideItem) {
    const nextItems = items.map((item) =>
      item.id === updatedItem.id ? updatedItem : item,
    );

    setItems(nextItems);
    saveItems(nextItems);
  }

  function deleteItem(itemId: string) {
    if (!window.confirm("Supprimer cette fiche ?")) return;

    const nextItems = items.filter((item) => item.id !== itemId);
    setItems(nextItems);
    setSelectedItemId(null);
    saveItems(nextItems);
  }

  function addItem() {
    if (!newItemTitle.trim()) return;

    const id = `${Date.now()}`;

    const nextItem: GuideItem = {
      id,
      title: newItemTitle.trim(),
      description: "Nouvelle fiche",
      iconName: configuration.iconName,
      blocks: [],
    };

    const nextItems = [...items, nextItem];

    setItems(nextItems);
    setNewItemTitle("");
    setShowAddItem(false);
    setSelectedItemId(id);
    saveItems(nextItems);
  }

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

        <section className="p-4 sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="font-serif text-3xl italic">
                {configuration.script}
              </p>

              <h2 className="text-4xl font-black leading-none tracking-[-0.05em]">
                {configuration.title}
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-relaxed text-black/45">
                {configuration.description}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowAddItem(true)}
              className="flex min-h-11 items-center justify-center gap-2 rounded-full bg-black px-5 text-sm font-black text-white"
            >
              <Plus size={17} />
              Ajouter une fiche
            </button>
          </div>

          {saved && (
            <div className="mt-5 rounded-[16px] bg-[#dcebdd] px-4 py-3 text-sm font-black">
              Modifications enregistrées
            </div>
          )}

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => {
              const Icon = getIcon(item.iconName);

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedItemId(item.id)}
                  className="flex min-h-[150px] flex-col rounded-[22px] bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[#eee3d3]">
                    <Icon size={19} />
                  </span>

                  <div className="mt-auto">
                    <h3 className="font-black">{item.title}</h3>

                    <p className="mt-1 text-xs leading-relaxed text-black/45">
                      {item.description}
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-black/35">
                        {item.blocks.length} bloc(s)
                      </span>

                      <ChevronRight size={17} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      {selectedItem && (
        <ItemEditor
          item={selectedItem}
          onClose={() => setSelectedItemId(null)}
          onSave={updateItem}
          onDelete={() => deleteItem(selectedItem.id)}
        />
      )}

      {showAddItem && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/45 p-4 backdrop-blur-sm">
          <section className="w-full max-w-[430px] rounded-[26px] bg-[#faf8f4] p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-serif text-2xl italic">
                  Nouvelle
                </p>
                <h2 className="text-xl font-black">
                  FICHE
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setShowAddItem(false)}
                className="grid h-10 w-10 place-items-center rounded-full bg-[#eee3d3]"
              >
                <X size={18} />
              </button>
            </div>

            <label className="mt-5 block">
              <span className="mb-2 block text-xs font-black">
                Nom de la fiche
              </span>

              <input
                value={newItemTitle}
                onChange={(event) =>
                  setNewItemTitle(event.target.value)
                }
                placeholder="Ex. Machine à café"
                className="min-h-12 w-full rounded-[16px] border border-black/10 bg-white px-4 text-sm outline-none focus:border-black"
              />
            </label>

            <button
              type="button"
              onClick={addItem}
              className="mt-5 min-h-12 w-full rounded-full bg-black text-sm font-black text-white"
            >
              Créer la fiche
            </button>
          </section>
        </div>
      )}
    </main>
  );
}

function ItemEditor({
  item,
  onClose,
  onSave,
  onDelete,
}: {
  item: GuideItem;
  onClose: () => void;
  onSave: (item: GuideItem) => void;
  onDelete: () => void;
}) {
  const [draft, setDraft] = useState(item);
  const [showBlockMenu, setShowBlockMenu] = useState(false);

  function updateBlock(
    blockId: string,
    updates: Partial<ContentBlock>,
  ) {
    setDraft((current) => ({
      ...current,
      blocks: current.blocks.map((block) =>
        block.id === blockId ? { ...block, ...updates } : block,
      ),
    }));
  }

  function deleteBlock(blockId: string) {
    setDraft((current) => ({
      ...current,
      blocks: current.blocks.filter(
        (block) => block.id !== blockId,
      ),
    }));
  }

  function addBlock(type: ContentType) {
    const labels: Record<ContentType, string> = {
      text: "Nouveau texte",
      image: "Nouvelle photo",
      video: "Nouvelle vidéo",
      pdf: "Nouveau document PDF",
    };

    setDraft((current) => ({
      ...current,
      blocks: [
        ...current.blocks,
        {
          id: `${Date.now()}`,
          type,
          title: labels[type],
          content: "",
        },
      ],
    }));

    setShowBlockMenu(false);
  }

  function handleFile(
    blockId: string,
    file: File | undefined,
  ) {
    if (!file) return;

    const fileUrl = URL.createObjectURL(file);

    updateBlock(blockId, {
      fileName: file.name,
      fileUrl,
    });
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/45 p-3 backdrop-blur-sm sm:p-6">
      <section className="mx-auto flex max-h-full w-full max-w-[760px] flex-col overflow-hidden rounded-[30px] bg-[#faf8f4] shadow-2xl">
        <header className="flex items-center justify-between border-b border-black/5 p-5">
          <div>
            <p className="font-serif text-2xl italic">
              Modifier
            </p>

            <h2 className="text-2xl font-black">
              {draft.title}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-full bg-[#eee3d3]"
          >
            <X size={18} />
          </button>
        </header>

        <div className="overflow-y-auto p-5">
          <div className="grid gap-4">
            <Field
              label="Titre"
              value={draft.title}
              onChange={(value) =>
                setDraft((current) => ({
                  ...current,
                  title: value,
                }))
              }
            />

            <Field
              label="Sous-titre"
              value={draft.description}
              onChange={(value) =>
                setDraft((current) => ({
                  ...current,
                  description: value,
                }))
              }
            />
          </div>

          <div className="mt-7 flex items-center justify-between">
            <div>
              <p className="font-serif text-2xl italic">
                Contenu
              </p>

              <h3 className="text-xl font-black">
                LES BLOCS
              </h3>
            </div>

            <button
              type="button"
              onClick={() => setShowBlockMenu(true)}
              className="flex min-h-10 items-center gap-2 rounded-full bg-black px-4 text-xs font-black text-white"
            >
              <Plus size={16} />
              Ajouter
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {draft.blocks.length === 0 && (
              <div className="rounded-[20px] border border-dashed border-black/15 p-8 text-center">
                <p className="text-sm font-black">
                  Aucun contenu
                </p>

                <p className="mt-2 text-xs text-black/45">
                  Ajoute un texte, une photo, une vidéo ou un PDF.
                </p>
              </div>
            )}

            {draft.blocks.map((block) => (
              <BlockEditor
                key={block.id}
                block={block}
                onChange={(updates) =>
                  updateBlock(block.id, updates)
                }
                onDelete={() => deleteBlock(block.id)}
                onFile={(file) =>
                  handleFile(block.id, file)
                }
              />
            ))}
          </div>
        </div>

        <footer className="flex gap-3 border-t border-black/5 bg-white p-5">
          <button
            type="button"
            onClick={onDelete}
            className="grid h-12 w-12 flex-none place-items-center rounded-full bg-[#f4dddd] text-[#9d3029]"
          >
            <Trash2 size={18} />
          </button>

          <button
            type="button"
            onClick={() => {
              onSave(draft);
              onClose();
            }}
            className="min-h-12 flex-1 rounded-full bg-black text-sm font-black text-white"
          >
            Enregistrer les modifications
          </button>
        </footer>
      </section>

      {showBlockMenu && (
        <div className="fixed inset-0 z-[60] grid place-items-center bg-black/35 p-4">
          <section className="w-full max-w-[460px] rounded-[25px] bg-white p-5">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black">
                Ajouter un bloc
              </h3>

              <button
                type="button"
                onClick={() => setShowBlockMenu(false)}
                className="grid h-9 w-9 place-items-center rounded-full bg-[#eee3d3]"
              >
                <X size={17} />
              </button>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <BlockTypeButton
                icon={FileText}
                label="Texte"
                onClick={() => addBlock("text")}
              />

              <BlockTypeButton
                icon={ImageIcon}
                label="Photo"
                onClick={() => addBlock("image")}
              />

              <BlockTypeButton
                icon={Video}
                label="Vidéo"
                onClick={() => addBlock("video")}
              />

              <BlockTypeButton
                icon={FileText}
                label="PDF"
                onClick={() => addBlock("pdf")}
              />
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

function BlockEditor({
  block,
  onChange,
  onDelete,
  onFile,
}: {
  block: ContentBlock;
  onChange: (updates: Partial<ContentBlock>) => void;
  onDelete: () => void;
  onFile: (file: File | undefined) => void;
}) {
  const Icon =
    block.type === "text"
      ? FileText
      : block.type === "image"
        ? ImageIcon
        : block.type === "video"
          ? Video
          : FileText;

  return (
    <article className="rounded-[20px] bg-[#eee3d3] p-4">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-white">
          <Icon size={17} />
        </span>

        <strong className="flex-1 text-sm">
          {block.type === "text"
            ? "Texte"
            : block.type === "image"
              ? "Photo"
              : block.type === "video"
                ? "Vidéo"
                : "PDF"}
        </strong>

        <button
          type="button"
          onClick={onDelete}
          className="grid h-9 w-9 place-items-center rounded-full bg-white"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <div className="mt-4 grid gap-3">
        <Field
          label="Titre du bloc"
          value={block.title}
          onChange={(value) => onChange({ title: value })}
        />

        {block.type === "text" ? (
          <label>
            <span className="mb-2 block text-xs font-black">
              Texte
            </span>

            <textarea
              value={block.content}
              onChange={(event) =>
                onChange({ content: event.target.value })
              }
              rows={5}
              className="w-full resize-none rounded-[15px] border border-black/10 bg-white px-4 py-3 text-sm outline-none"
            />
          </label>
        ) : (
          <>
            <label className="flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-[15px] bg-white text-sm font-black">
              <Upload size={17} />
              Importer un fichier

              <input
                type="file"
                className="hidden"
                accept={
                  block.type === "image"
                    ? "image/*"
                    : block.type === "video"
                      ? "video/*"
                      : "application/pdf"
                }
                onChange={(event) =>
                  onFile(event.target.files?.[0])
                }
              />
            </label>

            {block.fileName && (
              <p className="rounded-[12px] bg-white p-3 text-xs font-bold">
                {block.fileName}
              </p>
            )}

            <label>
              <span className="mb-2 block text-xs font-black">
                Description facultative
              </span>

              <textarea
                value={block.content}
                onChange={(event) =>
                  onChange({ content: event.target.value })
                }
                rows={3}
                className="w-full resize-none rounded-[15px] border border-black/10 bg-white px-4 py-3 text-sm outline-none"
              />
            </label>
          </>
        )}
      </div>
    </article>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      <span className="mb-2 block text-xs font-black">
        {label}
      </span>

      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="min-h-11 w-full rounded-[15px] border border-black/10 bg-white px-4 text-sm outline-none focus:border-black"
      />
    </label>
  );
}

function BlockTypeButton({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex min-h-[110px] flex-col rounded-[18px] bg-[#eee3d3] p-4 text-left"
    >
      <span className="grid h-9 w-9 place-items-center rounded-full bg-white">
        <Icon size={17} />
      </span>

      <strong className="mt-auto text-sm">
        {label}
      </strong>
    </button>
  );
}

function getIcon(iconName: string) {
  if (iconName === "tv") return Tv;
  if (iconName === "snowflake") return Snowflake;
  if (iconName === "parking") return ParkingCircle;
  if (iconName === "trash") return Trash2;
  if (iconName === "restaurants") return Utensils;
  if (iconName === "activities") return MapPin;
  if (iconName === "settings") return Settings;
  if (iconName === "monitor") return Monitor;
  if (iconName === "car") return Car;
  if (iconName === "alert") return CircleAlert;

  return Info;
}
