import type { Metadata } from "next";
import Link from "next/link";
import { BreakingTicker } from "@/components/breaking-ticker";
import { NewsGridCard } from "@/components/cards";
import { socialIcons } from "@/components/icons";
import { MediaImage, SiteWrap } from "@/components/media-image";
import { StayConnectedCard } from "@/components/stay-connected-card";
import {
  editorsChoice,
  followerStats,
  latestNewsFeatured,
  latestNewsList,
  mostViewed,
  newsHero,
  socialLinks,
} from "@/lib/data";
import { getNewsPosts } from "@/lib/api/news";
import { clipText, formatDisplayDate } from "@/lib/utils";

export const metadata: Metadata = {
  title: "News",
};

export const revalidate = 600; // REVALIDATE_CATEGORY

export default async function NewsPage() {
  const [posts, breaking, latestBucket, viewedBucket, choiceBucket] = await Promise.all([
    getNewsPosts({ perPage: 16 }),
    getNewsPosts({ categorySlug: "breaking-news" }),
    getNewsPosts({ categorySlug: "latest-new" }),
    getNewsPosts({ categorySlug: "most-viewed" }),
    getNewsPosts({ categorySlug: "editors-choice" }),
  ]);
  const ticker = breaking.length ? breaking : posts;
  const featured = posts[0] ?? newsHero.featured;
  const compact = posts.slice(1, 4).length ? posts.slice(1, 4) : newsHero.compact;
  const grid = posts.slice(4, 8).length ? posts.slice(4, 8) : newsHero.grid;
  const latestSource = latestBucket.length ? latestBucket : posts;
  const latestFeatured = latestSource[0] ?? latestNewsFeatured;
  const latestList = latestSource.slice(1, 5).length >= 4 ? latestSource.slice(1, 5) : latestNewsList;
  const viewed = viewedBucket.slice(0, 4).length ? viewedBucket.slice(0, 4) : mostViewed;
  const choice = choiceBucket.slice(0, 3).length ? choiceBucket.slice(0, 3) : editorsChoice;

  return (
    <div className="bg-white pb-16">
      <BreakingTicker articles={ticker.slice(0, 6)} />

      <SiteWrap className="py-8 sm:py-10">
        <div className="grid min-w-0 gap-5 md:grid-cols-12">
          <div className="min-w-0 md:col-span-7">
            <Link href={featured.href} className="group relative block overflow-hidden rounded-xl">
              <div className="relative aspect-[16/10] min-h-[220px] bg-zinc-200 sm:min-h-[340px]">
                <MediaImage
                  src={featured.image}
                  alt={featured.title}
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 md:p-8">
                  <h1 className="line-clamp-3 break-words text-xl font-bold leading-tight text-white sm:text-2xl md:text-4xl">
                    {clipText(featured.title, 110)}
                  </h1>
                  <p className="mt-2 line-clamp-3 break-words text-sm text-zinc-200">
                    {clipText(featured.excerpt, 140)}
                  </p>
                </div>
              </div>
            </Link>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {compact.map((article) => (
                <Link key={article.id} href={article.href} className="group flex gap-3">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-zinc-200">
                    <MediaImage src={article.image} alt={article.title} sizes="56px" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase text-brand">{article.categoryLabel}</p>
                    <h3 className="line-clamp-3 break-words text-sm font-semibold leading-snug text-zinc-900 group-hover:text-brand">
                      {clipText(article.title, 72)}
                    </h3>
                    <p className="mt-1 text-xs text-zinc-500">{formatDisplayDate(article.date)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <div className="grid min-w-0 gap-5 sm:grid-cols-2 md:col-span-5">
            {grid.map((article) => (
              <NewsGridCard key={article.id} article={article} theme="light" />
            ))}
          </div>
        </div>
      </SiteWrap>

      <section className="bg-[#F5F5F5] py-6">
      <SiteWrap>
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
          <div className="min-w-0 w-full flex-1">
            <h2 className="mb-6 text-2xl font-bold text-zinc-900">Latest News</h2>
            <div className="flex flex-col gap-3 md:flex-row md:items-stretch">
              <article className="min-w-0 flex-1">
                <Link href={latestFeatured.href} className="group flex h-full flex-col overflow-hidden rounded-xl bg-white">
                  <div className="relative aspect-[16/10] bg-zinc-200">
                    <MediaImage
                      src={latestFeatured.image}
                      alt={latestFeatured.title}
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-brand">
                      {latestFeatured.categoryLabel} · {formatDisplayDate(latestFeatured.date)}
                    </p>
                    <h3 className="mt-1.5 line-clamp-3 break-words text-lg font-bold leading-snug text-zinc-900 group-hover:text-brand">
                      {clipText(latestFeatured.title, 90)}
                    </h3>
                    <p className="mt-1.5 line-clamp-3 break-words text-sm leading-6 text-zinc-600">
                      {clipText(latestFeatured.excerpt, 140)}
                    </p>
                  </div>
                </Link>
              </article>
              <div className="flex min-w-0 flex-1 flex-col gap-3">
                {latestList.map((article) => (
                  <Link key={article.id} href={article.href} className="group flex min-h-0 flex-1 items-center gap-3 rounded-xl bg-white p-3">
                    <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-lg bg-zinc-200">
                      <MediaImage src={article.image} alt={article.title} sizes="72px" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-brand">
                        {article.categoryLabel}
                      </p>
                      <h3 className="mt-0.5 line-clamp-2 break-words text-sm font-bold leading-snug text-zinc-900 group-hover:text-brand">
                        {clipText(article.title, 70)}
                      </h3>
                      <p className="mt-0.5 line-clamp-1 break-words text-xs leading-5 text-zinc-500">
                        {clipText(article.excerpt, 70)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <aside className="flex w-full flex-col gap-8 lg:w-[432px] lg:shrink-0">
            <div>
              <h3 className="text-sm font-bold text-zinc-900">Follow Us</h3>
              <div className="mt-3 flex h-auto w-full max-w-[432px] flex-wrap gap-1 sm:h-[55px] sm:flex-nowrap">
                {followerStats.map((item, index) => {
                  const Icon = socialIcons[item.name];
                  return (
                    <a
                      key={item.name}
                      href={socialLinks[index].href}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-glass flex h-[55px] min-w-0 flex-1 items-center gap-2 rounded-md p-2 sm:w-[105px] sm:flex-none sm:gap-2.5 sm:p-3"
                    >
                      <Icon className="h-4 w-4 shrink-0" style={{ color: item.color }} />
                      <span className="min-w-0">
                        <span className="block truncate text-xs font-bold leading-tight text-zinc-800">{item.count}</span>
                        <span className="block truncate text-[10px] leading-tight text-zinc-500">{item.label}</span>
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
            <StayConnectedCard />
            <div>
              <h3 className="text-sm font-bold text-zinc-900">Most Viewed</h3>
              <ol className="mt-3 flex flex-col gap-3">
                {viewed.map((article, index) => (
                  <li key={article.id}>
                    <Link href={article.href} className="group flex items-start gap-3 rounded-lg bg-white px-3 py-3">
                      <span className="w-6 shrink-0 text-2xl font-bold leading-none text-zinc-300">{index + 1}</span>
                      <span className="min-w-0">
                        <span className="block text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                          {article.categoryLabel}
                        </span>
                        <span className="mt-0.5 line-clamp-2 break-words text-sm font-semibold leading-snug text-zinc-900 group-hover:text-brand">
                          {clipText(article.title, 64)}
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </SiteWrap>
      </section>

      <SiteWrap className="pt-14">
        <h2 className="mb-6 text-2xl font-bold text-zinc-900">Editor&apos;s Choice</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {choice.map((article) => (
            <Link
              key={article.id}
              href={article.href}
              className="group overflow-hidden rounded-xl border border-zinc-200 bg-white"
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
                <h3 className="mt-2 line-clamp-3 break-words text-lg font-bold leading-snug text-zinc-900 group-hover:text-brand">
                  {clipText(article.title, 90)}
                </h3>
                <p className="mt-2 line-clamp-3 break-words text-sm leading-6 text-zinc-600">
                  {clipText(article.excerpt, 140)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </SiteWrap>
    </div>
  );
}
