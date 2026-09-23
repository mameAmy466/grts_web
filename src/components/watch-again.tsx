"use client";

import { useState } from "react";
import Link from "next/link";
import { PlayBadge, SectionHeading } from "@/components/cards";
import { IconArrowLeft, IconArrowRight, IconPlay } from "@/components/icons";
import { MediaImage } from "@/components/media-image";
import type { VideoItem } from "@/lib/types";
import { formatDisplayDate, isRealDuration } from "@/lib/utils";

const PAGE_SIZE = 4;

function videoMeta(video: VideoItem) {
  return [
    formatDisplayDate(video.posted),
    isRealDuration(video.duration) ? video.duration : "",
    video.views,
  ]
    .filter(Boolean)
    .join(" · ");
}

function videoBlurb(video: VideoItem) {
  const description = video.description?.trim();
  if (!description || description.toLowerCase() === video.title.toLowerCase()) return "";
  return description;
}

function CategoryPill({
  label,
  tone = "light",
}: {
  label?: string;
  tone?: "light" | "dark";
}) {
  if (!label) return null;
  return (
    <span
      className={
        tone === "light"
          ? "inline-flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-zinc-900"
          : "inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-medium text-zinc-200"
      }
    >
      <span className="h-1.5 w-1.5 rounded-full bg-brand" />
      {label}
    </span>
  );
}

export function WatchAgain({ videos }: { videos: VideoItem[] }) {
  const featured = videos[0];
  const latest = videos.slice(1, 4);
  const more = videos.slice(4);
  const pages = Math.max(1, Math.ceil(more.length / PAGE_SIZE));
  const [page, setPage] = useState(0);
  const visible = more.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  if (!featured) return null;

  return (
    <section>
      <SectionHeading title="Watch Again" href="/programmes" />

      <div className="grid items-stretch gap-6 lg:grid-cols-[minmax(0,1.45fr)_minmax(280px,0.85fr)]">
        <Link
          href={featured.href}
          className="group relative block h-full min-h-[364px] rounded-2xl bg-[#1a1a1a]"
        >
          <div className="absolute inset-0 overflow-hidden rounded-2xl">
            <MediaImage src={featured.image} alt={featured.title} />
          </div>
          <div className="featured-card-glass absolute inset-x-0 bottom-0 z-10 flex items-center text-white backdrop-blur-[18px]">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border border-white/20 bg-[#00000066] text-white backdrop-blur-[18px] transition group-hover:scale-105">
              <IconPlay className="ml-1 h-7 w-7" />
            </span>
            <div className="flex min-w-0 flex-col items-start gap-1.5">
              <CategoryPill label={featured.category} />
              <h3 className="line-clamp-2 text-2xl font-semibold leading-snug md:text-[28px]">
                {featured.title}
              </h3>
              <p className="text-sm text-white/70">{videoMeta(featured)}</p>
            </div>
          </div>
        </Link>

        {latest.length ? (
          <div className="flex h-full flex-col rounded-[20px] bg-[#1a1a1a] p-5 ring-1 ring-white/8 md:p-6">
            <h3 className="text-xl font-semibold text-white">Latest videos</h3>
            <div className="mt-5 flex flex-1 flex-col justify-between gap-4">
              {latest.map((video) => (
                <Link
                  key={video.id}
                  href={video.href}
                  className="group flex items-center gap-4 rounded-2xl bg-[#242424] p-3"
                >
                  <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-2xl bg-zinc-800">
                    <MediaImage src={video.image} alt={video.title} sizes="72px" />
                    <PlayBadge className="absolute bottom-1.5 left-1.5 h-7 w-7" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-white group-hover:text-brand">
                      {video.title}
                    </h4>
                    {video.views ? (
                      <p className="mt-1 text-sm font-semibold text-white">{video.views}</p>
                    ) : null}
                    <p className="mt-0.5 text-xs text-zinc-500">
                      {[formatDisplayDate(video.posted), isRealDuration(video.duration) ? video.duration : ""]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>

      {visible.length ? (
        <div className="mt-14">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h3 className="text-xl font-semibold text-white">More replays</h3>
            {pages > 1 ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous replays"
                  onClick={() => setPage((value) => Math.max(0, value - 1))}
                  disabled={page === 0}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white disabled:opacity-30"
                >
                  <IconArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next replays"
                  onClick={() => setPage((value) => Math.min(pages - 1, value + 1))}
                  disabled={page >= pages - 1}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white disabled:opacity-30"
                >
                  <IconArrowRight className="h-4 w-4" />
                </button>
              </div>
            ) : null}
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {visible.map((video) => {
              const blurb = videoBlurb(video);
              return (
                <Link key={video.id} href={video.href} className="group block overflow-hidden rounded-[20px] bg-[#1a1a1a] p-3">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-zinc-800">
                    <MediaImage src={video.image} alt={video.title} sizes="(min-width: 1024px) 22vw, 50vw" />
                    <PlayBadge className="absolute bottom-3 left-3" />
                  </div>
                  <div className="mt-4 px-1">
                    <CategoryPill label={video.category} tone="dark" />
                    <h4 className="mt-3 line-clamp-2 text-lg font-semibold leading-snug text-white group-hover:text-brand">
                      {video.title}
                    </h4>
                    {blurb ? (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-zinc-400">{blurb}</p>
                    ) : null}
                    <p className="mt-3 text-xs text-zinc-500">{videoMeta(video)}</p>
                  </div>
                </Link>
              );
            })}
          </div>

          {pages > 1 ? (
            <div className="mt-8 flex items-center justify-center gap-3 text-sm text-zinc-500">
              {Array.from({ length: pages }, (_, index) => (
                <button
                  key={index}
                  type="button"
                  aria-label={`Replay page ${index + 1}`}
                  onClick={() => setPage(index)}
                  className={
                    index === page
                      ? "flex h-6 w-6 items-center justify-center"
                      : "px-1 hover:text-white"
                  }
                >
                  {index === page ? <span className="h-2.5 w-2.5 rounded-full bg-white" /> : index + 1}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
