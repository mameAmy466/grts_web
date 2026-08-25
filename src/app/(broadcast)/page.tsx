import Link from "next/link";
import {
  NewsGridCard,
  NewsOverlayCard,
  NewsThumbRow,
  PlayBadge,
  SectionHeading,
  ShortCard,
  SideNewsRow,
  VideoCard,
} from "@/components/cards";
import { IconArrowRight } from "@/components/icons";
import { MediaImage, SiteWrap } from "@/components/media-image";
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

import { getTveSliders } from "@/lib/api/tve";
import { getWpPosts } from "@/lib/api/wordpress";
import { formatDisplayDate } from "@/lib/utils";

export const revalidate = 120;

export default async function HomePage() {
  const [posts, sliders] = await Promise.all([getWpPosts({ perPage: 12 }), getTveSliders()]);
  const topNews = posts.slice(0, 4).length ? posts.slice(0, 4) : homeTopNews;
  const featured = posts[0] ?? homeHeadlines.featured;
  const side = posts.slice(1, 4).length ? posts.slice(1, 4) : homeHeadlines.side;
  const grid = posts.slice(4, 8).length ? posts.slice(4, 8) : homeNewsGrid;
  const videos = sliders.length ? sliders : latestVideos;

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
        <div className="grid gap-5 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <NewsOverlayCard article={featured} large />
          </div>
          <div className="flex flex-col justify-between gap-5 lg:col-span-5">
            {side.map((article) => (
              <SideNewsRow key={article.id} article={article} />
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
        <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-white/10 bg-[#161616] px-6 py-6 sm:flex-row sm:items-center">
          <p className="max-w-2xl text-sm leading-6 text-zinc-300">
            <span className="font-bold text-white">YOUR AD HERE.</span> Promote your
            brand on GRTS. TV, digital, and sponsorships — join our national audience.
          </p>
          <Link
            href="/about#contact"
            className="inline-flex items-center gap-2 rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover"
          >
            Contact us
            <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </SiteWrap>

      <SiteWrap className="pb-12">
        <SectionHeading title="Watch Again" href="/programmes" />
        <div className="grid gap-5 lg:grid-cols-12">
          <Link href={watchAgainFeatured.href} className="group relative lg:col-span-7">
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-zinc-800">
              <MediaImage
                src={watchAgainFeatured.image}
                alt={watchAgainFeatured.title}
              />
              <PlayBadge className="absolute left-4 top-4" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-5">
                <h3 className="text-xl font-bold text-white">{watchAgainFeatured.title}</h3>
                <p className="mt-1 text-xs text-zinc-300">
                  {formatDisplayDate(watchAgainFeatured.posted)} · {watchAgainFeatured.duration}
                </p>
              </div>
            </div>
          </Link>
          <div className="flex flex-col justify-between gap-4 lg:col-span-5">
            {watchAgainSide.map((video) => (
              <Link key={video.id} href={video.href} className="group flex gap-3">
                <div className="relative h-24 w-40 shrink-0 overflow-hidden rounded-md bg-zinc-800">
                  <MediaImage src={video.image} alt={video.title} sizes="180px" />
                  <span className="absolute bottom-1.5 right-1.5 rounded bg-black/75 px-1.5 py-0.5 text-[10px] text-white">
                    {video.duration}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold leading-snug text-white group-hover:text-brand">
                    {video.title}
                  </h3>
                  <p className="mt-1 text-xs text-zinc-400">{formatDisplayDate(video.posted)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {videos.slice(0, 4).map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </SiteWrap>

      <SiteWrap className="pb-12">
        <SectionHeading title="Our Shorts" href="/programmes" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {shorts.map((item) => (
            <ShortCard key={item.id} item={item} />
          ))}
        </div>
      </SiteWrap>

      <SiteWrap>
        <SectionHeading title="Most popular videos" href="/programmes" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {(sliders.length ? sliders.slice(4, 8) : popularVideos).map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </SiteWrap>
    </div>
  );
}
