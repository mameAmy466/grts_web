import { unstable_cache } from "next/cache";
import { allItems, getJson, getJsonUncached } from "@/lib/api/http";
import { TVE_API_BASE, TVE_APP_SLUG } from "@/lib/env";
import { REVALIDATE_CATEGORY, REVALIDATE_STATIC } from "@/lib/revalidate";
import type { Article, CategorySlug } from "@/lib/types";
import { decodeHtmlEntities, formatDisplayDate, firstHtmlImage, stripHtml } from "@/lib/utils";

const EDITORIAL_SLUGS = new Set([
  "home",
  "breaking-news",
  "latest-new",
  "latest-news",
  "editors-choice",
  "most-viewed",
]);

type TveNewsCategory = {
  title: string;
  slug: string;
  parent_slug?: string;
  image_url?: string;
  posts_count?: number;
  feed_url?: string;
};

type TveNewsTerm = {
  title: string;
  slug: string;
  feed_url?: string;
};

type TveNewsPost = {
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  image?: string;
  image_url?: string;
  logo?: string;
  logo_url?: string;
  thumbnail?: string;
  published_at?: string;
  categories?: TveNewsTerm[];
};

type TveNewsPayload = {
  allitems?: TveNewsPost[];
  pagination?: {
    per_page?: number | null;
    next_page_url?: string | null;
  };
};

export type NewsCategory = { slug: string; label: string; feedUrl?: string };

export type NewsPage = {
  articles: Article[];
  nextCursor: string | null;
  hasMore: boolean;
};

function newsUrl(path: "newscategories" | "newsposts", params?: Record<string, string | number>) {
  const url = new URL(`${TVE_API_BASE}/${path}/${TVE_APP_SLUG}/json`);
  Object.entries(params ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  });
  return url.toString();
}

function cursorFromUrl(value?: string | null) {
  if (!value) return null;
  try {
    return new URL(value).searchParams.get("cursor");
  } catch {
    return null;
  }
}

function newsImage(post: TveNewsPost) {
  return (
    post.image_url ||
    post.image ||
    post.logo_url ||
    post.logo ||
    post.thumbnail ||
    firstHtmlImage(post.content) ||
    ""
  );
}

function topicCategory(categories: TveNewsTerm[] = []): TveNewsTerm | undefined {
  return categories.find((item) => !EDITORIAL_SLUGS.has(item.slug)) ?? categories[0];
}

function postToArticle(
  post: TveNewsPost,
  categorySlug?: string,
  includeContent = false,
): Article {
  const topic = categorySlug
    ? post.categories?.find((item) => item.slug === categorySlug) ?? topicCategory(post.categories)
    : topicCategory(post.categories);
  const slug = (topic?.slug ?? categorySlug ?? "news") as CategorySlug;
  const content = includeContent ? decodeHtmlEntities(post.content ?? "") : "";
  const excerpt = stripHtml(post.excerpt ?? "");
  const words = includeContent ? stripHtml(content).split(/\s+/).filter(Boolean).length : 0;

  return {
    id: post.slug,
    slug: post.slug,
    title: stripHtml(post.title),
    excerpt,
    category: slug,
    categoryLabel: topic?.title?.toUpperCase() ?? "NEWS",
    date: formatDisplayDate(post.published_at) || post.published_at || "",
    readTime: includeContent ? `${Math.max(2, Math.round(words / 200))} min read` : undefined,
    image: newsImage(post),
    href: `/news/${slug}/${post.slug}`,
    author: "GRTS Newsroom",
    lead: excerpt,
    tags: (post.categories ?? []).map((item) => item.title).filter(Boolean),
    contentHtml: includeContent ? content : undefined,
  };
}

async function fetchNewsPayload(params?: Record<string, string | number>) {
  return getJsonUncached<TveNewsPayload>(newsUrl("newsposts", params));
}

export async function getNewsCategories(): Promise<NewsCategory[]> {
  try {
    const categories = allItems<TveNewsCategory>(
      await getJson(newsUrl("newscategories", { parent_id: 0 }), REVALIDATE_STATIC),
    );
    return categories
      .filter((item) => item.slug && item.slug !== "home")
      .map((item) => ({
        slug: item.slug,
        label: item.title,
        feedUrl: item.feed_url,
      }));
  } catch {
    return [];
  }
}

export async function getNewsNav() {
  const categories = await getNewsCategories();
  if (categories.length) return categories;
  return [
    { slug: "news", label: "News" },
    { slug: "politics", label: "Politics" },
    { slug: "sports", label: "Sports" },
    { slug: "health", label: "Health" },
  ];
}

export async function getNewsCategory(slug: string) {
  const categories = await getNewsCategories();
  return categories.find((item) => item.slug === slug) ?? null;
}

export async function getNewsPosts(options?: {
  perPage?: number;
  categorySlug?: string;
  slug?: string;
  search?: string;
}) {
  const perPage = options?.perPage ?? 12;
  const categorySlug = options?.categorySlug ?? "";
  const slug = options?.slug ?? "";
  const search = options?.search?.trim() ?? "";

  try {
    if (search) {
      const payload = await fetchNewsPayload({
        per_page: perPage,
        ...(categorySlug ? { category_slug: categorySlug } : {}),
        search,
      });
      if (!payload) return [];
      return allItems<TveNewsPost>(payload)
        .slice(0, perPage)
        .map((post) => postToArticle(post, categorySlug || undefined, Boolean(slug)));
    }

    return await unstable_cache(
      async () => {
        const payload = await fetchNewsPayload({
          per_page: perPage,
          ...(categorySlug ? { category_slug: categorySlug } : {}),
          ...(slug ? { slug } : {}),
          ...(search ? { search } : {}),
        });
        if (!payload) return [];
        const posts = allItems<TveNewsPost>(payload).slice(0, perPage);
        return posts.map((post) => postToArticle(post, categorySlug || undefined, Boolean(slug)));
      },
      ["tve-news-posts", TVE_APP_SLUG, String(perPage), categorySlug, slug, search],
      { revalidate: REVALIDATE_CATEGORY },
    )();
  } catch {
    return [];
  }
}

export async function getNewsPostsPage(options?: {
  perPage?: number;
  categorySlug?: string;
  cursor?: string;
}): Promise<NewsPage> {
  const perPage = options?.perPage ?? 12;
  const categorySlug = options?.categorySlug ?? "";
  const cursor = options?.cursor ?? "";

  try {
    return await unstable_cache(
      async () => {
        const payload = await fetchNewsPayload({
          per_page: perPage,
          ...(categorySlug ? { category_slug: categorySlug } : {}),
          ...(cursor ? { cursor } : {}),
        });
        if (!payload) return { articles: [], nextCursor: null, hasMore: false };
        return {
          articles: allItems<TveNewsPost>(payload)
            .slice(0, perPage)
            .map((post) => postToArticle(post, categorySlug || undefined)),
          nextCursor: cursorFromUrl(payload.pagination?.next_page_url),
          hasMore: Boolean(cursorFromUrl(payload.pagination?.next_page_url)),
        };
      },
      ["tve-news-page", TVE_APP_SLUG, String(perPage), categorySlug, cursor],
      { revalidate: REVALIDATE_CATEGORY },
    )();
  } catch {
    return { articles: [], nextCursor: null, hasMore: false };
  }
}

export async function getNewsPost(category: string, slug: string) {
  const posts = await getNewsPosts({ slug, perPage: 1 });
  const article = posts[0];
  if (!article) return null;
  if (category && article.category !== category) {
    return { ...article, category: category as CategorySlug, href: `/news/${category}/${article.slug}` };
  }
  return article;
}
