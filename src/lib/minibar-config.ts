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
  version: number;
  title: string;
  subtitle: string;
  instructions: string;
  products: MinibarProduct[];
};

export const MINIBAR_CATALOG_VERSION = 3;

const CATEGORY_BY_ID: Record<string, string> = {
  "coca-33": "Boissons",
  "ice-tea-33": "Boissons",
  "capri-sun": "Boissons",
  "water-50": "Boissons",
  "mms-45": "Alimentation",
  "popcorn-100": "Alimentation",
  "mini-pringles": "Alimentation",
  "instant-noodles": "Alimentation",
  dragibus: "Alimentation",
  "smurfs-haribo": "Alimentation",
  "toothbrush-kit": "Hygiène",
  "razor-kit": "Hygiène",
  "mini-deodorant": "Hygiène",
  wipes: "Hygiène",
  bandages: "Hygiène",
  earplugs: "Hygiène",
  "condoms-3": "Hygiène",
  "rain-poncho": "Dépannage",
  "usb-c-charger": "Dépannage",
  "iphone-charger": "Dépannage",
  "aa-4": "Dépannage",
  "aaa-4": "Dépannage",
};

export const DEFAULT_MINIBAR_CATALOG: MinibarCatalog = {
  version: MINIBAR_CATALOG_VERSION,
  title: "MINI BAR & BOUTIQUE",
  subtitle: "Un petit oubli ou une petite faim ?",
  instructions: "Choisissez vos articles, réglez en ligne puis servez-vous directement dans le mini bar du logement.",
  products: [
    { id: "coca-33", name: "Coca 33 cl", description: "Canette fraîche 33 cl", priceCents: 290, image: "", active: true, position: 0, category: "Boissons" },
    { id: "ice-tea-33", name: "Ice Tea 33 cl", description: "Canette fraîche 33 cl", priceCents: 290, image: "", active: true, position: 1, category: "Boissons" },
    { id: "capri-sun", name: "Capri-Sun", description: "Boisson enfant", priceCents: 250, image: "", active: true, position: 2, category: "Boissons" },
    { id: "water-50", name: "Eau 50 cl", description: "Bouteille d’eau fraîche 50 cl", priceCents: 200, image: "", active: true, position: 3, category: "Boissons" },
    { id: "mms-45", name: "M&M's 45 g", description: "Sachet 45 g", priceCents: 350, image: "", active: true, position: 4, category: "Alimentation" },
    { id: "popcorn-100", name: "Pop-corn salé 100 g", description: "Sachet 100 g", priceCents: 390, image: "", active: true, position: 5, category: "Alimentation" },
    { id: "mini-pringles", name: "Mini Pringles", description: "Format individuel", priceCents: 350, image: "", active: true, position: 6, category: "Alimentation" },
    { id: "instant-noodles", name: "Nouilles instantanées", description: "Repas de dépannage", priceCents: 390, image: "", active: true, position: 7, category: "Alimentation" },
    { id: "dragibus", name: "Dragibus", description: "Sachet de bonbons Haribo", priceCents: 290, image: "", active: true, position: 8, category: "Alimentation" },
    { id: "smurfs-haribo", name: "Schtroumpfs Haribo", description: "Sachet de bonbons Haribo", priceCents: 290, image: "", active: true, position: 9, category: "Alimentation" },
    { id: "toothbrush-kit", name: "Kit brosse à dents + dentifrice", description: "Kit de dépannage hygiène", priceCents: 490, image: "", active: true, position: 10, category: "Hygiène" },
    { id: "razor-kit", name: "Rasoir + mini mousse", description: "Kit rasage de dépannage", priceCents: 590, image: "", active: true, position: 11, category: "Hygiène" },
    { id: "mini-deodorant", name: "Mini déodorant", description: "Format voyage", priceCents: 490, image: "", active: true, position: 12, category: "Hygiène" },
    { id: "wipes", name: "Lingettes démaquillantes", description: "Format dépannage", priceCents: 390, image: "", active: true, position: 13, category: "Hygiène" },
    { id: "bandages", name: "Kit pansements", description: "Petit kit de premiers soins", priceCents: 490, image: "", active: true, position: 14, category: "Hygiène" },
    { id: "earplugs", name: "Bouchons d'oreilles", description: "Paire de bouchons d’oreilles", priceCents: 290, image: "", active: true, position: 15, category: "Hygiène" },
    { id: "condoms-3", name: "Préservatifs x3", description: "Boîte de 3", priceCents: 590, image: "", active: true, position: 16, category: "Hygiène" },
    { id: "rain-poncho", name: "Poncho de pluie", description: "Poncho compact de dépannage", priceCents: 590, image: "", active: true, position: 17, category: "Dépannage" },
    { id: "usb-c-charger", name: "Chargeur USB-C complet", description: "Prise + câble USB-C", priceCents: 1490, image: "", active: true, position: 18, category: "Dépannage" },
    { id: "iphone-charger", name: "Chargeur iPhone complet", description: "Prise + câble compatible iPhone", priceCents: 1490, image: "", active: true, position: 19, category: "Dépannage" },
    { id: "aa-4", name: "Piles AA x4", description: "Lot de 4 piles AA", priceCents: 690, image: "", active: true, position: 20, category: "Dépannage" },
    { id: "aaa-4", name: "Piles AAA x4", description: "Lot de 4 piles AAA", priceCents: 690, image: "", active: true, position: 21, category: "Dépannage" },
  ],
};

