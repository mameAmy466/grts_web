import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MediaImage, SiteWrap } from "@/components/media-image";
import { NewsSidebar } from "@/components/news-sidebar";
import { articlesFor, categories, getCategory } from "@/lib/data";
import { getNewsNav, getWpCategory, getWpPosts } from "@/lib/api/wordpress";
import type { CategorySlug } from "@/lib/types";
import { formatDisplayDate } from "@/lib/utils";

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

  const wpArticles = wpCategory ? await getWpPosts({ categoryId: wpCategory.id, perPage: 10 }) : [];
  const fallback = getCategory(category) ? articlesFor(category as CategorySlug) : [];
  const articles = wpArticles.length ? wpArticles : fallback;
  const [featured, ...rest] = articles;
  if (!featured) notFound();

  return (
    <div className="pb-16">
      <SiteWrap className="pt-6">
        <p className="text-sm text-zinc-500">
          <Link href="/news" className="hover:text-brand">
            News
          </Link>
          <span className="mx-2">›</span>
          <span className="text-zinc-800">{meta.label}</span>
        </p>
      </SiteWrap>

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
              <h1 className="mt-2 text-2xl font-bold leading-tight text-zinc-900 md:text-3xl">
                {featured.title}
              </h1>
              <p className="mt-3 text-sm leading-6 text-zinc-600">{featured.excerpt}</p>
              <p className="mt-4 text-xs text-zinc-500">
                {formatDisplayDate(featured.date)}
                {featured.readTime ? ` • ${featured.readTime}` : null}
              </p>
            </div>
          </Link>

          <div className="mt-10 grid gap-7 sm:grid-cols-2">
            {rest.map((article) => (
              <Link key={article.id} href={article.href} className="group block">
                <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-zinc-200">
                  <MediaImage
                    src={article.image}
                    alt={article.title}
                  />
                </div>
                <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                  <span className="text-brand">{article.categoryLabel}</span>
                  <span className="mx-1.5">·</span>
                  {formatDisplayDate(article.date)}
                  {article.readTime ? ` · ${article.readTime}` : null}
                </p>
                <h2 className="mt-1.5 text-base font-bold leading-snug text-zinc-900 group-hover:text-brand">
                  {article.title}
                </h2>
              </Link>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <button
              type="button"
              className="rounded-md border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-600 hover:border-brand hover:text-brand"
            >
              See More Articles
            </button>
          </div>
        </div>

        <NewsSidebar activeCategory={category} topics={await getNewsNav()} />
      </SiteWrap>
    </div>
  );
}
