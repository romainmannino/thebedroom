"use client";

import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Check,
  Eye,
  GripVertical,
  Home,
  Image as ImageIcon,
  LayoutGrid,
  Save,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  DEFAULT_HOME_CONFIGURATION,
  HOME_CONFIG_STORAGE_KEY,
  type GuideHomeConfiguration,
  type HomeTileConfiguration,
  type HomeTileSize,
} from "@/lib/guide-home-config";

export default function AppearancePage() {
  const [configuration, setConfiguration] =
    useState<GuideHomeConfiguration>(DEFAULT_HOME_CONFIGURATION);

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const storedConfiguration = localStorage.getItem(
      HOME_CONFIG_STORAGE_KEY,
    );

    if (!storedConfiguration) {
      return;
    }

    try {
      setConfiguration(
        JSON.parse(storedConfiguration) as GuideHomeConfiguration,
      );
    } catch {
      localStorage.removeItem(HOME_CONFIG_STORAGE_KEY);
    }
  }, []);

  function updateTile(
    tileId: string,
    updates: Partial<HomeTileConfiguration>,
  ) {
    setConfiguration((current) => ({
      ...current,
      tiles: current.tiles.map((tile) =>
        tile.id === tileId ? { ...tile, ...updates } : tile,
      ),
    }));
  }

  function moveTile(tileId: string, direction: "up" | "down") {
    setConfiguration((current) => {
      const sortedTiles = [...current.tiles].sort(
        (firstTile, secondTile) =>
          firstTile.position - secondTile.position,
      );

      const currentIndex = sortedTiles.findIndex(
        (tile) => tile.id === tileId,
      );

      const targetIndex =
        direction === "up" ? currentIndex - 1 : currentIndex + 1;

      if (
        currentIndex < 0 ||
        targetIndex < 0 ||
        targetIndex >= sortedTiles.length
      ) {
        return current;
      }

      const currentTile = sortedTiles[currentIndex];
      const targetTile = sortedTiles[targetIndex];

      sortedTiles[currentIndex] = {
        ...targetTile,
        position: currentIndex,
      };

      sortedTiles[targetIndex] = {
        ...currentTile,
        position: targetIndex,
      };

      return {
        ...current,
        tiles: sortedTiles,
      };
    });
  }

  function handleImageFile(
    file: File | undefined,
    target: "hero" | string,
  ) {
    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const image = String(reader.result ?? "");

      if (target === "hero") {
        setConfiguration((current) => ({
          ...current,
          heroImage: image,
        }));

        return;
      }

      updateTile(target, {
        image,
      });
    };

    reader.readAsDataURL(file);
  }

  function saveConfiguration() {
    localStorage.setItem(
      HOME_CONFIG_STORAGE_KEY,
      JSON.stringify(configuration),
    );

    window.dispatchEvent(new Event("the-bedroom-home-updated"));

    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 1800);
  }

  function resetConfiguration() {
    if (
      !window.confirm(
        "Réinitialiser complètement l’apparence de l’accueil ?",
      )
    ) {
      return;
    }

    setConfiguration(DEFAULT_HOME_CONFIGURATION);
    localStorage.removeItem(HOME_CONFIG_STORAGE_KEY);
  }

  const orderedTiles = [...configuration.tiles].sort(
    (firstTile, secondTile) =>
      firstTile.position - secondTile.position,
  );

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
                Apparence de l’accueil
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
          <div>
            <p className="font-serif text-3xl italic">
              Personnaliser
            </p>

            <h2 className="text-4xl font-black leading-none tracking-[-0.05em]">
              LA PAGE D’ACCUEIL
            </h2>

            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-black/45">
              Modifie la grande photo, les textes, les vignettes et leur
              ordre d’affichage.
            </p>
          </div>

          {saved && (
            <div className="mt-5 flex items-center gap-2 rounded-[17px] bg-[#dcebdd] px-4 py-3 text-sm font-black">
              <Check size={18} />
              Apparence enregistrée
            </div>
          )}

          <section className="mt-7 grid gap-6 lg:grid-cols-[1fr_360px]">
            <div className="space-y-6">
              <article className="rounded-[25px] bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[#eee3d3]">
                    <ImageIcon size={19} />
                  </span>

                  <div>
                    <p className="font-serif text-xl italic">
                      Grande photo
                    </p>

                    <h3 className="text-lg font-black">
                      EN-TÊTE DU LIVRET
                    </h3>
                  </div>
                </div>

                <div className="relative mt-5 min-h-[260px] overflow-hidden rounded-[22px] bg-black">
                  {configuration.heroImage && (
                    <img
                      src={configuration.heroImage}
                      alt="Aperçu de l’en-tête"
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    <p className="font-serif text-3xl italic">
                      {configuration.greeting}
                    </p>

                    <p className="mt-1 text-3xl font-black leading-none">
                      {configuration.heroTitle}
                    </p>

                    <p className="mt-3 text-xs text-white/65">
                      {configuration.heroSubtitle}
                    </p>
                  </div>
                </div>

                <label className="mt-4 flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#eee3d3] text-sm font-black">
                  <Upload size={17} />
                  Changer la grande photo

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) =>
                      handleImageFile(
                        event.target.files?.[0],
                        "hero",
                      )
                    }
                  />
                </label>

                <div className="mt-5 grid gap-4">
                  <TextField
                    label="Texte manuscrit"
                    value={configuration.greeting}
                    onChange={(value) =>
                      setConfiguration((current) => ({
                        ...current,
                        greeting: value,
                      }))
                    }
                  />

                  <TextField
                    label="Titre principal"
                    value={configuration.heroTitle}
                    onChange={(value) =>
                      setConfiguration((current) => ({
                        ...current,
                        heroTitle: value,
                      }))
                    }
                  />

                  <TextField
                    label="Petite phrase"
                    value={configuration.heroSubtitle}
                    onChange={(value) =>
                      setConfiguration((current) => ({
                        ...current,
                        heroSubtitle: value,
                      }))
                    }
                  />

                  <label>
                    <span className="mb-2 block text-xs font-black">
                      Hauteur de la photo
                    </span>

                    <select
                      value={configuration.heroHeight}
                      onChange={(event) =>
                        setConfiguration((current) => ({
                          ...current,
                          heroHeight: event.target.value as
                            GuideHomeConfiguration["heroHeight"],
                        }))
                      }
                      className="min-h-12 w-full rounded-[16px] border border-black/10 bg-[#faf8f4] px-4 text-sm outline-none"
                    >
                      <option value="small">Petite</option>
                      <option value="normal">Normale</option>
                      <option value="large">Grande</option>
                    </select>
                  </label>
                </div>
              </article>

              <article className="rounded-[25px] bg-white p-5 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[#eee3d3]">
                    <LayoutGrid size={19} />
                  </span>

                  <div>
                    <p className="font-serif text-xl italic">
                      Organiser
                    </p>

                    <h3 className="text-lg font-black">
                      LES VIGNETTES
                    </h3>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {orderedTiles.map((tile, index) => (
                    <article
                      key={tile.id}
                      className="rounded-[20px] bg-[#eee3d3] p-4"
                    >
                      <div className="flex items-center gap-3">
                        <GripVertical
                          size={19}
                          className="text-black/30"
                        />

                        <div className="min-w-0 flex-1">
                          <p className="font-black">
                            {tile.title}
                          </p>

                          <p className="mt-1 text-xs text-black/45">
                            {tile.subtitle}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            updateTile(tile.id, {
                              visible: !tile.visible,
                            })
                          }
                          className={`relative h-7 w-12 flex-none rounded-full ${
                            tile.visible
                              ? "bg-black"
                              : "bg-black/15"
                          }`}
                        >
                          <span
                            className={`absolute top-1 h-5 w-5 rounded-full bg-white transition ${
                              tile.visible
                                ? "left-6"
                                : "left-1"
                            }`}
                          />
                        </button>
                      </div>

                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        <TextField
                          label="Titre"
                          value={tile.title}
                          onChange={(value) =>
                            updateTile(tile.id, {
                              title: value,
                            })
                          }
                        />

                        <TextField
                          label="Sous-titre"
                          value={tile.subtitle}
                          onChange={(value) =>
                            updateTile(tile.id, {
                              subtitle: value,
                            })
                          }
                        />

                        <label>
                          <span className="mb-2 block text-xs font-black">
                            Taille de la vignette
                          </span>

                          <select
                            value={tile.size}
                            onChange={(event) =>
                              updateTile(tile.id, {
                                size: event.target
                                  .value as HomeTileSize,
                              })
                            }
                            className="min-h-11 w-full rounded-[14px] border border-black/10 bg-white px-3 text-sm outline-none"
                          >
                            <option value="normal">
                              Normale
                            </option>
                            <option value="large">
                              Large
                            </option>
                            <option value="full">
                              Pleine largeur
                            </option>
                          </select>
                        </label>

                        <label className="flex min-h-11 cursor-pointer items-center justify-center gap-2 self-end rounded-[14px] bg-white text-xs font-black">
                          <Upload size={16} />
                          {tile.image
                            ? "Changer la photo"
                            : "Ajouter une photo"}

                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(event) =>
                              handleImageFile(
                                event.target.files?.[0],
                                tile.id,
                              )
                            }
                          />
                        </label>
                      </div>

                      {tile.image && (
                        <div className="relative mt-3 h-28 overflow-hidden rounded-[15px]">
                          <img
                            src={tile.image}
                            alt=""
                            className="h-full w-full object-cover"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              updateTile(tile.id, {
                                image: "",
                              })
                            }
                            className="absolute right-2 top-2 rounded-full bg-black/75 px-3 py-1.5 text-[10px] font-black text-white"
                          >
                            Retirer
                          </button>
                        </div>
                      )}

                      <div className="mt-3 flex justify-end gap-2">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() =>
                            moveTile(tile.id, "up")
                          }
                          className="grid h-9 w-9 place-items-center rounded-full bg-white disabled:opacity-25"
                          aria-label="Monter"
                        >
                          <ArrowUp size={16} />
                        </button>

                        <button
                          type="button"
                          disabled={
                            index === orderedTiles.length - 1
                          }
                          onClick={() =>
                            moveTile(tile.id, "down")
                          }
                          className="grid h-9 w-9 place-items-center rounded-full bg-white disabled:opacity-25"
                          aria-label="Descendre"
                        >
                          <ArrowDown size={16} />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </article>
            </div>

            <aside className="h-fit rounded-[25px] bg-black p-5 text-white lg:sticky lg:top-5">
              <p className="font-serif text-2xl italic">
                Aperçu rapide
              </p>

              <h3 className="text-xl font-black">
                GRILLE D’ACCUEIL
              </h3>

              <div className="mt-5 grid grid-cols-2 gap-2">
                {orderedTiles
                  .filter((tile) => tile.visible)
                  .map((tile) => (
                    <div
                      key={tile.id}
                      className={`relative min-h-24 overflow-hidden rounded-[15px] bg-white/10 p-3 ${
                        tile.size === "large"
                          ? "col-span-2"
                          : tile.size === "full"
                            ? "col-span-2 min-h-32"
                            : "col-span-1"
                      }`}
                    >
                      {tile.image && (
                        <>
                          <img
                            src={tile.image}
                            alt=""
                            className="absolute inset-0 h-full w-full object-cover"
                          />

                          <div className="absolute inset-0 bg-black/55" />
                        </>
                      )}

                      <p className="relative mt-auto text-xs font-black">
                        {tile.title}
                      </p>
                    </div>
                  ))}
              </div>

              <button
                type="button"
                onClick={saveConfiguration}
                className="mt-6 flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-[#eee3d3] text-sm font-black text-black"
              >
                <Save size={18} />
                Enregistrer
              </button>

              <button
                type="button"
                onClick={resetConfiguration}
                className="mt-3 w-full text-xs font-bold text-white/45"
              >
                Réinitialiser l’apparence
              </button>
            </aside>
          </section>
        </section>
      </div>
    </main>
  );
}

function TextField({
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
        className="min-h-11 w-full rounded-[14px] border border-black/10 bg-white px-3 text-sm outline-none focus:border-black"
      />
    </label>
  );
}
