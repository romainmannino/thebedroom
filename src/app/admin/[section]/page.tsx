"use client";

import {
  ArrowLeft,
  Check,
  ChevronDown,
  ChevronUp,
  Eye,
  FileText,
  Home,
  Image as ImageIcon,
  Loader2,
  Plus,
  Save,
  Trash2,
  Upload,
  Video,
} from "lucide-react";
import Link from "next/link";
import { use, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_GUIDE_CONTENT,
  mergeGuideContent,
  type GuideContentBlock,
  type GuideContentConfiguration,
  type GuideContentMedia,
} from "@/lib/guide-content-config";

type Props = { params: Promise<{ section: string }> };

const aliases: Record<string, string> = {
  parametres: "arrival",
  "bon-a-savoir": "know",
  regles: "rules",
  linge: "linen",
  restaurants: "restaurants",
  activites: "activities",
  commerces: "shops",
  "centres-commerciaux": "malls",
  "centres-interet": "interests",
  transports: "transport",
  urgences: "emergencies",
  arrival: "arrival",
  wifi: "wifi",
};

function mediaType(file: File): GuideContentMedia["type"] {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  return "pdf";
}

export default function AdminSectionPage({ params }: Props) {
  const { section } = use(params);
  const sectionId = aliases[section] ?? section;
  const fallback = DEFAULT_GUIDE_CONTENT[sectionId] ?? DEFAULT_GUIDE_CONTENT.know;
  const [allContent, setAllContent] = useState<GuideContentConfiguration>(DEFAULT_GUIDE_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingBlock, setUploadingBlock] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    async function load() {
      try {
        const response = await fetch("/api/guide-content", { cache: "no-store" });
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.error || "Chargement impossible");
        if (!cancelled) setAllContent(mergeGuideContent(result.content));
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Chargement impossible");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [sectionId]);

  const current = useMemo(
    () => allContent[sectionId] ?? fallback,
    [allContent, fallback, sectionId],
  );

  function updateBlock(id: string, updates: Partial<GuideContentBlock>) {
    setAllContent((previous) => {
      const source = previous[sectionId] ?? fallback;
      return {
        ...previous,
        [sectionId]: {
          ...source,
          blocks: source.blocks.map((block) => block.id === id ? { ...block, ...updates } : block),
        },
      };
    });
  }

  function addBlock() {
    const id = `block-${Date.now()}`;
    setAllContent((previous) => {
      const source = previous[sectionId] ?? fallback;
      return {
        ...previous,
        [sectionId]: {
          ...source,
          blocks: [...source.blocks, { id, title: "Nouvelle information", content: "Texte à compléter.", media: [] }],
        },
      };
    });
  }

  function deleteBlock(id: string) {
    if (!window.confirm("Supprimer ce bloc ?")) return;
    setAllContent((previous) => {
      const source = previous[sectionId] ?? fallback;
      return {
        ...previous,
        [sectionId]: { ...source, blocks: source.blocks.filter((block) => block.id !== id) },
      };
    });
  }

  function moveBlock(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= current.blocks.length) return;
    const next = [...current.blocks];
    [next[index], next[target]] = [next[target], next[index]];
    setAllContent((previous) => ({
      ...previous,
      [sectionId]: { ...(previous[sectionId] ?? fallback), blocks: next },
    }));
  }

  async function uploadMedia(blockId: string, file: File) {
    setUploadingBlock(blockId);
    setError("");
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch("/api/media/upload", { method: "POST", body: formData });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || "Import impossible");
      const block = current.blocks.find((item) => item.id === blockId);
      const media: GuideContentMedia = {
        id: `media-${Date.now()}`,
        type: mediaType(file),
        url: result.url,
        name: result.fileName || file.name,
      };
      updateBlock(blockId, { media: [...(block?.media ?? []), media] });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import impossible");
    } finally {
      setUploadingBlock(null);
    }
  }

  function removeMedia(blockId: string, mediaId: string) {
    const block = current.blocks.find((item) => item.id === blockId);
    updateBlock(blockId, { media: (block?.media ?? []).filter((item) => item.id !== mediaId) });
  }

  async function save() {
    setSaving(true);
    setError("");
    try {
      const response = await fetch("/api/guide-content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: allContent }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || "Enregistrement impossible");
      setAllContent(mergeGuideContent(result.content));
      setSaved(true);
      window.setTimeout(() => setSaved(false), 1800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Enregistrement impossible");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <main className="grid min-h-screen place-items-center bg-[#e7dfd4] text-sm font-bold">Chargement…</main>;

  return (
    <main key={sectionId} className="min-h-screen bg-[#e7dfd4] p-3 sm:p-5">
      <div className="mx-auto max-w-[1000px] overflow-hidden rounded-[28px] bg-[#faf8f4] shadow-xl">
        <header className="flex items-center justify-between border-b border-black/5 px-4 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <Link href="/admin/livret" className="grid h-10 w-10 place-items-center rounded-full bg-[#eee3d3]"><ArrowLeft size={18} /></Link>
            <div><p className="text-[9px] font-black tracking-[0.22em] text-black/40">THE BEDROOM</p><h1 className="text-lg font-black">Modifier le contenu</h1></div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/" target="_blank" className="flex h-10 items-center gap-2 rounded-full bg-[#eee3d3] px-4 text-xs font-black"><Eye size={16} />Aperçu</Link>
            <Link href="/admin" className="grid h-10 w-10 place-items-center rounded-full bg-black text-white"><Home size={18} /></Link>
          </div>
        </header>

        <section className="p-4 sm:p-7">
          <div className="rounded-[28px] bg-black p-6 text-white">
            <p className="font-serif text-3xl italic">{current.script}</p>
            <h2 className="mt-1 text-4xl font-black leading-[0.92] tracking-[-0.05em]">{current.title}</h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-white/60">{current.description}</p>
          </div>

          {error && <div className="mt-4 rounded-[18px] bg-red-100 px-4 py-3 text-sm font-bold text-red-800">{error}</div>}
          {saved && <div className="mt-4 flex items-center gap-2 rounded-[18px] bg-[#dcebdd] px-4 py-3 text-sm font-black"><Check size={17} />Contenu enregistré et publié</div>}

          <div className="mt-6 space-y-4">
            {current.blocks.map((block, index) => (
              <article key={block.id} className="rounded-[24px] bg-white p-4 shadow-sm sm:p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <strong>Bloc {index + 1}</strong>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => moveBlock(index, -1)} disabled={index === 0} className="grid h-9 w-9 place-items-center rounded-full bg-[#eee3d3] disabled:opacity-30"><ChevronUp size={17} /></button>
                    <button type="button" onClick={() => moveBlock(index, 1)} disabled={index === current.blocks.length - 1} className="grid h-9 w-9 place-items-center rounded-full bg-[#eee3d3] disabled:opacity-30"><ChevronDown size={17} /></button>
                    <button type="button" onClick={() => deleteBlock(block.id)} className="grid h-9 w-9 place-items-center rounded-full bg-red-50 text-red-600"><Trash2 size={16} /></button>
                  </div>
                </div>

                <div className="grid gap-4">
                  <Field label="Titre" value={block.title} onChange={(value) => updateBlock(block.id, { title: value })} />
                  <Field label="Badge facultatif" value={block.badge ?? ""} onChange={(value) => updateBlock(block.id, { badge: value || undefined })} placeholder="Ex. AVANT 10 H" />
                  <label><span className="mb-2 block text-xs font-black">Texte affiché dans le livret</span><textarea rows={5} value={block.content} onChange={(event) => updateBlock(block.id, { content: event.target.value })} className="w-full resize-y rounded-[17px] border border-black/10 bg-[#faf8f4] px-4 py-3 text-sm outline-none focus:border-black" /></label>

                  <div className="rounded-[20px] border border-dashed border-black/15 bg-[#faf8f4] p-4">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div><p className="text-sm font-black">Illustrations</p><p className="mt-1 text-xs text-black/45">Ajoutez une photo, une vidéo ou un PDF à ce bloc.</p></div>
                      <label className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-full bg-black px-4 text-xs font-black text-white">
                        {uploadingBlock === block.id ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                        {uploadingBlock === block.id ? "Import…" : "Ajouter un fichier"}
                        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,application/pdf" className="hidden" disabled={uploadingBlock !== null} onChange={(event) => { const file = event.target.files?.[0]; if (file) uploadMedia(block.id, file); event.currentTarget.value = ""; }} />
                      </label>
                    </div>

                    {(block.media?.length ?? 0) > 0 && (
                      <div className="mt-4 grid gap-3 sm:grid-cols-2">
                        {block.media!.map((media) => (
                          <div key={media.id} className="overflow-hidden rounded-[16px] bg-white shadow-sm">
                            {media.type === "image" && <img src={media.url} alt={media.name} className="h-36 w-full object-cover" />}
                            {media.type === "video" && <video src={media.url} controls className="h-36 w-full bg-black object-contain" />}
                            {media.type === "pdf" && <a href={media.url} target="_blank" className="flex h-36 flex-col items-center justify-center gap-2 bg-[#eee3d3]"><FileText size={28} /><span className="px-3 text-center text-xs font-black">Ouvrir le PDF</span></a>}
                            <div className="flex items-center justify-between gap-3 p-3">
                              <div className="flex min-w-0 items-center gap-2">{media.type === "image" ? <ImageIcon size={16} /> : media.type === "video" ? <Video size={16} /> : <FileText size={16} />}<span className="truncate text-xs font-bold">{media.name}</span></div>
                              <button type="button" onClick={() => removeMedia(block.id, media.id)} className="grid h-8 w-8 flex-none place-items-center rounded-full bg-red-50 text-red-600"><Trash2 size={14} /></button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Valeur à copier (facultatif)" value={block.copyValue ?? ""} onChange={(value) => updateBlock(block.id, { copyValue: value || undefined })} />
                    <Field label="Recherche Google Maps (facultatif)" value={block.mapQuery ?? ""} onChange={(value) => updateBlock(block.id, { mapQuery: value || undefined })} />
                  </div>
                  <Field label="Numéro à appeler (facultatif)" value={block.phone ?? ""} onChange={(value) => updateBlock(block.id, { phone: value || undefined })} />
                </div>
              </article>
            ))}
          </div>

          <div className="sticky bottom-3 mt-6 grid gap-3 rounded-[24px] bg-[#faf8f4]/95 p-3 shadow-xl backdrop-blur sm:grid-cols-2">
            <button type="button" onClick={addBlock} className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#eee3d3] text-sm font-black"><Plus size={18} />Ajouter un bloc</button>
            <button type="button" onClick={save} disabled={saving} className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-black text-sm font-black text-white disabled:opacity-50"><Save size={18} />{saving ? "Enregistrement…" : "Enregistrer et publier"}</button>
          </div>
        </section>
      </div>
    </main>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder?: string }) {
  return <label><span className="mb-2 block text-xs font-black">{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="min-h-12 w-full rounded-[17px] border border-black/10 bg-[#faf8f4] px-4 text-sm outline-none focus:border-black" /></label>;
}
