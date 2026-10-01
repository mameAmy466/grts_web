"use client";

import { EpisodeCard } from "@/components/cards";
import { useRadioPlayer } from "@/components/radio-player-provider";
import type { Episode, RadioStation } from "@/lib/types";

export function RadioEpisodes({
  items,
}: {
  items: Array<Episode & { station: RadioStation }>;
}) {
  const radio = useRadioPlayer();

  return (
    <div className="flex flex-wrap gap-4">
      {items.map((item) => {
        const playing = Boolean(radio?.playing && radio.station?.id === item.station.id);
        return (
          <EpisodeCard
            key={item.id}
            episode={item}
            playing={playing}
            onSelect={() => {
              if (!radio) return;
              if (playing) {
                radio.pause();
                return;
              }
              void radio.playStation(item.station);
            }}
          />
        );
      })}
    </div>
  );
}
