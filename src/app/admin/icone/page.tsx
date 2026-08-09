"use client";

import { ArrowLeft, Check, Image as ImageIcon, Upload } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { DEFAULT_HOME_CONFIGURATION, type GuideHomeConfiguration } from "@/lib/guide-home-config";

export default function IconePage() {
  const [configuration, setConfiguration] = useState<GuideHomeConfiguration>(DEFAULT_HOME_CONFIGURATION);
  const [saved, setSaved] = useState(false);
  useEffect(() => { fetch("/api/appearance", { cache: "no-store" }).then(r => r.json()).then(r => r.success && setConfiguration(r.configuration)); }, []);

  async function upload(file?: File) {
    if (!file) return;
    const form = new FormData(); form.append("file", file);
    const response = await fetch("/api/media/upload", { method: "POST", body: form });
    const result = await response.json();
    if (!response.ok || !result.success) return window.alert(result.error ?? "Import impossible");
    setConfiguration(current => ({ ...current, appIcon: result.url }));
  }

  async function save() {
    const response = await fetch("/api/appearance", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ configuration }) });
    const result = await response.json();
    if (!response.ok || !result.success) return window.alert(result.error ?? "Enregistrement impossible");
    setSaved(true); window.setTimeout(() => setSaved(false), 1800);
  }

  return <main className="min-h-screen bg-[#e7dfd4] p-3 sm:p-5"><div className="mx-auto max-w-[760px] rounded-[26px] bg-[#faf8f4] p-5 shadow-xl sm:p-8">
    <Link href="/admin" className="inline-flex items-center gap-2 text-sm font-black"><ArrowLeft size={18}/>Administration</Link>
    <div className="mt-8"><p className="font-serif text-3xl italic">Identité de l’app</p><h1 className="text-4xl font-black tracking-[-0.05em]">LOGO & ICÔNE</h1><p className="mt-3 text-sm text-black/50">Importez le logo carré The Bedroom. Il servira d’icône dans l’onglet du navigateur et pour le raccourci installé sur le téléphone.</p></div>
    <section className="mt-7 rounded-[25px] bg-white p-5 shadow-sm">
      <div className="flex items-center gap-4"><div className="grid h-20 w-20 flex-none place-items-center overflow-hidden rounded-[20px] bg-[#eee3d3]">{configuration.appIcon ? <img src={configuration.appIcon} alt="Logo The Bedroom" className="h-full w-full object-cover"/> : <ImageIcon size={28}/>}</div><div><p className="font-black">Icône The Bedroom</p><p className="mt-1 text-xs text-black/45">Idéal : image carrée PNG ou JPG, au moins 512 × 512 px.</p></div></div>
      <label className="mt-5 flex min-h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#eee3d3] text-sm font-black"><Upload size={17}/>Importer le logo<input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={e => upload(e.target.files?.[0])}/></label>
      <button type="button" onClick={save} className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-black text-sm font-black text-white">{saved ? <><Check size={17}/>Enregistré</> : "Enregistrer l’icône"}</button>
    </section>
  </div></main>;
}
