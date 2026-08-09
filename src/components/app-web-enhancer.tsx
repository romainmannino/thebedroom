"use client";

import { useEffect, useState } from "react";
import { Download, Share, X } from "lucide-react";

type BeforeInstallPromptEvent = Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: "accepted" | "dismissed" }> };

export function AppWebEnhancer() {
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIos, setIsIos] = useState(false);

  useEffect(() => {
    let minibarVisible = true;
    const sync = () => {
      document.querySelectorAll("nav button").forEach((button) => {
        if (button.textContent?.toLowerCase().includes("mini bar")) {
          (button as HTMLElement).style.display = minibarVisible ? "" : "none";
        }
      });
    };
    fetch("/api/appearance", { cache: "no-store" }).then((r) => r.json()).then((data) => {
      const tile = data?.configuration?.tiles?.find((item: { id: string }) => item.id === "minibar");
      minibarVisible = tile?.visible !== false;
      sync();
    }).catch(() => undefined);
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { childList: true, subtree: true });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const standalone = window.matchMedia("(display-mode: standalone)").matches || (navigator as Navigator & { standalone?: boolean }).standalone;
    if (standalone || sessionStorage.getItem("the-bedroom-install-dismissed")) return;
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
    setIsIos(ios);
    const timer = window.setTimeout(() => setShowPrompt(true), 1200);
    const onBeforeInstall = (event: Event) => {
      event.preventDefault();
      setInstallEvent(event as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };
    window.addEventListener("beforeinstallprompt", onBeforeInstall);
    return () => { window.clearTimeout(timer); window.removeEventListener("beforeinstallprompt", onBeforeInstall); };
  }, []);

  async function install() {
    if (!installEvent) return;
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === "accepted") setShowPrompt(false);
  }

  function dismiss() {
    sessionStorage.setItem("the-bedroom-install-dismissed", "1");
    setShowPrompt(false);
  }

  if (!showPrompt || (!installEvent && !isIos)) return null;
  return <div className="fixed inset-x-3 bottom-3 z-[100] mx-auto max-w-[520px] rounded-[24px] bg-black p-4 text-white shadow-2xl">
    <button type="button" onClick={dismiss} className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-white/10" aria-label="Fermer"><X size={16} /></button>
    <div className="pr-9"><p className="font-serif text-xl italic">The Bedroom sur votre téléphone</p><p className="mt-1 text-xs leading-relaxed text-white/60">Ajoutez le livret à votre écran d’accueil pour le retrouver comme une application.</p></div>
    {installEvent ? <button type="button" onClick={install} className="mt-4 flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-white text-sm font-black text-black"><Download size={17} />Ajouter à l’écran d’accueil</button> : <div className="mt-4 flex items-center gap-3 rounded-[16px] bg-white/10 p-3 text-xs leading-relaxed"><Share size={20} className="flex-none" />Sur iPhone : touchez <b>Partager</b>, puis <b>Sur l’écran d’accueil</b>.</div>}
  </div>;
}
