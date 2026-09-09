"use client";

import { useEffect, useRef, useState } from "react";
import {
  IconExpand,
  IconPause,
  IconPlay,
  IconRadio,
  IconSettings,
  IconVolume,
  IconVolumeOff,
} from "@/components/icons";
import { HlsPlayer } from "@/components/hls-player";
import { MediaImage } from "@/components/media-image";
import { unsplash } from "@/lib/utils";

export function LiveVideoPlayer({
  src,
  poster,
  title = "GRTS TV — Live Broadcast",
}: {
  src?: string;
  poster?: string;
  title?: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const posterSrc = poster || unsplash("photo-1598550476439-6847785fcea7", 1600);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const sync = () => {
      setPlaying(!video.paused);
      setMuted(video.muted);
    };

    video.addEventListener("play", sync);
    video.addEventListener("pause", sync);
    video.addEventListener("volumechange", sync);
    sync();

    return () => {
      video.removeEventListener("play", sync);
      video.removeEventListener("pause", sync);
      video.removeEventListener("volumechange", sync);
    };
  }, [src]);

  async function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) await video.play().catch(() => undefined);
    else video.pause();
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
  }

  function toggleFullscreen() {
    const video = videoRef.current;
    const webkitVideo = video as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (webkitVideo?.webkitEnterFullscreen && !document.fullscreenEnabled) {
      webkitVideo.webkitEnterFullscreen();
      return;
    }

    const stage = stageRef.current;
    if (!stage) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void stage.requestFullscreen();
  }

  return (
    <div className="overflow-hidden rounded-xl bg-black">
      <div ref={stageRef} className="relative aspect-video bg-black">
        {src ? (
          <HlsPlayer
            ref={videoRef}
            src={src}
            poster={posterSrc}
            autoPlay
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <MediaImage
            src={posterSrc}
            alt={title}
            priority
            sizes="(min-width: 1024px) 66vw, 100vw"
          />
        )}
        <span className="pointer-events-none absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-brand px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          Live now
        </span>
        <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-black/85 to-transparent px-4 py-3 text-white">
          <button
            type="button"
            aria-label={playing ? "Pause" : "Play"}
            onClick={() => void togglePlay()}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10"
          >
            {playing ? <IconPause className="h-4 w-4" /> : <IconPlay className="h-4 w-4" />}
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{title}</p>
            <p className="text-[11px] text-zinc-300">Watch in High Definition</p>
          </div>
          <button
            type="button"
            aria-label={muted ? "Unmute" : "Mute"}
            onClick={toggleMute}
            className="hidden h-8 w-8 items-center justify-center sm:flex"
          >
            {muted ? <IconVolumeOff className="h-5 w-5" /> : <IconVolume className="h-5 w-5" />}
          </button>
          <span className="hidden rounded border border-white/20 px-2 py-0.5 text-[11px] sm:inline">
            1080p
          </span>
          <button type="button" aria-label="Fullscreen" onClick={toggleFullscreen} className="flex h-8 w-8 items-center justify-center">
            <IconExpand className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export function LiveNowCopy({
  title = "Live Now",
  description,
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="mt-5">
      <h1 className="flex items-center gap-2 text-2xl font-bold text-white md:text-3xl">
        <span className="h-2.5 w-2.5 rounded-full bg-brand" />
        {title}
      </h1>
      {description ? (
        <p className="mt-2 max-w-2xl text-sm leading-7 text-zinc-400">{description}</p>
      ) : null}
    </div>
  );
}

export function LiveRadioCard() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl bg-[#111] px-4 py-3">
      <div className="flex min-w-0 items-center gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand text-white">
          <IconRadio className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-white">
            GRTS - Live Radio
            <span className="rounded bg-brand px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide">
              Live now
            </span>
          </p>
          <p className="mt-0.5 text-xs text-zinc-400">Listen to the radio without using video data</p>
        </div>
      </div>
      <button
        type="button"
        aria-label={playing ? "Pause radio" : "Play radio"}
        onClick={() => setPlaying((value) => !value)}
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand text-white"
      >
        {playing ? <IconPause className="h-5 w-5" /> : <IconPlay className="ml-0.5 h-5 w-5" />}
      </button>
    </div>
  );
}

