"use server";

import { getWpPostsPage } from "@/lib/api/wordpress";

export async function loadMoreCategoryPosts(categoryId: number, page: number) {
  if (!categoryId || page < 2) return { articles: [], hasMore: false };
  const result = await getWpPostsPage({ categoryId, page, perPage: 10 });
  return { articles: result.articles, hasMore: result.hasMore };
}
