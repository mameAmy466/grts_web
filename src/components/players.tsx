"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconExpand,
  IconPause,
  IconPlay,
  IconRadio,
  IconVolume,
  IconVolumeOff,
} from "@/components/icons";
import { HlsPlayer } from "@/components/hls-player";
import { MediaImage } from "@/components/media-image";
import { useRadioPlayer } from "@/components/radio-player-provider";
import { useAutoHideControls } from "@/components/use-auto-hide-controls";
import { cn, unsplash } from "@/lib/utils";


export function LiveVideoPlayer({
  src,
  poster,
  title = "GRTS TV — Live Broadcast",
  youtubeSrc,
  replay = false,
  loading = false,
  onLive,
}: {
  src?: string;
  poster?: string;
  title?: string;
  youtubeSrc?: string;
  replay?: boolean;
  loading?: boolean;
  onLive?: () => void;
}) {
  const radio = useRadioPlayer();
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const radioPlayingRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(!replay);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState("");
  const streamKey = youtubeSrc || src || "";
  const streamKeyRef = useRef(streamKey);
  const posterSrc = replay ? poster : undefined;
  const hasMedia = Boolean(youtubeSrc || src);
  const waiting = Boolean(!error && (loading || (hasMedia && !youtubeSrc && !started)));
  const unavailable = Boolean(replay && !loading && !hasMedia && !error);
  radioPlayingRef.current = Boolean(radio?.playing);

  useEffect(() => {
    if (streamKeyRef.current === streamKey) return;
    streamKeyRef.current = streamKey;
    setStarted(false);
    setError("");
    setMuted(!replay);
  }, [streamKey, replay]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const sync = () => {
      setPlaying(!video.paused);
      setMuted(video.muted);
    };

    const onPlay = () => {
      if (radioPlayingRef.current) {
        video.pause();
        return;
      }
      sync();
    };

    video.addEventListener("play", onPlay);
    video.addEventListener("pause", sync);
    video.addEventListener("volumechange", sync);
    sync();

    return () => {
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", sync);
      video.removeEventListener("volumechange", sync);
    };
  }, [src]);

  useEffect(() => {
    const pauseVideo = () => videoRef.current?.pause();
    window.addEventListener("grts:pause-video", pauseVideo);
    return () => window.removeEventListener("grts:pause-video", pauseVideo);
  }, []);

  useEffect(() => {
    if (radio?.playing) videoRef.current?.pause();
  }, [radio?.playing]);

  // Hidden after 8 s; hover shows it (in fullscreen: pointer movement).
  const { visible: showBar, fullscreen, handlers: autoHideHandlers } = useAutoHideControls(stageRef);

  async function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      radioPlayingRef.current = false;
      radio?.pause();
      await video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    if (video.muted) {
      radioPlayingRef.current = false;
      radio?.pause();
    }
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
    <div
      ref={stageRef}
      className={cn("relative rounded-2xl bg-black", fullscreen && !showBar && "cursor-none")}
      {...autoHideHandlers}
    >
      <div className="relative aspect-video overflow-hidden rounded-2xl bg-black">
        {youtubeSrc ? (
          <iframe
            src={youtubeSrc}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 h-full w-full"
          />
        ) : src ? (
          <HlsPlayer
            ref={videoRef}
            src={src}
            poster={posterSrc}
            autoPlay
            muted={muted}
            live={!replay}
            onReady={() => {
              setStarted(true);
              setError("");
              if (radioPlayingRef.current) videoRef.current?.pause();
            }}
            onError={(message) => {
              setError(message);
              setStarted(false);
            }}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : null}
        {waiting ? (
          <div className="absolute inset-0 z-[1] flex flex-col items-center justify-center bg-[#0A0A0A]">
            <span className="relative flex h-16 w-16 items-center justify-center">
              <span className="absolute inset-0 animate-ping rounded-full bg-brand/25" />
              <span className="h-12 w-12 animate-spin rounded-full border-2 border-white/15 border-t-brand" />
            </span>
            <p className="mt-5 text-sm font-medium text-white/80">
              {replay ? "Loading replay…" : "Connecting to live…"}
            </p>
          </div>
        ) : null}
        {unavailable ? (
          <div className="absolute inset-0 z-[1] flex flex-col items-center justify-center bg-[#0A0A0A] px-6 text-center">
            {posterSrc ? <MediaImage src={posterSrc} alt={title} className="opacity-40" /> : null}
            <p className="relative text-sm font-medium text-white">Replay unavailable</p>
            <p className="relative mt-2 max-w-sm text-xs text-zinc-400">This edition has no playable stream yet.</p>
          </div>
        ) : null}
        {error && !youtubeSrc ? (
          <div className="absolute inset-0 z-[1] flex flex-col items-center justify-center bg-[#0A0A0A] px-6 text-center">
            <p className="text-sm font-medium text-white">{replay ? "Replay unavailable" : "Live stream unavailable"}</p>
            <p className="mt-2 max-w-sm text-xs text-zinc-400">{error}</p>
            <button
              type="button"
              onClick={() => {
                setError("");
                setStarted(false);
                radioPlayingRef.current = false;
                radio?.pause();
                const video = videoRef.current;
                if (video) void video.play().catch(() => undefined);
              }}
              className="mt-4 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-hover"
            >
              Retry
            </button>
          </div>
        ) : null}
        {replay ? (
          <button
            type="button"
            onClick={onLive}
            className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full bg-brand px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white hover:bg-brand-hover"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            Live
          </button>
        ) : null}
      </div>
      {youtubeSrc ? null : (
        <div
          className={cn(
            "player-controls-glass absolute inset-x-0 bottom-0 z-10 flex items-center text-white backdrop-blur-[18px] transition-opacity duration-300",
            showBar ? "opacity-100" : "pointer-events-none opacity-0",
          )}
        >
          <button
            type="button"
            aria-label={playing ? "Pause" : "Play"}
            onClick={() => void togglePlay()}
            className="btn-glass-dark flex h-9 w-9 items-center justify-center rounded-full"
          >
            {playing ? <IconPause className="h-4 w-4" /> : <IconPlay className="h-4 w-4" />}
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{title}</p>
            <p className="text-[11px] text-zinc-300">{replay ? "Replay" : "Watch in High Definition"}</p>
          </div>
          <button
            type="button"
            aria-label={muted ? "Unmute" : "Mute"}
            onClick={toggleMute}
            className="hidden h-8 w-8 items-center justify-center sm:flex"
          >
            {muted ? <IconVolumeOff className="h-5 w-5" /> : <IconVolume className="h-5 w-5" />}
          </button>
          <span className="btn-glass-dark hidden rounded-full px-2 py-0.5 text-[11px] sm:inline">
            1080p
          </span>
          <button type="button" aria-label="Fullscreen" onClick={toggleFullscreen} className="flex h-8 w-8 items-center justify-center">
            <IconExpand className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}

export function LiveNowCopy({
  title = "Live Now",
  description,
  live = true,
}: {
  title?: string;
  description?: string;
  live?: boolean;
}) {
  return (
    <div className="mt-5">
      <h1 className="flex items-center gap-2 text-2xl font-bold text-fg md:text-3xl">
        {live ? <span className="h-2.5 w-2.5 rounded-full bg-brand" /> : null}
        {title}
      </h1>
      {description ? (
        <p className="mt-2 max-w-2xl text-sm leading-7 text-fg-muted">{description}</p>
      ) : null}
    </div>
  );
}

export function LiveRadioCard() {
  const radio = useRadioPlayer();
  const playing = radio?.playing ?? false;
  const title = radio?.station?.title || "GRTS Radio";

  return (
    <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl bg-surface px-4 py-3">
      <Link href="/radio" className="flex min-w-0 items-center gap-3">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand text-white">
          <IconRadio className="h-5 w-5" />
        </span>
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-2 text-sm font-semibold text-fg">
            {title}
            <span className="rounded bg-brand px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              Live now
            </span>
          </p>
          <p className="mt-0.5 text-xs text-fg-muted">Listen on GRTS FM without using video data</p>
        </div>
      </Link>
      <button
        type="button"
        aria-label={playing ? "Pause radio" : "Play radio"}
        onClick={() => void radio?.toggle()}
        disabled={!radio?.station?.streamUrl}
        className="btn-chrome flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-fg disabled:opacity-40"
      >
        {playing ? <IconPause className="h-5 w-5" /> : <IconPlay className="ml-0.5 h-5 w-5" />}
      </button>
    </div>
  );
}

export function PersistentRadioBar() {
  const radio = useRadioPlayer();
  const pathname = usePathname();
  if (!radio?.station) return null;
  const onRadioPage = pathname === "/radio";
  const onLivePage = pathname === "/live";
  if (onRadioPage || (!onLivePage && !radio.playing)) return null;
  return (
    <>
      {onLivePage ? null : <div className="h-16 shrink-0" aria-hidden />}
      <StickyRadioBar />
    </>
  );
}

export function StickyRadioBar() {
  const radio = useRadioPlayer();
  const playing = radio?.playing ?? false;
  const station = radio?.station;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-subtle/95 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-[1514px] items-center gap-3 px-4 sm:px-8 xl:px-32">
        <button
          type="button"
          aria-label={playing ? "Pause radio" : "Play radio"}
          onClick={() => void radio?.toggle()}
          disabled={!station?.streamUrl}
          className="btn-chrome flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-fg disabled:opacity-40"
        >
          {playing ? <IconPause className="h-4 w-4" /> : <IconPlay className="ml-0.5 h-4 w-4" />}
        </button>
        <Link href="/radio" className="min-w-0">
          <p className="truncate text-sm font-semibold text-fg">
            {station?.title || "GRTS Radio"}{" "}
            <span className="ml-2 rounded bg-brand px-1.5 py-0.5 text-[10px] font-bold text-white">LIVE</span>
          </p>
          <p className="text-[11px] text-fg-muted">{station?.description || "National Radio - Gambia"}</p>
        </Link>
        <Waveform className="hidden flex-1 sm:block" accent={playing} />
        <Link
          href="/radio"
          className="hidden rounded-full border border-fg/15 px-3 py-1.5 text-xs font-medium text-fg hover:border-fg/40 sm:inline"
        >
          Open radio
        </Link>
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
  const radio = useRadioPlayer();
  const playing = radio?.playing ?? false;
  const stationTitle = radio?.station?.title || title;

  return (
    <div className="flex h-[221px] w-full max-w-[460px] flex-col gap-6 rounded-[24px] bg-page p-8">
      <div className="flex items-start justify-between gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-brand px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
          Live now
        </span>
        <span className="text-xs text-zinc-500">{time}</span>
      </div>
      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label={playing ? "Pause radio" : "Play radio"}
          onClick={() => void radio?.toggle()}
          className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-full bg-zinc-700"
        >
          <MediaImage
            src={image || radio?.station?.image || unsplash("photo-1573497019940-1c28c88b4f3e", 300)}
            alt={stationTitle}
            sizes="72px"
          />
          <span className="absolute inset-0 flex items-center justify-center bg-black/25">
            <span className="btn-glass-dark flex h-8 w-8 items-center justify-center rounded-full text-white">
              {playing ? <IconPause className="h-3.5 w-3.5" /> : <IconPlay className="ml-0.5 h-3.5 w-3.5" />}
            </span>
          </span>
        </button>
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-fg">{stationTitle}</h2>
          <p className="mt-1 text-sm leading-6 text-fg-muted">{radio?.station?.description || description}</p>
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
  const radio = useRadioPlayer();
  const playing = radio?.playing ?? false;
  const stationTitle = radio?.station?.title || title;
  const stationImage = radio?.station?.image || image;

  async function toggle() {
    if (radio) {
      await radio.toggle();
      return;
    }
  }

  return (
    <div className="w-full border-t border-line bg-subtle shadow-[0_-8px_24px_#00000030]">
      <div className="mx-auto flex h-auto min-h-[88px] w-full max-w-[1512px] items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-16 xl:px-[180px]">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-[12px] bg-zinc-700">
            <MediaImage
              src={stationImage || unsplash("photo-1475721027785-f74eccf877e2", 200)}
              alt={stationTitle}
              sizes="48px"
            />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-fg">{stationTitle}</p>
            <span className="rounded bg-brand px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
              Live
            </span>
          </div>
        </div>
        <Waveform className="hidden flex-1 lg:block" accent />
        <div className="flex items-center gap-4">
          <RadioVolume className="hidden md:flex" />
          <button
            type="button"
            aria-label={playing ? "Pause" : "Play"}
            onClick={() => void toggle()}
            className="btn-chrome flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-fg"
          >
            {playing ? <IconPause className="h-5 w-5" /> : <IconPlay className="ml-0.5 h-5 w-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}

function RadioVolume({ className }: { className?: string }) {
  const radio = useRadioPlayer();
  if (!radio) return null;
  const silent = radio.muted || radio.volume === 0;
  const level = silent ? 0 : Math.round(radio.volume * 100);

  return (
    <div className={cn("items-center gap-2", className)}>
      <button
        type="button"
        aria-label={silent ? "Unmute radio" : "Mute radio"}
        aria-pressed={silent}
        onClick={radio.toggleMute}
        className="flex h-8 w-8 items-center justify-center rounded-full text-fg-muted hover:text-fg"
      >
        {silent ? <IconVolumeOff className="h-4 w-4" /> : <IconVolume className="h-4 w-4" />}
      </button>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={level}
        onChange={(event) => radio.setVolume(Number(event.target.value) / 100)}
        aria-label="Radio volume"
        aria-valuetext={`${level}%`}
        className="range-slider h-1 w-24 cursor-pointer"
        style={{ "--level": `${level}%` } as CSSProperties}
      />
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
            className={accent && index < 8 ? "w-[3px] rounded-full bg-brand" : "w-[3px] rounded-full bg-fg/35"}
            style={{ height }}
          />
        ))}
      </div>
    </div>
  );
}
