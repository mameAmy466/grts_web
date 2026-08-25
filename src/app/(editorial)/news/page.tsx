import type { Metadata } from "next";
import Link from "next/link";
import { BreakingTicker } from "@/components/breaking-ticker";
import { NewsGridCard } from "@/components/cards";
import { socialIcons } from "@/components/icons";
import { MediaImage, SiteWrap } from "@/components/media-image";
import {
  editorsChoice,
  followerStats,
  latestNewsFeatured,
  latestNewsList,
  mostViewed,
  newsHero,
  socialLinks,
} from "@/lib/data";
import { getWpPosts } from "@/lib/api/wordpress";
import { formatDisplayDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "News",
};

export const revalidate = 120;

export default async function NewsPage() {
  const posts = await getWpPosts({ perPage: 16 });
  const featured = posts[0] ?? newsHero.featured;
  const compact = posts.slice(1, 4).length ? posts.slice(1, 4) : newsHero.compact;
  const grid = posts.slice(4, 8).length ? posts.slice(4, 8) : newsHero.grid;
  const latestFeatured = posts[1] ?? latestNewsFeatured;
  const latestList = posts.slice(2, 5).length ? posts.slice(2, 5) : latestNewsList;
  const viewed = posts.slice(5, 9).length ? posts.slice(5, 9) : mostViewed;
  const choice = posts.slice(8, 11).length ? posts.slice(8, 11) : editorsChoice;

  return (
    <div className="pb-16">
      <BreakingTicker articles={posts.slice(0, 6)} />

      <SiteWrap className="py-10">
        <div className="grid gap-5 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Link href={featured.href} className="group relative block overflow-hidden rounded-xl">
              <div className="relative aspect-[16/10] min-h-[340px] bg-zinc-200">
                <MediaImage
                  src={featured.image}
                  alt={featured.title}
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
                  <h1 className="text-2xl font-bold leading-tight text-white md:text-4xl">
                    {featured.title}
                  </h1>
                  <p className="mt-2 text-sm text-zinc-200">{featured.excerpt}</p>
                </div>
              </div>
            </Link>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {compact.map((article) => (
                <Link key={article.id} href={article.href} className="group flex gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-zinc-200">
                    <MediaImage src={article.image} alt={article.title} sizes="56px" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase text-brand">{article.categoryLabel}</p>
                    <h3 className="text-sm font-semibold leading-snug text-zinc-900 group-hover:text-brand">
                      {article.title}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-500">{formatDisplayDate(article.date)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:col-span-5">
            {grid.map((article) => (
              <NewsGridCard key={article.id} article={article} theme="light" />
            ))}
          </div>
        </div>
      </SiteWrap>

      <SiteWrap className="pb-14">
        <h2 className="mb-6 text-2xl font-bold text-zinc-900">Latest News</h2>
        <div className="grid gap-8 lg:grid-cols-12">
          <article className="lg:col-span-4">
            <Link href={latestFeatured.href} className="group block">
              <div className="relative aspect-square overflow-hidden rounded-xl bg-zinc-200">
                <MediaImage
                  src={latestFeatured.image}
                  alt={latestFeatured.title}
                />
              </div>
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-wide text-brand">
                {latestFeatured.categoryLabel} · {formatDisplayDate(latestFeatured.date)}
              </p>
              <h3 className="mt-2 text-xl font-bold leading-snug text-zinc-900 group-hover:text-brand">
                {latestFeatured.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-zinc-600">{latestFeatured.excerpt}</p>
            </Link>
          </article>
          <div className="flex flex-col justify-between gap-6 lg:col-span-5">
            {latestList.map((article) => (
              <Link key={article.id} href={article.href} className="group flex gap-4">
                <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-lg bg-zinc-200">
                  <MediaImage src={article.image} alt={article.title} sizes="120px" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-brand">
                    {article.categoryLabel}
                  </p>
                  <h3 className="mt-1 text-sm font-bold leading-snug text-zinc-900 group-hover:text-brand">
                    {article.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-500">{article.excerpt}</p>
                </div>
              </Link>
            ))}
          </div>
          <aside className="lg:col-span-3">
            <h3 className="text-sm font-bold text-zinc-900">Follow Us</h3>
            <div className="mt-3 space-y-2">
              {followerStats.map((item, index) => {
                const Icon = socialIcons[item.name];
                return (
                  <a
                    key={item.name}
                    href={socialLinks[index].href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-md px-3 py-2.5 text-white"
                    style={{ backgroundColor: item.color }}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm font-semibold">{item.count}</span>
                  </a>
                );
              })}
            </div>
            <h3 className="mt-8 text-sm font-bold text-zinc-900">Most Viewed</h3>
            <ol className="mt-3 space-y-4">
              {viewed.map((article, index) => (
                <li key={article.id} className="flex gap-3">
                  <span className="text-2xl font-bold text-zinc-300">{index + 1}</span>
                  <Link href={article.href} className="group">
                    <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                      {article.categoryLabel}
                    </p>
                    <p className="text-sm font-semibold leading-snug text-zinc-900 group-hover:text-brand">
                      {article.title}
                    </p>
                  </Link>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </SiteWrap>

      <SiteWrap>
        <h2 className="mb-6 text-2xl font-bold text-zinc-900">Editor&apos;s Choice</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {choice.map((article) => (
            <Link
              key={article.id}
              href={article.href}
              className="group overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm"
            >
              <div className="relative aspect-[16/10] bg-zinc-200">
                <MediaImage
                  src={article.image}
                  alt={article.title}
                />
              </div>
              <div className="p-5">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-brand">
                  {article.categoryLabel}
                </p>
                <h3 className="mt-2 text-lg font-bold leading-snug text-zinc-900 group-hover:text-brand">
                  {article.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{article.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </SiteWrap>
    </div>
  );
}