function normalizeProduct(product: Partial<MinibarProduct>, index: number): MinibarProduct {
  const id = typeof product.id === "string" && product.id ? product.id : `product-${index}`;
  return {
    id,
    name: typeof product.name === "string" ? product.name : "Article",
    description: typeof product.description === "string" ? product.description : "",
    priceCents: typeof product.priceCents === "number" ? product.priceCents : 0,
    image: typeof product.image === "string" ? product.image : "",
    active: product.active !== false,
    position: index,
    category: CATEGORY_BY_ID[id] ?? (typeof product.category === "string" && product.category ? product.category : "Dépannage"),
  };
}

export function mergeMinibarCatalog(value: unknown): MinibarCatalog {
  if (!value || typeof value !== "object") return DEFAULT_MINIBAR_CATALOG;
  const current = value as Partial<MinibarCatalog>;
  const currentProducts = Array.isArray(current.products) ? current.products : null;

  // À partir de la version 2, la liste enregistrée est déjà la source de vérité :
  // on ne réinjecte jamais un article supprimé. La migration v3 ne fait que ranger
  // les produits existants dans les quatre catégories de la boutique.
  if ((current.version === 2 || current.version === MINIBAR_CATALOG_VERSION) && currentProducts) {
    return {
      version: MINIBAR_CATALOG_VERSION,
      title: typeof current.title === "string" ? current.title : DEFAULT_MINIBAR_CATALOG.title,
      subtitle: typeof current.subtitle === "string" ? current.subtitle : DEFAULT_MINIBAR_CATALOG.subtitle,
      instructions: typeof current.instructions === "string" ? current.instructions : DEFAULT_MINIBAR_CATALOG.instructions,
      products: [...currentProducts]
        .sort((a, b) => (a.position ?? 0) - (b.position ?? 0))
        .map((product, index) => normalizeProduct(product, index)),
    };
  }

  const legacyProducts = currentProducts ?? [];
  const legacyById = new Map(legacyProducts.map((product) => [product.id, product]));
  const legacyDefaultIds = new Set(["water", "soda", "snack", "toothbrush", "razor", "deodorant"]);
  const migratedDefaults = DEFAULT_MINIBAR_CATALOG.products.map((defaultProduct) => {
    const saved = legacyById.get(defaultProduct.id);
    return normalizeProduct({ ...defaultProduct, ...(saved ?? {}) }, defaultProduct.position);
  });
  const extras = legacyProducts
    .filter((product) => !DEFAULT_MINIBAR_CATALOG.products.some((item) => item.id === product.id))
    .filter((product) => !legacyDefaultIds.has(product.id));

  return {
    version: MINIBAR_CATALOG_VERSION,
    title: typeof current.title === "string" ? current.title : DEFAULT_MINIBAR_CATALOG.title,
    subtitle: typeof current.subtitle === "string" ? current.subtitle : DEFAULT_MINIBAR_CATALOG.subtitle,
    instructions: typeof current.instructions === "string" ? current.instructions : DEFAULT_MINIBAR_CATALOG.instructions,
    products: [...migratedDefaults, ...extras].map((product, index) => normalizeProduct(product, index)),
  };
}