export function StickyRadioBar() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-white/10 bg-[#111]/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1240px] items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          aria-label={playing ? "Pause" : "Play"}
          onClick={() => setPlaying((value) => !value)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-white"
        >
          {playing ? <IconPause className="h-4 w-4" /> : <IconPlay className="ml-0.5 h-4 w-4" />}
        </button>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-white">
            GRTS Radio <span className="ml-2 rounded bg-brand px-1.5 py-0.5 text-[10px] font-bold">LIVE</span>
          </p>
          <p className="text-[11px] text-zinc-400">National Radio - Gambia</p>
        </div>
        <Waveform className="hidden flex-1 sm:block" accent />
        <div className="hidden items-center gap-3 md:flex">
          <IconVolume className="h-4 w-4 text-zinc-400" />
          <span className="h-1 w-16 overflow-hidden rounded-full bg-white/15">
            <span className="block h-full w-2/3 bg-brand" />
          </span>
          <IconSettings className="h-4 w-4 text-zinc-400" />
          <IconExpand className="h-4 w-4 text-zinc-400" />
        </div>
      </div>
    </div>
  );
}

export function FmNowPlaying({
  title = "Morning Show",
  description = "With Malik & Fatouma. News review, national hot topics, and Afro-fusion tunes to wake you up.",
  image,
  time = "08:00 - 12:00 UTC",
}: {
  title?: string;
  description?: string;
  image?: string;
  time?: string;
}) {
  return (
    <div className="flex h-[221px] w-full max-w-[460px] flex-col gap-6 rounded-[24px] bg-[#0A0A0A] p-8">
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          Live now
        </span>
        <span className="text-xs text-zinc-500">{time}</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-full bg-zinc-700">
          <MediaImage
            src={image || unsplash("photo-1573497019940-1c28c88b4f3e", 300)}
            alt={title}
            sizes="72px"
          />
          <span className="absolute inset-0 flex items-center justify-center bg-black/25">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white">
              <IconPlay className="ml-0.5 h-3.5 w-3.5" />
            </span>
          </span>
        </div>
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-white">{title}</h2>
          <p className="mt-1 text-sm leading-6 text-zinc-400">{description}</p>
        </div>
      </div>
    </div>
  );
}

export function FmPlayerBar({
  streamUrl,
  title = "Morning Show",
  image,
}: {
  streamUrl?: string;
  title?: string;
  image?: string;
}) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  async function toggle() {
    if (!streamUrl) {
      setPlaying((value) => !value);
      return;
    }
    if (!audioRef.current) audioRef.current = new Audio();
    if (!playing) {
      audioRef.current.src = streamUrl;
      await audioRef.current.play().catch(() => undefined);
      setPlaying(true);
      return;
    }
    audioRef.current.pause();
    setPlaying(false);
  }

  return (
    <div className="w-full border-t border-[var(--color-bg-primary,#0A0A0A)] bg-[#171717] shadow-[0_-8px_24px_#00000030]">
      <div className="mx-auto flex h-auto min-h-[88px] w-full max-w-[1512px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-16 xl:px-[180px]">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[12px] bg-zinc-700">
            <MediaImage
              src={image || unsplash("photo-1475721027785-f74eccf877e2", 200)}
              alt={title}
              sizes="48px"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-white">{title}</p>
            <span className="rounded bg-brand px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              Live
            </span>
          </div>
        </div>
        <Waveform className="hidden flex-1 lg:block" accent />
        <div className="flex items-center gap-4">
          <div className="hidden items-center gap-2 md:flex">
            <IconVolume className="h-4 w-4 text-zinc-400" />
            <span className="h-1 w-20 overflow-hidden rounded-full bg-white/15">
              <span className="block h-full w-3/4 bg-brand" />
            </span>
          </div>
          <button
            type="button"
            aria-label={playing ? "Pause" : "Play"}
            onClick={() => void toggle()}
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-brand text-white"
          >
            {playing ? <IconPause className="h-5 w-5" /> : <IconPlay className="ml-0.5 h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}

function Waveform({ className, accent = false }: { className?: string; accent?: boolean }) {
  const bars = [8, 16, 24, 14, 28, 12, 22, 18, 30, 10, 20, 26, 14, 22, 12, 28, 16, 24, 10, 20, 18, 26, 12, 22];

  return (
    <div className={className} aria-hidden="true">
      <div className="flex h-8 items-end justify-center gap-[3px]">
        {bars.map((height, index) => (
          <span
            key={`${height}-${index}`}
            className={accent && index < 8 ? "w-[3px] rounded-full bg-brand" : "w-[3px] rounded-full bg-white/35"}
            style={{ height }}
          />
        ))}
      </div>
    </div>
  );
}
