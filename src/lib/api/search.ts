import { getNewsPosts } from "@/lib/api/news";
import { getTveReplayVideos, getTveShorts, getTveShows } from "@/lib/api/tve";
import { programmes as fallbackProgrammes } from "@/lib/programmes";
import { emptySearch, type SearchHit, type SearchResults } from "@/lib/search";

export type { SearchHit, SearchResults };

const SITE_PAGES: Array<{ title: string; href: string; meta: string; keywords: string }> = [
  { title: "Live TV", href: "/live", meta: "Watch", keywords: "live tv direct watch live" },
  { title: "Radio Gambia", href: "/radio", meta: "Listen", keywords: "radio listen audio gambia" },
  { title: "TV programs", href: "/programmes", meta: "Catalog", keywords: "programmes programs tv shows grille" },
  { title: "News", href: "/news", meta: "Newsroom", keywords: "news actus actualités" },
  { title: "Shorts", href: "/shorts", meta: "Clips", keywords: "shorts clips vertical" },
  { title: "About GRTS", href: "/about", meta: "About", keywords: "about à propos contact" },
];

function hay(...parts: Array<string | undefined>) {
  return parts.filter(Boolean).join(" ").toLowerCase();
}

function matches(query: string, ...parts: Array<string | undefined>) {
  const needle = query.trim().toLowerCase();
  if (needle.length < 2) return false;
  return hay(...parts).includes(needle);
}

export async function searchSite(query: string, limit = 6): Promise<SearchResults> {
  const q = query.trim();
  if (q.length < 2) return emptySearch(q);

  const [searchedNews, latestNews, shows, videos, shorts] = await Promise.all([
    getNewsPosts({ search: q, perPage: limit }),
    getNewsPosts({ perPage: 24 }),
    getTveShows(),
    getTveReplayVideos(24),
    getTveShorts(24),
  ]);

  const newsById = new Map<string, SearchHit>();
  for (const article of [
    ...searchedNews,
    ...latestNews.filter((article) => matches(q, article.title, article.excerpt, article.categoryLabel)),
  ]) {
    if (newsById.has(article.id)) continue;
    newsById.set(article.id, {
      type: "news",
      title: article.title,
      href: article.href,
      meta: article.categoryLabel,
    });
  }

  const programmes = (shows.length ? shows : fallbackProgrammes).filter((program) =>
    matches(q, program.title, program.badge, program.description, program.schedule),
  );

  return {
    query: q,
    pages: SITE_PAGES.filter((page) => matches(q, page.title, page.meta, page.keywords))
      .slice(0, limit)
      .map((page) => ({ type: "page", title: page.title, href: page.href, meta: page.meta })),
    news: [...newsById.values()].slice(0, limit),
    programmes: programmes.slice(0, limit).map((program) => ({
      type: "programme",
      title: program.title,
      href: `/programmes/${program.slug}`,
      meta: program.badge,
    })),
    videos: videos
      .filter((video) => matches(q, video.title, video.description, video.category))
      .slice(0, limit)
      .map((video) => ({
        type: "video",
        title: video.title,
        href: video.href,
        meta: video.category || video.posted,
      })),
    shorts: shorts
      .filter((item) => matches(q, item.title, item.category))
      .slice(0, limit)
      .map((item) => ({
        type: "short",
        title: item.title,
        href: item.href,
        meta: item.category,
      })),
  };
}
