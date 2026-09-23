"use client";

import { useState } from "react";
import { AutoplayToggle } from "@/components/replay-player";
import { UpNextRow } from "@/components/replay-video-card";
import type { ReplayEpisode } from "@/lib/types";

export function UpNextPanel({ episodes }: { episodes: ReplayEpisode[] }) {
  const [autoplay, setAutoplay] = useState(true);

  return (
    <aside className="flex h-full min-h-0 w-full flex-1 flex-col rounded-xl border border-white/10 bg-[#141414] p-4">
      <div className="mb-4 flex shrink-0 items-center justify-between">
        <h2 className="text-lg font-bold text-white">Up Next</h2>
        <AutoplayToggle enabled={autoplay} onChange={setAutoplay} />
      </div>
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto">
        {episodes.map((episode) => (
          <UpNextRow key={episode.id} episode={episode} />
        ))}
      </div>
    </aside>
  );
}
