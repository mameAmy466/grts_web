import Link from "next/link";
import {
  NewsGridCard,
  NewsOverlayCard,
  NewsThumbRow,
  SectionHeading,
  SideNewsRow,
  VideoCard,
} from "@/components/cards";
import { IconArrowRight } from "@/components/icons";
import { SiteWrap } from "@/components/media-image";
import { ShortsRow } from "@/components/shorts-row";
import { WatchAgain } from "@/components/watch-again";
import { homeHeadlines, homeNewsGrid, homeTopNews } from "@/lib/data";

import { getTveReplayVideos, getTveShorts, getTveSliders } from "@/lib/api/tve";
import { getNewsPosts } from "@/lib/api/news";

export const revalidate = 120; // REVALIDATE_HOME

export default async function HomePage() {
  const [choice, posts, sliders, replays, apiShorts] = await Promise.all([
    getNewsPosts({ categorySlug: "editors-choice", perPage: 12 }),
    getNewsPosts({ perPage: 12 }),
    getTveSliders(),
    getTveReplayVideos(16),
    getTveShorts(10),
  ]);
  const news = [...choice, ...posts.filter((item) => !choice.some((picked) => picked.id === item.id))];
  const topNews = news.slice(0, 4).length ? news.slice(0, 4) : homeTopNews;
  const featured = news[0] ?? homeHeadlines.featured;
  const side = news.slice(1, 5).length >= 4 ? news.slice(1, 5) : homeHeadlines.side;
  const grid = news.slice(5, 9).length ? news.slice(5, 9) : homeNewsGrid;
  const replayVideos = replays.length ? replays : sliders;
  const popularVideos = (sliders.length ? sliders : replayVideos).slice(0, 4);

  return (
    <div className="pb-20">
      <SiteWrap className="py-8 sm:py-10">
        <SectionHeading title="News" href="/news" />
        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
          {topNews.map((article) => (
            <NewsThumbRow key={article.id} article={article} />
          ))}
        </div>
      </SiteWrap>

      <SiteWrap className="pb-10 sm:pb-12">
        <div className="grid min-w-0 items-stretch gap-4 md:grid-cols-12 md:gap-3">
          <div className="min-w-0 md:col-span-7">
            <NewsOverlayCard article={featured} large />
          </div>
          <div className="flex min-w-0 flex-col gap-3 md:col-span-5 md:h-full">
            {side.map((article) => (
              <SideNewsRow key={article.id} article={article} className="min-h-0 flex-1" />
            ))}
          </div>
        </div>
        <div className="mt-6 grid gap-5 sm:mt-8 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {grid.map((article) => (
            <NewsGridCard key={article.id} article={article} />
          ))}
        </div>
      </SiteWrap>

      <SiteWrap className="pb-10 sm:pb-12">
        <div className="flex h-auto w-full flex-col justify-between gap-5 rounded-3xl border-x-0 border-y border-[var(--color-bg-primary,#0A0A0A)] bg-[var(--color-surface-default,#171717)] px-4 py-6 sm:h-[140px] sm:flex-row sm:items-center sm:gap-8 sm:px-10 sm:py-0">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-brand">YOUR AD HERE</p>
            <p className="mt-1 text-xl font-bold leading-tight text-zinc-200">Promote your brand on GRTS</p>
            <p className="mt-1 text-sm text-zinc-500">
              TV, digital, and sponsorships — join our national audience.
            </p>
          </div>
          <Link
            href="/about#contact"
            className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover"
          >
            Contact us
            <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </SiteWrap>

      {replayVideos.length ? (
        <section className="bg-[#111] py-8 md:py-12">
          <SiteWrap>
            <WatchAgain videos={replayVideos} />
          </SiteWrap>
        </section>
      ) : null}

      {apiShorts.length ? (
        <SiteWrap className="pb-12">
          <SectionHeading title="Our Shorts" href="/shorts" />
          <ShortsRow items={apiShorts} />
        </SiteWrap>
      ) : null}

      {popularVideos.length ? (
        <SiteWrap>
          <SectionHeading title="Most popular videos" href="/programmes" />
          <div className="grid grid-cols-2 justify-start gap-3 sm:grid-cols-[repeat(auto-fill,minmax(200px,267px))] sm:gap-2">
            {popularVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </SiteWrap>
      ) : null}
    </div>
  );
}
