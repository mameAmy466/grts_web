"use server";

import { getNewsPostsPage } from "@/lib/api/news";

export async function loadMoreCategoryPosts(categorySlug: string, cursor: string) {
  if (!categorySlug || !cursor) return { articles: [], nextCursor: null, hasMore: false };
  const result = await getNewsPostsPage({ categorySlug, cursor, perPage: 10 });
  return { articles: result.articles, nextCursor: result.nextCursor, hasMore: result.hasMore };
}
