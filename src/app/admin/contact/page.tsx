"use client";

import { ArrowLeft, Check, Eye, Home, MessageCircle, Save } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  DEFAULT_HOME_CONFIGURATION,
  type GuideHomeConfiguration,
} from "@/lib/guide-home-config";

export default function AdminContactPage() {
  const [configuration, setConfiguration] =
    useState<GuideHomeConfiguration>(DEFAULT_HOME_CONFIGURATION);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadConfiguration() {
      const response = await fetch("/api/appearance", { cache: "no-store" });
      const result = await response.json();
      if (response.ok && result.success && result.configuration) {
        setConfiguration(result.configuration);
      }
    }

    loadConfiguration().catch(console.error);
  }, []);

  async function saveConfiguration() {
    const response = await fetch("/api/appearance", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ configuration }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      window.alert(result.error ?? "Impossible d’enregistrer le numéro.");
      return;
    }

    setConfiguration(result.configuration);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  }

  return (
    <main className="min-h-screen bg-[#e7dfd4] p-3 sm:p-5">
      <div className="mx-auto min-h-[calc(100vh-24px)] max-w-[900px] overflow-hidden rounded-[26px] bg-[#faf8f4] shadow-xl">
        <header className="flex items-center justify-between border-b border-black/5 px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="grid h-10 w-10 place-items-center rounded-full bg-[#eee3d3]">
              <ArrowLeft size={18} />
            </Link>
            <div>
              <p className="text-[9px] font-black tracking-[0.22em] text-black/40">THE BEDROOM</p>
              <h1 className="text-lg font-black">Contact voyageur</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/" target="_blank" className="flex h-10 items-center gap-2 rounded-full bg-[#eee3d3] px-4 text-xs font-black">
              <Eye size={16} /> Aperçu
            </Link>
            <Link href="/admin" className="grid h-10 w-10 place-items-center rounded-full bg-black text-white">
              <Home size={18} />
            </Link>
          </div>
        </header>

        <section className="p-5 sm:p-8">
          <p className="font-serif text-3xl italic">Communication directe</p>
          <h2 className="text-4xl font-black leading-none tracking-[-0.05em]">WHATSAPP</h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-black/50">
            Saisis le numéro qui sera utilisé par le bouton de contact du livret. Utilise le format international sans espaces, par exemple 33627630932.
          </p>

          {saved && (
            <div className="mt-5 flex items-center gap-2 rounded-[17px] bg-[#dcebdd] px-4 py-3 text-sm font-black">
              <Check size={18} /> Numéro enregistré
            </div>
          )}

          <article className="mt-7 rounded-[25px] bg-white p-5 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-[#eee3d3]">
                <MessageCircle size={20} />
              </span>
              <div>
                <p className="font-serif text-xl italic">Formulaire de contact</p>
                <h3 className="text-lg font-black">NUMÉRO WHATSAPP</h3>
              </div>
            </div>

            <label className="mt-5 block">
              <span className="mb-2 block text-xs font-black">Numéro international</span>
              <input
                value={configuration.whatsappPhone ?? ""}
                onChange={(event) =>
                  setConfiguration((current) => ({
                    ...current,
                    whatsappPhone: event.target.value.replace(/[^0-9]/g, ""),
                  }))
                }
                placeholder="33627630932"
                className="min-h-12 w-full rounded-[16px] border border-black/10 bg-[#faf8f4] px-4 text-sm outline-none focus:border-black"
              />
            </label>

            <button
              type="button"
              onClick={saveConfiguration}
              className="mt-5 flex min-h-13 w-full items-center justify-center gap-2 rounded-full bg-black text-sm font-black text-white"
            >
              <Save size={18} /> Enregistrer
            </button>
          </article>
        </section>
      </div>
    </main>
  );
}
