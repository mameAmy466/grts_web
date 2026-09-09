import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CategoryArticleFeed } from "@/components/category-article-feed";
import { MediaImage, SiteWrap } from "@/components/media-image";
import { NewsSidebar } from "@/components/news-sidebar";
import { articlesFor, categories, getCategory } from "@/lib/data";
import { getNewsNav, getWpCategory, getWpPostsPage } from "@/lib/api/wordpress";
import type { CategorySlug } from "@/lib/types";
import { clipText, formatDisplayDate } from "@/lib/utils";

export const revalidate = 120;

export async function generateStaticParams() {
  const nav = await getNewsNav();
  return (nav.length ? nav : categories).map((category) => ({ category: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const item = (await getWpCategory(category)) ?? getCategory(category);
  return { title: item ? `${item.label} news` : "News" };
}

export default async function NewsCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const wpCategory = await getWpCategory(category);
  const meta = wpCategory ?? getCategory(category);
  if (!meta) notFound();

  const feed = wpCategory
    ? await getWpPostsPage({ categoryId: wpCategory.id, perPage: 10, page: 1 })
    : { articles: [], hasMore: false };
  const fallback = getCategory(category) ? articlesFor(category as CategorySlug) : [];
  const articles = feed.articles.length ? feed.articles : fallback;
  const [featured, ...rest] = articles;
  if (!featured) notFound();

  return (
    <div className="pb-16">
      <SiteWrap className="grid gap-10 py-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Link href={featured.href} className="group grid gap-6 md:grid-cols-2">
            <div className="relative aspect-[16/11] overflow-hidden rounded-xl bg-zinc-200">
              <MediaImage
                src={featured.image}
                alt={featured.title}
                priority
              />
            </div>
            <div className="flex flex-col justify-center">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-brand">
                {featured.categoryLabel}
              </p>
              <h1 className="mt-2 line-clamp-3 break-words text-2xl font-bold leading-tight text-zinc-900 md:text-3xl">
                {clipText(featured.title, 110)}
              </h1>
              <p className="mt-3 line-clamp-3 break-words text-sm leading-6 text-zinc-600">
                {clipText(featured.excerpt, 160)}
              </p>
              <p className="mt-4 text-xs text-zinc-500">
                {formatDisplayDate(featured.date)}
                {featured.readTime ? ` • ${featured.readTime}` : null}
              </p>
            </div>
          </Link>

          <CategoryArticleFeed
            initialArticles={rest}
            categoryId={wpCategory?.id ?? 0}
            excludeId={featured.id}
            hasMore={feed.hasMore}
          />
        </div>

        <NewsSidebar activeCategory={category} topics={await getNewsNav()} />
      </SiteWrap>
    </div>
  );
}
