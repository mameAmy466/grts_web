"use client";

import { AutoplayToggle } from "@/components/replay-player";
import { UpNextRow } from "@/components/replay-video-card";
import type { ReplayEpisode } from "@/lib/types";

export function UpNextPanel({
  episodes,
  playingId,
  autoplay,
  onAutoplayChange,
}: {
  episodes: ReplayEpisode[];
  playingId?: string;
  autoplay?: boolean;
  onAutoplayChange?: (value: boolean) => void;
}) {
  const upcoming = episodes.filter((episode) => episode.id !== playingId);
  const showAutoplay = Boolean(onAutoplayChange) && upcoming.length > 0;

  return (
    <aside className="flex h-full min-h-0 w-full flex-1 flex-col rounded-xl bg-surface p-4">
      <div className="mb-4 flex shrink-0 items-center justify-between">
        <h2 className="text-lg font-bold text-fg">Up Next</h2>
        {showAutoplay ? <AutoplayToggle enabled={autoplay ?? false} onChange={onAutoplayChange!} /> : null}
      </div>
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto">
        {episodes.map((episode) => (
          <UpNextRow key={episode.id} episode={episode} playing={episode.id === playingId} />
        ))}
      </div>
    </aside>
  );
}
