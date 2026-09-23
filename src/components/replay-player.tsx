"use client";

import { useEffect, useState } from "react";
import {
  IconExpand,
  IconPause,
  IconPlay,
  IconShare,
  IconVolume,
} from "@/components/icons";
import { HlsPlayer } from "@/components/hls-player";
import { MediaImage } from "@/components/media-image";
import type { ReplayEpisode } from "@/lib/types";
import { formatDisplayDate, youtubeEmbedUrl } from "@/lib/utils";

function formatTime(total: number) {
  const minutes = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(total % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function ReplayPlayer({ episode }: { episode: ReplayEpisode }) {
  const start = Math.min(12, Math.max(0, episode.durationSeconds - 1));
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(start);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setCurrent((value) => (value >= episode.durationSeconds ? 0 : value + 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [playing, episode.durationSeconds]);

  const progress = (current / episode.durationSeconds) * 100;
  const youtubeSrc = youtubeEmbedUrl(episode.streamUrl);
  const hasStream = Boolean(episode.streamUrl);

  return (
    <div className="flex h-full flex-col">
      <div className="relative rounded-2xl bg-black">
        <div className="relative aspect-video overflow-hidden rounded-2xl">
          {youtubeSrc ? (
            <iframe
              src={youtubeSrc}
              title={episode.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 h-full w-full"
            />
          ) : episode.streamUrl ? (
            <HlsPlayer
              src={episode.streamUrl}
              poster={episode.image}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <MediaImage
              src={episode.image}
              alt={episode.title}
              priority
              sizes="(min-width: 1024px) 66vw, 100vw"
            />
          )}
          {hasStream ? null : <div className="absolute inset-0 bg-black/25" />}
          {hasStream ? null : (
            <button
              type="button"
              aria-label={playing ? "Pause" : "Play"}
              onClick={() => setPlaying((value) => !value)}
              className="absolute inset-0 flex items-center justify-center"
            >
              <span className="btn-glass-dark flex h-16 w-16 items-center justify-center rounded-full text-white">
                <IconPlay className="ml-1 h-7 w-7" />
              </span>
            </button>
          )}
        </div>
        {youtubeSrc ? null : (
          <div className="player-controls-glass absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end text-white backdrop-blur-[18px]">
            <div className="h-1 overflow-hidden rounded-full bg-white/25">
              <div className="h-full rounded-full bg-white" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label={playing ? "Pause" : "Play"}
                onClick={() => setPlaying((value) => !value)}
              >
                {playing ? <IconPause className="h-5 w-5" /> : <IconPlay className="h-5 w-5" />}
              </button>
              <IconVolume className="h-5 w-5" />
              <span className="h-1 w-16 overflow-hidden rounded-full bg-white/20">
                <span className="block h-full w-2/3 bg-white" />
              </span>
              <span className="text-[11px] tabular-nums text-zinc-200">
                {formatTime(current)} / {formatTime(episode.durationSeconds)}
              </span>
              <IconExpand className="ml-auto h-5 w-5" />
            </div>
          </div>
        )}
      </div>

      <div className="mt-5">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded bg-brand px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            {episode.category}
          </span>
          <span className="text-xs text-zinc-400">{formatDisplayDate(episode.published)}</span>
        </div>
        <div className="mt-3 flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold leading-tight text-white md:text-3xl">{episode.title}</h1>
            <p className="mt-2 text-sm text-zinc-400">{episode.views}</p>
          </div>
          <button
            type="button"
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/15 bg-[#1a1a1a] px-4 py-2 text-sm font-medium text-white hover:border-white/30"
          >
            <IconShare className="h-4 w-4" />
            Share
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-[#161616] p-5">
        <h2 className="text-sm font-bold text-white">About this broadcast</h2>
        <p className={`mt-2 text-sm leading-7 text-zinc-400 ${expanded ? "" : "line-clamp-3"}`}>
          {episode.about}
        </p>
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-2 text-sm font-semibold text-brand"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      </div>
    </div>
  );
}

export function AutoplayToggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className="flex items-center gap-2 text-xs font-medium text-zinc-300"
    >
      Autoplay
      <span className={`relative h-5 w-9 rounded-full ${enabled ? "bg-brand" : "bg-zinc-600"}`}>
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${
            enabled ? "left-4" : "left-0.5"
          }`}
        />
      </span>
    </button>
  );
}
