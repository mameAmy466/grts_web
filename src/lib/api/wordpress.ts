import { getJson, getJsonMeta } from "@/lib/api/http";
import { WORDPRESS_API_BASE } from "@/lib/env";
import type { Article, CategorySlug } from "@/lib/types";
import { decodeHtmlEntities, firstHtmlImage, formatWpDate, stripHtml } from "@/lib/utils";

type WpRendered = { rendered?: string };
type WpTerm = { id: number; name: string; slug: string; count?: number };
type WpMedia = { source_url?: string };
type WpAuthor = { name?: string; avatar_urls?: Record<string, string> };

type WpPost = {
  id: number;
  slug: string;
  date: string;
  link?: string;
  title?: WpRendered;
  excerpt?: WpRendered;
  content?: WpRendered;
  categories?: number[];
  _embedded?: {
    author?: WpAuthor[];
    "wp:featuredmedia"?: WpMedia[];
    "wp:term"?: WpTerm[][];
  };
};

type WpCategory = WpTerm & { parent?: number };

function wpUrl(path: string, params?: Record<string, string | number>) {
  const url = new URL(`${WORDPRESS_API_BASE.replace(/\/$/, "")}/${path}`);
  Object.entries(params ?? {}).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });
  return url.toString();
}

export async function getWpCategories() {
  if (!WORDPRESS_API_BASE) return [];
  try {
    const categories = await getJson<WpCategory[]>(
      wpUrl("categories", { per_page: 40, hide_empty: 1 }),
    );
    return categories
      .filter((item) => !item.parent)
      .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
      .slice(0, 12)
      .map((item) => ({ slug: item.slug, label: item.name, id: item.id }));
  } catch {
    return [];
  }
}

export async function getWpCategory(slug: string) {
  const categories = await getWpCategories();
  return categories.find((item) => item.slug === slug) ?? null;
}

export async function getNewsNav() {
  const categories = await getWpCategories();
  if (categories.length) return categories;
  return [
    { slug: "politics", label: "Politics", id: 0 },
    { slug: "economy", label: "Economy", id: 0 },
    { slug: "sports", label: "Sports", id: 0 },
    { slug: "entertainment", label: "Entertainment", id: 0 },
    { slug: "health", label: "Health", id: 0 },
    { slug: "technology", label: "Technology", id: 0 },
  ];
}

export async function getWpPosts(options?: {
  perPage?: number;
  page?: number;
  categoryId?: number;
  slug?: string;
}) {
  if (!WORDPRESS_API_BASE) return [];
  try {
    const params: Record<string, string | number> = {
      per_page: options?.perPage ?? 12,
      page: options?.page ?? 1,
      _embed: 1,
    };
    if (options?.categoryId) params.categories = options.categoryId;
    if (options?.slug) params.slug = options.slug;
    const posts = await getJson<WpPost[]>(wpUrl("posts", params));
    return posts.map(postToArticle);
  } catch {
    return [];
  }
}

export async function getWpPostsPage(options?: {
  perPage?: number;
  page?: number;
  categoryId?: number;
}) {
  const page = options?.page ?? 1;
  const perPage = options?.perPage ?? 12;
  if (!WORDPRESS_API_BASE) return { articles: [], page, totalPages: 0, hasMore: false };
  try {
    const params: Record<string, string | number> = {
      per_page: perPage,
      page,
      _embed: 1,
    };
    if (options?.categoryId) params.categories = options.categoryId;
    const { data, totalPages } = await getJsonMeta<WpPost[]>(wpUrl("posts", params));
    return {
      articles: data.map((post) => {
        const article = postToArticle(post);
        return { ...article, contentHtml: undefined, sections: undefined };
      }),
      page,
      totalPages,
      hasMore: page < totalPages,
    };
  } catch {
    return { articles: [], page, totalPages: 0, hasMore: false };
  }
}

export async function getWpPost(category: string, slug: string) {
  const posts = await getWpPosts({ slug, perPage: 1 });
  const article = posts[0];
  if (!article) return null;
  return article.category === category || !category ? article : { ...article, category: article.category };
}

function postToArticle(post: WpPost): Article {
  const groups = post._embedded?.["wp:term"] ?? [];
  const categories = groups[0] ?? [];
  const extraTerms = groups.slice(1).flat();
  const category = categories[0];
  const media = post._embedded?.["wp:featuredmedia"]?.[0];
  const author = post._embedded?.author?.[0];
  const title = stripHtml(post.title?.rendered ?? "");
  const excerpt = stripHtml(post.excerpt?.rendered ?? "");
  const content = decodeHtmlEntities(post.content?.rendered ?? "");
  const categorySlug = (category?.slug ?? "general-news") as CategorySlug;
  const tags = [...categories, ...extraTerms]
    .map((term) => term.name.trim())
    .filter((name, index, list) => name && list.indexOf(name) === index);

  return {
    id: String(post.id),
    slug: post.slug,
    title,
    excerpt,
    category: categorySlug,
    categoryLabel: category?.name?.toUpperCase() ?? "NEWS",
    date: formatWpDate(post.date),
    readTime: `${Math.max(2, Math.round(stripHtml(content).split(/\s+/).length / 200))} min read`,
    image: media?.source_url || firstHtmlImage(post.content?.rendered) || "",
    href: `/news/${categorySlug}/${post.slug}`,
    author: author?.name,
    authorImage: author?.avatar_urls?.["96"],
    lead: excerpt,
    sections: [],
    tags,
    contentHtml: content,
  };
}
