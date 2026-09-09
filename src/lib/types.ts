export type ChromeTheme = "dark" | "light";

export type CategorySlug = string;

export type ArticleSection = {
  heading?: string;
  paragraphs: string[];
};

export type Article = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: CategorySlug;
  categoryLabel: string;
  date: string;
  readTime?: string;
  image: string;
  href: string;
  author?: string;
  authorImage?: string;
  caption?: string;
  lead?: string;
  sections?: ArticleSection[];
  tags?: string[];
  contentHtml?: string;
};

export type VideoItem = {
  id: string;
  title: string;
  image: string;
  posted: string;
  duration: string;
  href: string;
  streamFeedUrl?: string;
};

export type ShortItem = {
  id: string;
  title: string;
  category: string;
  image: string;
  duration: string;
  href: string;
  videoUrl?: string;
};

export type Episode = {
  id: string;
  title: string;
  category: string;
  duration: string;
  href: string;
};

export type ProgramSlot = {
  time: string;
  title: string;
  category?: string;
  live?: boolean;
};

export type ProgramFilter =
  | "all"
  | "politics"
  | "sports"
  | "entertainment"
  | "culture"
  | "education"
  | "religion"
  | "talk-shows";

export type Program = {
  id: string;
  slug: string;
  title: string;
  badge: string;
  badgeColor: string;
  filter: string;
  schedule: string;
  image: string;
  poster?: string;
  description: string;
  feedUrl?: string;
  videoFeedUrl?: string;
};

export type CatalogFilter = {
  id: string;
  label: string;
};

export type ReplayEpisode = {
  id: string;
  programSlug: string;
  title: string;
  category: string;
  published: string;
  posted: string;
  views: string;
  duration: string;
  durationSeconds: number;
  image: string;
  about: string;
  streamFeedUrl?: string;
  streamUrl?: string;
  href?: string;
};
