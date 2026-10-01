"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { IconArrowRight } from "@/components/icons";
import { SiteWrap } from "@/components/media-image";
import { ReplayPlayer } from "@/components/replay-player";
import { ReplayVideoCard, episodeHref } from "@/components/replay-video-card";
import { UpNextPanel } from "@/components/up-next-panel";
import { relatedReplays, upNextEpisodes } from "@/lib/programmes";
import type { ReplayEpisode } from "@/lib/types";

export function ProgrammeWatch({
  slug,
  episodes,
  fallback,
}: {
  slug: string;
  episodes: ReplayEpisode[];
  fallback: ReplayEpisode | null | undefined;
}) {
  const episodeId = useSearchParams().get("e");
  const current = episodes.find((item) => item.id === episodeId) ?? episodes[0] ?? fallback;
  const [autoplay, setAutoplay] = useState(true);
  if (!current) return null;

  const rest = episodes.filter((item) => item.id !== current.id);
  const queue = rest.slice(0, 7);
  const upNext = [current, ...(queue.length ? queue : upNextEpisodes(slug).filter((item) => item.id !== current.id))];
  const related = rest.slice(0, 8);
  const nextHref = autoplay && queue[0] ? episodeHref(queue[0], true) : undefined;

  return (
    <div className="pb-20 pt-8">
      <SiteWrap>
        <div className="grid w-full items-stretch gap-6 pb-8 md:grid-cols-12 md:gap-8">
          <div className="flex h-full min-h-0 flex-col md:col-span-7 lg:col-span-8">
            <ReplayPlayer episode={current} nextHref={nextHref} />
          </div>
          <div className="flex max-h-[360px] min-h-0 flex-col md:col-span-5 md:max-h-none lg:col-span-4">
            <UpNextPanel
              episodes={upNext}
              playingId={current.id}
              autoplay={queue.length ? autoplay : undefined}
              onAutoplayChange={queue.length ? setAutoplay : undefined}
            />
          </div>
        </div>
      </SiteWrap>

      <SiteWrap className="mt-10 md:mt-14">
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 className="text-xl font-bold text-white md:text-2xl">Related Videos</h2>
          <Link
            href="/programmes"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-brand"
          >
            View all programs
            <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid w-full grid-cols-2 items-stretch justify-items-stretch gap-3 md:grid-cols-4 md:gap-4">
          {(related.length ? related : relatedReplays(slug)).map((item) => (
            <ReplayVideoCard key={item.id} episode={item} />
          ))}
        </div>
      </SiteWrap>
    </div>
  );
}
