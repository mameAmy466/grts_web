import Link from "next/link";
import {
  NewsGridCard,
  NewsOverlayCard,
  NewsThumbRow,
  PlayBadge,
  SectionHeading,
  SideNewsRow,
  VideoCard,
} from "@/components/cards";
import { IconArrowRight } from "@/components/icons";
import { MediaImage, SiteWrap } from "@/components/media-image";
import { ShortsRow } from "@/components/shorts-row";
import {
  homeHeadlines,
  homeNewsGrid,
  homeTopNews,
  latestVideos,
  popularVideos,
  shorts,
  watchAgainFeatured,
  watchAgainSide,
} from "@/lib/data";

import { getTveReplayVideos, getTveShorts, getTveSliders } from "@/lib/api/tve";
import { getWpPosts } from "@/lib/api/wordpress";
import { formatDisplayDate } from "@/lib/utils";

export const revalidate = 120;

export default async function HomePage() {
  const [posts, sliders, replays, apiShorts] = await Promise.all([
    getWpPosts({ perPage: 12 }),
    getTveSliders(),
    getTveReplayVideos(12),
    getTveShorts(10),
  ]);
  const topNews = posts.slice(0, 4).length ? posts.slice(0, 4) : homeTopNews;
  const featured = posts[0] ?? homeHeadlines.featured;
  const side = posts.slice(1, 5).length >= 4 ? posts.slice(1, 5) : homeHeadlines.side;
  const grid = posts.slice(5, 9).length ? posts.slice(5, 9) : homeNewsGrid;
  const videos = sliders.length ? sliders : latestVideos;
  const replayFeatured = replays[0] ?? watchAgainFeatured;
  const replaySide = replays.slice(1, 4);
  const replayGrid = replays.slice(4, 8);

  return (
    <div className="pb-20">
      <SiteWrap className="py-10">
        <SectionHeading title="News" href="/news" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {topNews.map((article) => (
            <NewsThumbRow key={article.id} article={article} />
          ))}
        </div>
      </SiteWrap>

      <SiteWrap className="pb-12">
        <div className="grid items-stretch gap-3 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <NewsOverlayCard article={featured} large />
          </div>
          <div className="flex flex-col gap-3 lg:col-span-5 lg:h-full">
            {side.map((article) => (
              <SideNewsRow key={article.id} article={article} className="min-h-0 flex-1" />
            ))}
          </div>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {grid.map((article) => (
            <NewsGridCard key={article.id} article={article} />
          ))}
        </div>
      </SiteWrap>

      <SiteWrap className="pb-12">
        <div className="flex h-auto w-full flex-col justify-between gap-5 rounded-3xl border-x-0 border-y border-[var(--color-bg-primary,#0A0A0A)] bg-[var(--color-surface-default,#171717)] px-10 py-6 sm:h-[140px] sm:flex-row sm:items-center sm:gap-8 sm:py-0">
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

      <SiteWrap className="pb-12">
        <SectionHeading title="Watch Again" href="/programmes" />
        <div className="grid w-full gap-2 lg:grid-cols-[minmax(0,647fr)_minmax(0,463fr)] lg:items-start">
          <Link
            href={replayFeatured.href}
            className="group relative block h-[364px] w-full overflow-hidden rounded-lg border border-[var(--color-bg-primary,#0A0A0A)] bg-zinc-800"
          >
            <MediaImage src={replayFeatured.image} alt={replayFeatured.title} />
            <PlayBadge className="absolute left-5 top-4" />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent pb-5 pl-5 pr-5 pt-10">
              <h3 className="text-xl font-bold text-white">{replayFeatured.title}</h3>
              <p className="mt-1 text-xs text-zinc-300">
                {formatDisplayDate(replayFeatured.posted)} · {replayFeatured.duration}
              </p>
            </div>
          </Link>
          <div className="flex w-full flex-col gap-2">
            {(replaySide.length ? replaySide : watchAgainSide).map((video) => (
              <Link
                key={video.id}
                href={video.href}
                className="group flex h-[114px] w-full items-center gap-4 rounded-lg border border-[var(--color-bg-primary,#0A0A0A)] pb-4 pl-2.5 pr-4 pt-4"
              >
                <div className="relative h-full w-[128px] shrink-0 overflow-hidden rounded-md bg-zinc-800">
                  <MediaImage src={video.image} alt={video.title} sizes="128px" />
                  <span className="absolute bottom-1.5 right-1.5 rounded bg-black/75 px-1.5 py-0.5 text-[10px] text-white">
                    {video.duration}
                  </span>
                </div>
                <div className="min-w-0">
                  <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-white group-hover:text-brand">
                    {video.title}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-400">{formatDisplayDate(video.posted)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 lg:grid-cols-4">
          {(replayGrid.length ? replayGrid : videos.slice(0, 4)).map((video) => (
            <VideoCard key={video.id} video={video} className="max-w-none" />
          ))}
        </div>
      </SiteWrap>

      <SiteWrap className="pb-12">
        <SectionHeading title="Our Shorts" href="/shorts" />
        <ShortsRow items={apiShorts.length ? apiShorts : shorts} />
      </SiteWrap>

      <SiteWrap>
        <SectionHeading title="Most popular videos" href="/programmes" />
        <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
          {(sliders.length ? sliders.slice(4, 8) : popularVideos).map((video) => (
            <VideoCard key={video.id} video={video} className="max-w-none" />
          ))}
        </div>
      </SiteWrap>
    </div>
  );
}
