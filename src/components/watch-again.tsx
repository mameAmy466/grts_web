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
          : "inline-flex items-center gap-1.5 rounded-full bg-fg/10 px-2.5 py-1 text-[11px] font-medium text-fg-soft"
      }
    >
      <span className="h-1.5 w-1.5 rounded-full bg-brand" />
      {label}
    </span>
  );
}

export function WatchAgain({ videos }: { videos: VideoItem[] }) {
  const featured = videos[0];
  const latest = videos.slice(1, 5);
  const more = videos.slice(5);
  const pages = Math.max(1, Math.ceil(more.length / PAGE_SIZE));
  const [page, setPage] = useState(0);
  const visible = more.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  if (!featured) return null;

  return (
    <section>
      <SectionHeading title="Watch Again" href="/programmes" />

      <div className="grid min-w-0 items-stretch gap-4 md:grid-cols-12 md:gap-3">
        <Link
          href={featured.href}
          className="group relative block h-full min-h-[220px] overflow-hidden rounded-xl bg-surface sm:min-h-[360px] md:col-span-7 md:min-h-[420px]"
        >
          <div className="absolute inset-0 overflow-hidden">
            <MediaImage src={featured.image} alt={featured.title} />
          </div>
          <div className="featured-card-glass absolute inset-x-0 bottom-0 z-10 flex items-center text-white backdrop-blur-[18px]">
            <span className="btn-glass-dark flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white transition group-hover:scale-105 md:h-16 md:w-16">
              <IconPlay className="ml-0.5 h-5 w-5 md:ml-1 md:h-7 md:w-7" />
            </span>
            <div className="flex min-w-0 flex-col items-start gap-1 md:gap-1.5">
              <CategoryPill label={featured.category} />
              <h3 className="line-clamp-2 text-base font-semibold leading-snug sm:text-xl md:text-[28px]">
                {featured.title}
              </h3>
              <p className="line-clamp-1 text-xs text-white/70 sm:text-sm">{videoMeta(featured)}</p>
            </div>
          </div>
        </Link>

        {latest.length ? (
          <div className="card-glass flex min-w-0 flex-col rounded-[20px] p-4 backdrop-blur-xl md:col-span-5 md:h-full sm:p-5 md:p-6">
            <h3 className="text-xl font-semibold text-fg">Latest videos</h3>
            <div className="mt-4 flex min-h-0 flex-1 flex-col gap-3">
              {latest.map((video) => (
                <Link
                  key={video.id}
                  href={video.href}
                  className="group flex min-h-0 flex-1 items-center gap-3"
                >
                  <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-md bg-skeleton">
                    <MediaImage src={video.image} alt={video.title} sizes="140px" />
                    <PlayBadge className="absolute bottom-1.5 left-1.5 h-7 w-7" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="line-clamp-3 text-sm font-semibold leading-snug text-fg group-hover:text-brand">
                      {video.title}
                    </h4>
                    {video.views ? (
                      <p className="mt-1 text-sm font-semibold text-fg">{video.views}</p>
                    ) : null}
                    <p className="mt-1 text-xs text-zinc-500">
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
            <h3 className="text-xl font-semibold text-fg">More replays</h3>
            {pages > 1 ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  aria-label="Previous replays"
                  onClick={() => setPage((value) => Math.max(0, value - 1))}
                  disabled={page === 0}
                  className="btn-chrome flex h-9 w-9 items-center justify-center rounded-full text-fg disabled:opacity-30"
                >
                  <IconArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next replays"
                  onClick={() => setPage((value) => Math.min(pages - 1, value + 1))}
                  disabled={page >= pages - 1}
                  className="btn-chrome flex h-9 w-9 items-center justify-center rounded-full text-fg disabled:opacity-30"
                >
                  <IconArrowRight className="h-4 w-4" />
                </button>
              </div>
            ) : null}
          </div>

          <div className="grid grid-cols-2 items-stretch justify-items-stretch gap-3 md:grid-cols-4 md:gap-4">
            {visible.map((video) => {
              const blurb = videoBlurb(video);
              return (
                <Link key={video.id} href={video.href} className="group block overflow-hidden rounded-[20px] bg-surface p-3">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-skeleton">
                    <MediaImage src={video.image} alt={video.title} sizes="(min-width: 1024px) 22vw, 50vw" />
                    <PlayBadge className="absolute bottom-3 left-3" />
                  </div>
                  <div className="mt-4 px-1">
                    <CategoryPill label={video.category} tone="dark" />
                    <h4 className="mt-3 line-clamp-2 text-lg font-semibold leading-snug text-fg group-hover:text-brand">
                      {video.title}
                    </h4>
                    {blurb ? (
                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-fg-muted">{blurb}</p>
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
                      : "px-1 hover:text-fg"
                  }
                >
                  {index === page ? <span className="h-2.5 w-2.5 rounded-full bg-fg" /> : index + 1}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
