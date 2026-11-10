export const LOCALES = [
  { code: "en", short: "EN", name: "English" },
  { code: "fr", short: "FR", name: "Français" },
] as const;

export type Locale = (typeof LOCALES)[number]["code"];

export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_STORAGE_KEY = "grts-locale";

const en = {
  navHome: "Home",
  navLive: "Live",
  navPrograms: "TV programs",
  navNews: "News",
  navAbout: "About",
  navLiveTv: "Live TV",
  navRadio: "Radio",
  navShorts: "Shorts",
  search: "Search",
  searchPlaceholder: "Search news, programmes, videos…",
  searchHint: "Type at least 2 characters.",
  searchNone: "No results for this search.",
  searchNews: "News",
  searchProgrammes: "Programmes",
  searchVideos: "Videos",
  searchShorts: "Shorts",
  searchPages: "Pages",
  searchAll: "See all results",
  searchTitle: "Search",
  language: "Language",
  closeMenu: "Close menu",
  openMenu: "Open menu",
  allNews: "All news",
  hideNews: "Hide news categories",
  showNews: "Show news categories",
  broadcast: "Broadcast",
  company: "Company",
  followUs: "Follow us",
  liveTv: "Live TV",
  radioGambia: "Radio Gambia",
  programmes: "Programmes",
  schedules: "Schedules",
  aboutUs: "About Us",
  newsPress: "News & Press",
  careers: "Careers",
  contact: "Contact",
  downloadApps: "Download our apps from",
  rights: "© 2026 GRTS Gambia. All rights reserved.",
  government: "A service of the Government of The Gambia",
  theme: "Theme",
  themeLight: "Light",
  themeDark: "Dark",
  themeSystem: "System",
};

const fr: typeof en = {
  navHome: "Accueil",
  navLive: "Direct",
  navPrograms: "Programmes TV",
  navNews: "Actus",
  navAbout: "À propos",
  navLiveTv: "TV en direct",
  navRadio: "Radio",
  navShorts: "Shorts",
  search: "Recherche",
  searchPlaceholder: "Rechercher actus, programmes, vidéos…",
  searchHint: "Saisissez au moins 2 caractères.",
  searchNone: "Aucun résultat pour cette recherche.",
  searchNews: "Actualités",
  searchProgrammes: "Programmes",
  searchVideos: "Vidéos",
  searchShorts: "Shorts",
  searchPages: "Pages",
  searchAll: "Voir tous les résultats",
  searchTitle: "Recherche",
  language: "Langue",
  closeMenu: "Fermer le menu",
  openMenu: "Ouvrir le menu",
  allNews: "Toutes les actus",
  hideNews: "Masquer les rubriques",
  showNews: "Afficher les rubriques",
  broadcast: "Antenne",
  company: "Institution",
  followUs: "Nous suivre",
  liveTv: "TV en direct",
  radioGambia: "Radio Gambia",
  programmes: "Programmes",
  schedules: "Grille",
  aboutUs: "À propos",
  newsPress: "Actus & presse",
  careers: "Carrières",
  contact: "Contact",
  downloadApps: "Télécharger nos apps",
  rights: "© 2026 GRTS Gambia. Tous droits réservés.",
  government: "Un service du gouvernement de la Gambie",
  theme: "Thème",
  themeLight: "Clair",
  themeDark: "Sombre",
  themeSystem: "Système",
};

export const messages = { en, fr };

export type MessageKey = keyof typeof en;

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "fr";
}
