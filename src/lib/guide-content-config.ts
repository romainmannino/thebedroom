export type GuideContentMedia = {
  id: string;
  type: "image" | "video" | "pdf";
  url: string;
  name: string;
};

export type GuideContentBlock = {
  id: string;
  title: string;
  content: string;
  badge?: string;
  copyValue?: string;
  mapQuery?: string;
  phone?: string;
  media?: GuideContentMedia[];
};

export type GuideContentSection = {
  id: string;
  script: string;
  title: string;
  description: string;
  blocks: GuideContentBlock[];
};

export type GuideContentConfiguration = Record<string, GuideContentSection>;

export const DEFAULT_GUIDE_CONTENT: GuideContentConfiguration = {
  arrival: {
    id: "arrival", script: "Les horaires", title: "ARRIVÉE & DÉPART", description: "Horaires, accès autonome et consignes de départ.",
    blocks: [
      { id: "arrival-time", title: "Votre arrivée", badge: "À PARTIR DE 15 H", content: "L’arrivée est autonome grâce à la boîte à clés. Vous pouvez arriver à l’heure qui vous convient à partir de 15 h." },
      { id: "departure-time", title: "Votre départ", badge: "AVANT 10 H", content: "Éteignez les lumières, sortez les poubelles, faites la vaisselle, videz le réfrigérateur, déposez le linge utilisé au sol, fermez portes et fenêtres puis remettez les clés dans la boîte." },
    ],
  },
  wifi: {
    id: "wifi", script: "Connexion", title: "LE WI-FI", description: "Réseau et mot de passe du logement.",
    blocks: [
      { id: "wifi-network", title: "Réseau", content: "LIVEBOX-5DD0", copyValue: "LIVEBOX-5DD0" },
      { id: "wifi-password", title: "Mot de passe", content: "THEROOM69330", copyValue: "THEROOM69330" },
    ],
  },
  know: {
    id: "know", script: "Bon", title: "À SAVOIR", description: "Équipements et informations utiles dans le logement.",
    blocks: [
      { id: "tv", title: "Télévision", content: "Les chaînes de la TNT sont accessibles depuis l’application Molotov TV sur l’écran d’accueil." },
      { id: "climate", title: "Chauffage et climatisation", content: "La température est préréglée. Une télécommande permet de l’adapter à votre convenance." },
      { id: "trash", title: "Poubelles", content: "La poubelle ménagère se trouve sous l’évier. Le bac de tri est à l’extérieur du logement." },
      { id: "parking", title: "Stationnement", content: "Places gratuites devant le logement et stationnement possible sur le parking de Carrefour Market." },
      { id: "cleaning", title: "Ménage", content: "Le nécessaire de ménage se trouve dans le placard en face du lit, à côté du chauffe-eau." },
      { id: "hob", title: "Plaque de cuisson", content: "Si elle est verrouillée, maintenez quelques secondes la touche portant le symbole cadenas." },
    ],
  },
  rules: {
    id: "rules", script: "Quelques", title: "RÈGLES", description: "Les règles essentielles à respecter pendant le séjour.",
    blocks: [
      { id: "respect", title: "Respect des lieux", content: "Prenez soin du logement et de ses extérieurs." },
      { id: "animals", title: "Animaux", content: "Les animaux ne sont pas acceptés." },
      { id: "smoking", title: "Non-fumeur", content: "Il est interdit de fumer à l’intérieur." },
      { id: "parties", title: "Fêtes", content: "Pas de fêtes et bruit limité après 22 h." },
      { id: "guests", title: "Voyageurs", content: "Aucun voyageur supplémentaire imprévu." },
      { id: "safety", title: "Sécurité", content: "Respectez les équipements et les consignes de sécurité." },
    ],
  },
  linen: {
    id: "linen", script: "Le", title: "LINGE & ÉQUIPEMENTS", description: "Salle de bain, literie et équipements utiles.",
    blocks: [
      { id: "towels", title: "Serviettes", content: "Elles sont rangées dans le placard sous la vasque. Déposez les serviettes utilisées au sol dans la salle de bain avant votre départ." },
      { id: "bed-linen", title: "Linge de lit", content: "Les lits sont préparés avant votre arrivée. Déposez les draps utilisés au sol dans la salle de bain." },
      { id: "dryer", title: "Sèche-cheveux", content: "Il est disponible dans le meuble vasque de la salle de bain." },
      { id: "washing", title: "Machine à laver", content: "Le logement n’en possède pas. Une laverie libre-service est disponible sur le parking de Carrefour Market, près de la station-service." },
    ],
  },
  restaurants: {
    id: "restaurants", script: "À proximité", title: "RESTAURANTS", description: "Nos bonnes adresses autour du logement.",
    blocks: [
      { id: "grillesia", title: "Le Grillesia · 100 m", content: "Cuisine créative et traditionnelle, viandes maturées et plats traditionnels.", mapQuery: "Le Grillesia Jonage" },
      { id: "saisons", title: "Le Temps des Saisons · 300 m", content: "Cuisine du marché réalisée avec des produits frais et locaux.", mapQuery: "Le Temps des Saisons Jonage" },
      { id: "perlei", title: "Per Lei Jons · 3,2 km", content: "Pizzas, pâtes et salades à déguster sur place, en terrasse ou à emporter.", mapQuery: "Per Lei Jons" },
      { id: "bonvivant", title: "Le Bon Vivant · 4,8 km", content: "Cuisine travaillée à partir de produits frais, locaux et de saison.", mapQuery: "Le Bon Vivant Meyzieu" },
    ],
  },
  activities: {
    id: "activities", script: "À faire, à voir", title: "VISITES", description: "Activités et lieux à découvrir autour de Jonage.",
    blocks: [
      { id: "miribel", title: "Grand Parc Miribel-Jonage · 16 km", content: "Nature, baignade, sports nautiques, promenades, spectacles et détente.", mapQuery: "Grand Parc Miribel Jonage" },
      { id: "tete-or", title: "Parc de la Tête-d’Or · 20 km", content: "Grand parc lyonnais avec espaces verts, zoo, lac, manèges et activités.", mapQuery: "Parc de la Tête d'Or Lyon" },
      { id: "fourviere", title: "Fourvière · 21 km", content: "La basilique et la colline offrent une vue remarquable sur Lyon.", mapQuery: "Basilique Notre Dame de Fourvière" },
      { id: "lyon", title: "Lyon centre et Vieux Lyon · 22 km", content: "Presqu’île, monuments, musées, commerces et quartiers historiques.", mapQuery: "Vieux Lyon" },
      { id: "cremieu", title: "Crémieu · 20 km", content: "Une cité médiévale historique ayant conservé un patrimoine remarquable.", mapQuery: "Crémieu" },
      { id: "perouges", title: "Pérouges · environ 25 km", content: "Village médiéval célèbre pour ses ruelles pavées et son architecture.", mapQuery: "Pérouges" },
    ],
  },
  shops: {
    id: "shops", script: "Les", title: "COMMERCES", description: "Les commerces utiles à proximité.",
    blocks: [
      { id: "groceries", title: "Courses à proximité", content: "Carrefour Market et Lidl permettent de faire les courses à quelques minutes du logement.", mapQuery: "Carrefour Market Jonage" },
      { id: "center", title: "Centre de Jonage", content: "Vous trouverez également les commerces du centre de Jonage à proximité.", mapQuery: "Jonage centre" },
    ],
  },
  malls: {
    id: "malls", script: "Les centres", title: "COMMERCIAUX", description: "Shopping, gastronomie et loisirs.",
    blocks: [
      { id: "bocuse", title: "Halles Paul Bocuse · 15 km", content: "Lieu incontournable pour découvrir et déguster la gastronomie lyonnaise.", mapQuery: "Halles Paul Bocuse Lyon" },
      { id: "part-dieu", title: "Westfield La Part-Dieu · 22 km", content: "L’un des plus grands centres commerciaux d’Europe, avec boutiques et restaurants.", mapQuery: "Westfield La Part-Dieu" },
      { id: "village", title: "The Village Outlet · 31 km", content: "Village de marques à Villefontaine : mode, sport, beauté, restaurants et espace enfants.", mapQuery: "The Village Outlet Villefontaine" },
      { id: "confluence", title: "Confluence · 36 km", content: "Commerces, loisirs, restaurants et architecture contemporaine.", mapQuery: "Centre commercial Confluence Lyon" },
    ],
  },
  interests: {
    id: "interests", script: "Centres d’intérêt", title: "À PROXIMITÉ", description: "Les grands sites proches du logement.",
    blocks: [
      { id: "airport", title: "Aéroport Lyon-Saint-Exupéry · 13,5 km", content: "L’aéroport international de Lyon, situé à Colombier-Saugnieu.", mapQuery: "Aéroport Lyon Saint Exupéry" },
      { id: "eurexpo", title: "Eurexpo Lyon · 19 km", content: "Parc d’exposition accueillant salons, congrès et grands événements.", mapQuery: "Eurexpo Lyon" },
      { id: "stadium", title: "Groupama Stadium · 8 km", content: "Grand stade de Décines accueillant matchs, concerts et événements.", mapQuery: "Groupama Stadium" },
      { id: "arena", title: "LDLC Arena · 8 km", content: "Salle omnisports et de concerts de 16 000 places à Décines.", mapQuery: "LDLC Arena" },
    ],
  },
  transport: {
    id: "transport", script: "Transports en commun", title: "INFORMATIONS", description: "Bus, tramway et déplacements depuis Jonage.",
    blocks: [
      { id: "bus85", title: "Ligne de bus 85", content: "Consultez les horaires TCL pour les arrêts et correspondances depuis Jonage." },
      { id: "bus95", title: "Ligne de bus 95", content: "Ligne desservant le secteur de Jonage et les communes voisines." },
      { id: "z2", title: "Ligne de bus Zi2", content: "Ligne de desserte des zones d’activités de l’Est lyonnais." },
      { id: "t3", title: "Tramway T3", content: "La ligne de tramway la plus proche permet de rejoindre rapidement Lyon et la Part-Dieu." },
    ],
  },
  emergencies: {
    id: "emergencies", script: "Numéros", title: "URGENCES", description: "Numéros utiles, hôpitaux et pharmacies.",
    blocks: [
      { id: "112", title: "Urgences · 112", content: "Numéro d’urgence européen.", phone: "112" },
      { id: "15", title: "SAMU · 15", content: "Urgence médicale.", phone: "15" },
      { id: "17", title: "Police · 17", content: "Police et gendarmerie.", phone: "17" },
      { id: "hopital-est", title: "Hôpital privé de l’Est Lyonnais", content: "140 rue André Lwoff, 69800 Saint-Priest · 04 37 54 40 75", phone: "0437544075", mapQuery: "Hôpital privé de l'Est Lyonnais" },
      { id: "hfme", title: "Hôpital Femme Mère Enfant – HCL", content: "59 boulevard Pinel, 69500 Bron · 0 825 08 25 69", phone: "0825082569", mapQuery: "Hôpital Femme Mère Enfant Bron" },
      { id: "pharma-centre", title: "Pharmacie du Centre", content: "69 rue Nationale, Jonage · 04 78 31 21 74", phone: "0478312174", mapQuery: "Pharmacie du Centre Jonage" },
      { id: "pharma-poste", title: "Pharmacie de la Poste", content: "67 bis rue Nationale, Jonage · 04 72 02 84 09", phone: "0472028409", mapQuery: "Pharmacie de la Poste Jonage" },
    ],
  },
};

export function mergeGuideContent(value: unknown): GuideContentConfiguration {
  const incoming = value && typeof value === "object" ? (value as Partial<GuideContentConfiguration>) : {};
  return Object.fromEntries(
    Object.entries(DEFAULT_GUIDE_CONTENT).map(([key, section]) => {
      const current = incoming[key];
      return [key, current && Array.isArray(current.blocks) ? { ...section, ...current, blocks: current.blocks } : section];
    }),
  );
}
