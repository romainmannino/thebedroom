export type HomeTileSize = "normal" | "large" | "full";

export type HomeTileConfiguration = {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  visible: boolean;
  size: HomeTileSize;
  position: number;
};

export type GuideHomeConfiguration = {
  heroImage: string;
  greeting: string;
  heroTitle: string;
  heroSubtitle: string;
  heroHeight: "small" | "normal" | "large";
  tiles: HomeTileConfiguration[];
};

export const HOME_CONFIG_STORAGE_KEY = "the-bedroom-home-appearance";

export const DEFAULT_HOME_CONFIGURATION: GuideHomeConfiguration = {
  heroImage:
    "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1400&q=88",
  greeting: "Bonjour !",
  heroTitle: "BIENVENUE CHEZ NOUS",
  heroSubtitle:
    "Toutes les informations utiles pour profiter de votre séjour.",
  heroHeight: "normal",
  tiles: [
    { id: "arrival", title: "Arrivée & départ", subtitle: "Horaires et accès", image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=85", visible: true, size: "normal", position: 0 },
    { id: "wifi", title: "Wi-Fi", subtitle: "Se connecter", image: "", visible: true, size: "normal", position: 1 },
    { id: "know", title: "Bon à savoir", subtitle: "Infos du logement", image: "", visible: true, size: "normal", position: 2 },
    { id: "rules", title: "Les règles", subtitle: "Pour votre séjour", image: "", visible: true, size: "normal", position: 3 },
    { id: "linen", title: "Linge & équipements", subtitle: "Salle de bain", image: "", visible: true, size: "normal", position: 4 },
    { id: "restaurants", title: "Restaurants", subtitle: "Nos bonnes adresses", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=85", visible: true, size: "normal", position: 5 },
    { id: "activities", title: "À découvrir", subtitle: "Visites et activités", image: "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=900&q=85", visible: true, size: "large", position: 6 },
    { id: "shops", title: "Commerces", subtitle: "Courses à proximité", image: "", visible: true, size: "normal", position: 7 },
    { id: "malls", title: "Centres commerciaux", subtitle: "Shopping et loisirs", image: "", visible: true, size: "normal", position: 8 },
    { id: "interests", title: "Centres d’intérêt", subtitle: "Les grands sites proches", image: "", visible: true, size: "normal", position: 9 },
    { id: "transport", title: "Transports", subtitle: "Bus et tramway", image: "", visible: true, size: "normal", position: 10 },
    { id: "emergencies", title: "Urgences", subtitle: "Numéros et soins", image: "", visible: true, size: "normal", position: 11 },
  ],
};
