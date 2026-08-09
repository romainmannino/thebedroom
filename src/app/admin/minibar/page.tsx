"use client";

import { ArrowDown, ArrowLeft, ArrowUp, Eye, Home, Loader2, Plus, Save, ShoppingBasket, Trash2, Upload } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DEFAULT_MINIBAR_CATALOG, type MinibarCatalog, type MinibarProduct } from "@/lib/minibar-config";

export default function AdminMinibarPage() {
  const [catalog, setCatalog] = useState<MinibarCatalog>(DEFAULT_MINIBAR_CATALOG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/minibar", { cache: "no-store" })
      .then((r) => r.json())
      .then((data) => { if (data.success) setCatalog(data.catalog); })
      .finally(() => setLoading(false));
  }, []);

  const orderedProducts = useMemo(
    () => [...catalog.products].sort((a, b) => a.position - b.position),
    [catalog.products],
  );

  function updateProduct(id: string, updates: Partial<MinibarProduct>) {
    setCatalog((prev) => ({ ...prev, products: prev.products.map((p) => p.id === id ? { ...p, ...updates } : p) }));
  }

  function normalizePositions(products: MinibarProduct[]) {
    return products.map((product, index) => ({ ...product, position: index }));
  }

  function moveProduct(id: string, direction: -1 | 1) {
    setCatalog((prev) => {
      const products = [...prev.products].sort((a, b) => a.position - b.position);
      const index = products.findIndex((product) => product.id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= products.length) return prev;
      [products[index], products[target]] = [products[target], products[index]];
      return { ...prev, products: normalizePositions(products) };
    });
  }

  function removeProduct(id: string) {
    setCatalog((prev) => ({
      ...prev,
      products: normalizePositions(
        prev.products.filter((product) => product.id !== id).sort((a, b) => a.position - b.position),
      ),
    }));
  }

  function addProduct() {
    const id = `product-${Date.now()}`;
    setCatalog((prev) => ({
      ...prev,
      products: [...prev.products, { id, name: "Nouvel article", description: "Description", priceCents: 300, image: "", active: true, position: prev.products.length, category: "Autres" }],
    }));
  }

  async function uploadImage(productId: string, file: File) {
    setUploading(productId);
    const form = new FormData();
    form.append("file", file);
    try {
      const response = await fetch("/api/media/upload", { method: "POST", body: form });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Import impossible");
      updateProduct(productId, { image: data.url });
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Import impossible");
    } finally {
      setUploading(null);
    }
  }

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      const normalizedCatalog = { ...catalog, products: normalizePositions(orderedProducts) };
      const response = await fetch("/api/minibar", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ catalog: normalizedCatalog }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Enregistrement impossible");
      setCatalog(data.catalog);
      setMessage("Catalogue enregistré et publié");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Enregistrement impossible");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <main className="grid min-h-screen place-items-center bg-[#e7dfd4] font-bold">Chargement…</main>;

  return <main className="min-h-screen bg-[#e7dfd4] p-3 sm:p-5">
    <div className="mx-auto max-w-[1100px] overflow-hidden rounded-[28px] bg-[#faf8f4] shadow-xl">
      <header className="flex items-center justify-between border-b border-black/5 px-4 py-4 sm:px-7">
        <div className="flex items-center gap-3"><Link href="/admin/livret" className="grid h-10 w-10 place-items-center rounded-full bg-[#eee3d3]"><ArrowLeft size={18}/></Link><div><p className="text-[9px] font-black tracking-[0.22em] text-black/40">THE BEDROOM</p><h1 className="text-lg font-black">Mini bar / Boutique</h1></div></div>
        <div className="flex gap-2"><Link href="/boutique" target="_blank" className="flex h-10 items-center gap-2 rounded-full bg-[#eee3d3] px-4 text-xs font-black"><Eye size={16}/>Aperçu</Link><Link href="/admin" className="grid h-10 w-10 place-items-center rounded-full bg-black text-white"><Home size={18}/></Link></div>
      </header>

      <section className="p-4 sm:p-7">
        <div className="rounded-[28px] bg-black p-6 text-white sm:p-8"><div className="flex items-center gap-3"><span className="grid h-12 w-12 place-items-center rounded-full bg-white text-black"><ShoppingBasket size={22}/></span><div><p className="font-serif text-2xl italic">Votre mini bar</p><h2 className="text-3xl font-black tracking-[-0.05em]">CONFIGURER LA BOUTIQUE</h2></div></div><p className="mt-4 max-w-2xl text-sm text-white/60">Ajoutez, supprimez et réorganisez les produits. L’ordre ci-dessous est exactement celui affiché aux voyageurs et dans le livret PDF.</p></div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <Field label="Titre" value={catalog.title} onChange={(value) => setCatalog({ ...catalog, title: value })}/>
          <Field label="Sous-titre" value={catalog.subtitle} onChange={(value) => setCatalog({ ...catalog, subtitle: value })}/>
        </div>
        <label className="mt-4 block"><span className="mb-2 block text-xs font-black">Message d’explication</span><textarea rows={3} value={catalog.instructions} onChange={(e) => setCatalog({ ...catalog, instructions: e.target.value })} className="w-full rounded-[18px] border border-black/10 bg-white px-4 py-3 text-sm outline-none"/></label>

        <div className="mt-7 grid gap-4 md:grid-cols-2">
          {orderedProducts.map((product, index) => <article key={product.id} className="overflow-hidden rounded-[24px] bg-white shadow-sm">
            <div className="relative h-44 bg-[#eee3d3]">{product.image ? <img src={product.image} alt="" className="h-full w-full object-cover"/> : <div className="grid h-full place-items-center px-4 text-center text-sm font-black text-black/35">AJOUTER LA PHOTO DE L’ARTICLE</div>}<label className="absolute bottom-3 right-3 flex cursor-pointer items-center gap-2 rounded-full bg-black px-4 py-2 text-xs font-black text-white">{uploading===product.id ? <Loader2 size={15} className="animate-spin"/> : <Upload size={15}/>}Photo<input type="file" accept="image/*" className="hidden" onChange={(e)=>{const f=e.target.files?.[0];if(f) uploadImage(product.id,f);e.currentTarget.value="";}}/></label></div>
            <div className="grid gap-3 p-4">
              <div className="flex items-center justify-between gap-3 rounded-[16px] bg-[#faf8f4] p-2">
                <span className="pl-2 text-xs font-black text-black/45">Position {index + 1}</span>
                <div className="flex gap-1">
                  <button type="button" disabled={index === 0} onClick={() => moveProduct(product.id, -1)} className="grid h-9 w-9 place-items-center rounded-full bg-white shadow-sm disabled:opacity-25" aria-label="Monter"><ArrowUp size={16}/></button>
                  <button type="button" disabled={index === orderedProducts.length - 1} onClick={() => moveProduct(product.id, 1)} className="grid h-9 w-9 place-items-center rounded-full bg-white shadow-sm disabled:opacity-25" aria-label="Descendre"><ArrowDown size={16}/></button>
                </div>
              </div>
              <div className="rounded-full bg-[#eee3d3] px-3 py-2 text-[10px] font-black uppercase tracking-[0.08em] text-black/55">{product.category}</div>
              <Field label="Nom" value={product.name} onChange={(value)=>updateProduct(product.id,{name:value})}/>
              <Field label="Description" value={product.description} onChange={(value)=>updateProduct(product.id,{description:value})}/>
              <Field label="Catégorie" value={product.category} onChange={(value)=>updateProduct(product.id,{category:value || "Autres"})}/>
              <div className="grid grid-cols-2 gap-3"><label><span className="mb-2 block text-xs font-black">Prix (€)</span><input type="number" min="0" step="0.1" value={(product.priceCents/100).toFixed(2)} onChange={(e)=>updateProduct(product.id,{priceCents:Math.max(0,Math.round(Number(e.target.value)*100))})} className="min-h-12 w-full rounded-[17px] border border-black/10 bg-[#faf8f4] px-4"/></label><label className="flex items-end"><span className="flex min-h-12 w-full items-center gap-2 rounded-[17px] bg-[#faf8f4] px-4 text-sm font-bold"><input type="checkbox" checked={product.active} onChange={(e)=>updateProduct(product.id,{active:e.target.checked})}/> Disponible</span></label></div>
              <button type="button" onClick={()=>removeProduct(product.id)} className="flex min-h-10 items-center justify-center gap-2 rounded-full bg-red-50 text-xs font-black text-red-600"><Trash2 size={15}/>Supprimer définitivement</button>
            </div>
          </article>)}
        </div>

        {message && <p className="mt-5 rounded-[18px] bg-[#eee3d3] px-4 py-3 text-sm font-bold">{message}</p>}
        <div className="sticky bottom-3 mt-6 grid gap-3 rounded-[24px] bg-[#faf8f4]/95 p-3 shadow-xl backdrop-blur sm:grid-cols-2"><button type="button" onClick={addProduct} className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#eee3d3] font-black"><Plus size={18}/>Ajouter un article</button><button type="button" onClick={save} disabled={saving} className="flex min-h-12 items-center justify-center gap-2 rounded-full bg-black font-black text-white"><Save size={18}/>{saving?"Enregistrement…":"Enregistrer et publier"}</button></div>
      </section>
    </div>
  </main>;
}

function Field({label,value,onChange}:{label:string;value:string;onChange:(value:string)=>void}){return <label><span className="mb-2 block text-xs font-black">{label}</span><input value={value} onChange={(e)=>onChange(e.target.value)} className="min-h-12 w-full rounded-[17px] border border-black/10 bg-white px-4 text-sm outline-none"/></label>}
