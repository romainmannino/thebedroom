export type MinibarProduct = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  image: string;
  active: boolean;
  position: number;
};

export type MinibarCatalog = {
  title: string;
  subtitle: string;
  instructions: string;
  products: MinibarProduct[];
};

export const DEFAULT_MINIBAR_CATALOG: MinibarCatalog = {
  title: "MINI BAR & BOUTIQUE",
  subtitle: "Un petit oubli ou une petite faim ?",
  instructions: "Choisissez vos articles, réglez en ligne puis servez-vous directement dans le mini bar du logement.",
  products: [
    { id: "water", name: "Bouteille d’eau", description: "Eau fraîche 50 cl", priceCents: 200, image: "", active: true, position: 0 },
    { id: "soda", name: "Soda", description: "Canette fraîche 33 cl", priceCents: 300, image: "", active: true, position: 1 },
    { id: "snack", name: "Snack sucré", description: "Barre chocolatée ou biscuit", priceCents: 250, image: "", active: true, position: 2 },
    { id: "toothbrush", name: "Kit brosse à dents", description: "Brosse à dents + mini dentifrice", priceCents: 400, image: "", active: true, position: 3 },
    { id: "razor", name: "Kit rasage", description: "Rasoir + mini mousse", priceCents: 500, image: "", active: true, position: 4 },
    { id: "deodorant", name: "Déodorant voyage", description: "Format dépannage", priceCents: 400, image: "", active: true, position: 5 },
  ],
};

export function mergeMinibarCatalog(value: unknown): MinibarCatalog {
  if (!value || typeof value !== "object") return DEFAULT_MINIBAR_CATALOG;
  const current = value as Partial<MinibarCatalog>;
  const products = Array.isArray(current.products) ? current.products : DEFAULT_MINIBAR_CATALOG.products;
  return {
    ...DEFAULT_MINIBAR_CATALOG,
    ...current,
    products: products.map((product, index) => ({
      id: typeof product.id === "string" ? product.id : `product-${index}`,
      name: typeof product.name === "string" ? product.name : "Article",
      description: typeof product.description === "string" ? product.description : "",
      priceCents: typeof product.priceCents === "number" ? product.priceCents : 0,
      image: typeof product.image === "string" ? product.image : "",
      active: product.active !== false,
      position: typeof product.position === "number" ? product.position : index,
    })),
  };
}
