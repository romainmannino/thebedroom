export type MinibarProduct = {
  id: string;
  name: string;
  description: string;
  priceCents: number;
  image: string;
  active: boolean;
  position: number;
  category: string;
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
    { id: "coca-33", name: "Coca 33 cl", description: "Canette fraîche 33 cl", priceCents: 290, image: "", active: true, position: 0, category: "Produits frais · Frigo" },
    { id: "ice-tea-33", name: "Ice Tea 33 cl", description: "Canette fraîche 33 cl", priceCents: 290, image: "", active: true, position: 1, category: "Produits frais · Frigo" },
    { id: "capri-sun", name: "Capri-Sun", description: "Boisson enfant", priceCents: 250, image: "", active: true, position: 2, category: "Produits frais · Frigo" },
    { id: "water-50", name: "Eau 50 cl", description: "Bouteille d’eau fraîche 50 cl", priceCents: 200, image: "", active: true, position: 3, category: "Produits frais · Frigo" },
    { id: "mms-45", name: "M&M's 45 g", description: "Sachet 45 g", priceCents: 350, image: "", active: true, position: 4, category: "Produits frais · Frigo" },
    { id: "popcorn-100", name: "Pop-corn salé 100 g", description: "Sachet 100 g", priceCents: 390, image: "", active: true, position: 5, category: "Produits frais · Frigo" },
    { id: "mini-pringles", name: "Mini Pringles", description: "Format individuel", priceCents: 350, image: "", active: true, position: 6, category: "Produits frais · Frigo" },

    { id: "toothbrush-kit", name: "Kit brosse à dents + dentifrice", description: "Kit de dépannage hygiène", priceCents: 490, image: "", active: true, position: 7, category: "Hygiène" },
    { id: "razor-kit", name: "Rasoir + mini mousse", description: "Kit rasage de dépannage", priceCents: 590, image: "", active: true, position: 8, category: "Hygiène" },
    { id: "mini-deodorant", name: "Mini déodorant", description: "Format voyage", priceCents: 490, image: "", active: true, position: 9, category: "Hygiène" },
    { id: "wipes", name: "Lingettes démaquillantes", description: "Format dépannage", priceCents: 390, image: "", active: true, position: 10, category: "Hygiène" },
    { id: "bandages", name: "Kit pansements", description: "Petit kit de premiers soins", priceCents: 490, image: "", active: true, position: 11, category: "Hygiène" },
    { id: "earplugs", name: "Bouchons d'oreilles", description: "Paire de bouchons d’oreilles", priceCents: 290, image: "", active: true, position: 12, category: "Hygiène" },
    { id: "condoms-3", name: "Préservatifs x3", description: "Boîte de 3", priceCents: 590, image: "", active: true, position: 13, category: "Hygiène" },
    { id: "rain-poncho", name: "Poncho de pluie", description: "Poncho compact de dépannage", priceCents: 590, image: "", active: true, position: 14, category: "Hygiène" },

    { id: "usb-c-charger", name: "Chargeur USB-C complet", description: "Prise + câble USB-C", priceCents: 1490, image: "", active: true, position: 15, category: "Téléphonie & dépannage" },
    { id: "iphone-charger", name: "Chargeur iPhone complet", description: "Prise + câble compatible iPhone", priceCents: 1490, image: "", active: true, position: 16, category: "Téléphonie & dépannage" },
    { id: "aa-4", name: "Piles AA x4", description: "Lot de 4 piles AA", priceCents: 690, image: "", active: true, position: 17, category: "Téléphonie & dépannage" },
    { id: "aaa-4", name: "Piles AAA x4", description: "Lot de 4 piles AAA", priceCents: 690, image: "", active: true, position: 18, category: "Téléphonie & dépannage" },

    { id: "instant-noodles", name: "Nouilles instantanées", description: "Repas de dépannage", priceCents: 390, image: "", active: true, position: 19, category: "Alimentation" },
    { id: "dragibus", name: "Dragibus", description: "Sachet de bonbons Haribo", priceCents: 290, image: "", active: true, position: 20, category: "Alimentation" },
    { id: "smurfs-haribo", name: "Schtroumpfs Haribo", description: "Sachet de bonbons Haribo", priceCents: 290, image: "", active: true, position: 21, category: "Alimentation" },
  ],
};

export function mergeMinibarCatalog(value: unknown): MinibarCatalog {
  if (!value || typeof value !== "object") return DEFAULT_MINIBAR_CATALOG;
  const current = value as Partial<MinibarCatalog>;
  const currentProducts = Array.isArray(current.products) ? current.products : [];
  const currentById = new Map(currentProducts.map((product) => [product.id, product]));

  const products = DEFAULT_MINIBAR_CATALOG.products.map((defaultProduct) => {
    const saved = currentById.get(defaultProduct.id);
    return {
      ...defaultProduct,
      ...(saved ?? {}),
      category: typeof saved?.category === "string" && saved.category ? saved.category : defaultProduct.category,
    };
  });

  const legacyDefaultIds = new Set(["water", "soda", "snack", "toothbrush", "razor", "deodorant"]);
  const extraProducts = currentProducts
    .filter((product) => !DEFAULT_MINIBAR_CATALOG.products.some((item) => item.id === product.id))
    .filter((product) => !legacyDefaultIds.has(product.id))
    .map((product, index) => ({
      id: typeof product.id === "string" ? product.id : `product-extra-${index}`,
      name: typeof product.name === "string" ? product.name : "Article",
      description: typeof product.description === "string" ? product.description : "",
      priceCents: typeof product.priceCents === "number" ? product.priceCents : 0,
      image: typeof product.image === "string" ? product.image : "",
      active: product.active !== false,
      position: typeof product.position === "number" ? product.position : DEFAULT_MINIBAR_CATALOG.products.length + index,
      category: typeof product.category === "string" && product.category ? product.category : "Autres",
    }));

  return {
    ...DEFAULT_MINIBAR_CATALOG,
    ...current,
    products: [...products, ...extraProducts].map((product, index) => ({ ...product, position: index })),
  };
}
