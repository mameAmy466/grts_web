export type SearchHit = {
  type: "page" | "news" | "programme" | "video" | "short";
  title: string;
  href: string;
  meta?: string;
};

export type SearchResults = {
  query: string;
  pages: SearchHit[];
  news: SearchHit[];
  programmes: SearchHit[];
  videos: SearchHit[];
  shorts: SearchHit[];
};

export function emptySearch(query = ""): SearchResults {
  return { query, pages: [], news: [], programmes: [], videos: [], shorts: [] };
}

export function searchHasHits(results: SearchResults) {
  return (
    results.pages.length +
      results.news.length +
      results.programmes.length +
      results.videos.length +
      results.shorts.length >
    0
  );
}
