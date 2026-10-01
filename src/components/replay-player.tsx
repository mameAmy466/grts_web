"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  IconExpand,
  IconPause,
  IconPlay,
  IconShare,
  IconVolume,
} from "@/components/icons";
import { HlsPlayer } from "@/components/hls-player";
import { MediaImage } from "@/components/media-image";
import { fetchVideoPlayback } from "@/lib/playback-client";
import type { ReplayEpisode } from "@/lib/types";
import { formatDisplayDate, youtubeEmbedUrl, youtubeVideoId } from "@/lib/utils";

type YtPlayer = {
  loadVideoById: (id: string) => void;
  cueVideoById: (id: string) => void;
  destroy: () => void;
};

type YtApi = {
  Player: new (
    element: HTMLElement,
    options: {
      width?: string | number;
      height?: string | number;
      videoId: string;
      playerVars?: Record<string, string | number>;
      events?: {
        onStateChange?: (event: { data: number }) => void;
      };
    },
  ) => YtPlayer;
  PlayerState: { ENDED: number; PLAYING: number };
};

function loadYoutubeApi() {
  const win = window as Window & { YT?: YtApi; onYouTubeIframeAPIReady?: () => void };
  if (win.YT?.Player) return Promise.resolve(win.YT);
  return new Promise<YtApi>((resolve) => {
    const previous = win.onYouTubeIframeAPIReady;
    win.onYouTubeIframeAPIReady = () => {
      previous?.();
      if (win.YT) resolve(win.YT);
    };
    if (!document.getElementById("youtube-iframe-api")) {
      const script = document.createElement("script");
      script.id = "youtube-iframe-api";
      script.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(script);
    }
  });
}

function YoutubePlayer({
  videoId,
  title,
  autoPlay = false,
  onEnded,
}: {
  videoId: string;
  title: string;
  autoPlay?: boolean;
  onEnded?: () => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YtPlayer | null>(null);
  const videoIdRef = useRef(videoId);
  const onEndedRef = useRef(onEnded);
  const autoPlayRef = useRef(autoPlay);
  const playedRef = useRef(autoPlay);
  const endedRef = useRef(false);
  videoIdRef.current = videoId;
  onEndedRef.current = onEnded;
  autoPlayRef.current = autoPlay;

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;
    let player: YtPlayer | null = null;

    void loadYoutubeApi().then((YT) => {
      if (cancelled || !hostRef.current) return;
      player = new YT.Player(hostRef.current, {
        width: "100%",
        height: "100%",
        videoId: videoIdRef.current,
        playerVars: {
          autoplay: autoPlayRef.current ? 1 : 0,
          enablejsapi: 1,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          origin: window.location.origin,
        },
        events: {
          onStateChange: (event) => {
            if (event.data === YT.PlayerState.PLAYING) {
              playedRef.current = true;
              endedRef.current = false;
            }
            if (event.data === YT.PlayerState.ENDED || event.data === 0) {
              if (endedRef.current) return;
              endedRef.current = true;
              onEndedRef.current?.();
            }
          },
        },
      });
      playerRef.current = player;
    });

    return () => {
      cancelled = true;
      player?.destroy();
      playerRef.current = null;
    };
  }, []);

  useEffect(() => {
    endedRef.current = false;
    const player = playerRef.current;
    if (!player) return;
    if (playedRef.current || autoPlay) player.loadVideoById(videoId);
    else player.cueVideoById(videoId);
  }, [videoId, autoPlay]);

  return (
    <div className="absolute inset-0 h-full w-full [&_iframe]:h-full [&_iframe]:w-full">
      <div ref={hostRef} title={title} className="h-full w-full" />
    </div>
  );
}

function ExpandableText({ text }: { text: string }) {
  const boxRef = useRef<HTMLDivElement>(null);
  const fullRef = useRef<HTMLParagraphElement>(null);
  const [expanded, setExpanded] = useState(false);
  const [overflows, setOverflows] = useState(false);

  useLayoutEffect(() => {
    setExpanded(false);
  }, [text]);

  useLayoutEffect(() => {
    const box = boxRef.current;
    const full = fullRef.current;
    if (!box || !full) return;

    function measure() {
      if (!full) return;
      const lineHeight = parseFloat(getComputedStyle(full).lineHeight) || 28;
      setOverflows(full.scrollHeight > lineHeight * 3 + 1);
    }

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(box);
    observer.observe(full);
    return () => observer.disconnect();
  }, [text]);

  if (!text.trim()) return null;

  return (
    <div ref={boxRef} className="relative mt-2">
      <p
        ref={fullRef}
        aria-hidden
        className="invisible pointer-events-none absolute inset-x-0 text-sm leading-7"
      >
        {text}
      </p>
      <p className={`text-sm leading-7 text-zinc-400 ${expanded ? "" : "line-clamp-3"}`}>
        {text}
      </p>
      {overflows ? (
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="mt-2 text-sm font-semibold text-brand"
        >
          {expanded ? "Show less" : "Show more"}
        </button>
      ) : null}
    </div>
  );
}

function formatTime(total: number) {
  const minutes = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(total % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function ReplayPlayer({
  episode,
  nextHref,
}: {
  episode: ReplayEpisode;
  nextHref?: string;
}) {
  const router = useRouter();
  const start = Math.min(12, Math.max(0, episode.durationSeconds - 1));
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(start);
  const [playbackUrl, setPlaybackUrl] = useState("");
  const [loadingPlayback, setLoadingPlayback] = useState(false);
  const [continueAutoplay, setContinueAutoplay] = useState(false);
  const [shareLabel, setShareLabel] = useState("Share");
  const shareTimer = useRef<number | null>(null);
  const catalogYoutube = youtubeEmbedUrl(episode.streamUrl);
  const youtubeId = youtubeVideoId(episode.streamUrl);
  const autoPlayNext = useSearchParams().get("play") === "1";

  useEffect(() => {
    if (catalogYoutube || !episode.streamFeedUrl) {
      setPlaybackUrl("");
      setLoadingPlayback(false);
      return;
    }
    let cancelled = false;
    setLoadingPlayback(true);
    setPlaybackUrl("");
    void fetchVideoPlayback(episode.streamFeedUrl).then((url) => {
      if (cancelled) return;
      setPlaybackUrl(url);
      setLoadingPlayback(false);
    });
    return () => {
      cancelled = true;
    };
  }, [catalogYoutube, episode.id, episode.streamFeedUrl]);

  useEffect(() => {
    return () => {
      if (shareTimer.current) window.clearTimeout(shareTimer.current);
    };
  }, []);

  useEffect(() => {
    if (!autoPlayNext) return;
    const url = new URL(window.location.href);
    if (!url.searchParams.has("play")) return;
    url.searchParams.delete("play");
    const next = `${url.pathname}${url.search}${url.hash}`;
    window.history.replaceState(window.history.state, "", next);
  }, [autoPlayNext]);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setCurrent((value) => (value >= episode.durationSeconds ? 0 : value + 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [playing, episode.durationSeconds]);

  const progress = (current / episode.durationSeconds) * 100;
  const youtubeSrc = catalogYoutube;
  const streamUrl = youtubeSrc ? "" : playbackUrl || (loadingPlayback ? "" : episode.streamUrl || "");
  const hasStream = Boolean(youtubeSrc || streamUrl || loadingPlayback);

  function playNext() {
    if (nextHref) router.push(nextHref);
  }

  async function shareEpisode() {
    const url = window.location.href;
    const payload = {
      title: episode.title,
      text: episode.title,
      url,
    };
    try {
      if (typeof navigator.share === "function") {
        await navigator.share(payload);
        return;
      }
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
    }
    try {
      await navigator.clipboard.writeText(url);
      if (shareTimer.current) window.clearTimeout(shareTimer.current);
      setShareLabel("Copied");
      shareTimer.current = window.setTimeout(() => setShareLabel("Share"), 2000);
    } catch {
      window.prompt("Copy this link", url);
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="relative rounded-2xl bg-black">
        <div className="relative aspect-video overflow-hidden rounded-2xl">
          {youtubeId ? (
            <YoutubePlayer
              videoId={youtubeId}
              title={episode.title}
              autoPlay={autoPlayNext}
              onEnded={nextHref ? playNext : undefined}
            />
          ) : streamUrl ? (
            <HlsPlayer
              src={streamUrl}
              poster={episode.image}
              autoPlay={continueAutoplay || autoPlayNext}
              onReady={() => setContinueAutoplay(true)}
              onEnded={nextHref ? playNext : undefined}
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
              <span className="btn-glass-dark flex h-12 w-12 items-center justify-center rounded-full text-white md:h-16 md:w-16">
                <IconPlay className="ml-1 h-5 w-5 md:h-7 md:w-7" />
              </span>
            </button>
          )}
        </div>
        {youtubeSrc ? null : (
          <div className="player-controls-glass absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end text-white backdrop-blur-[18px]">
            <div className="h-1 overflow-hidden rounded-full bg-white/25">
              <div className="h-full rounded-full bg-white" style={{ width: `${progress}%` }} />
            </div>
            <div className="flex items-center gap-2 md:gap-3">
              <button
                type="button"
                aria-label={playing ? "Pause" : "Play"}
                onClick={() => setPlaying((value) => !value)}
              >
                {playing ? <IconPause className="h-5 w-5" /> : <IconPlay className="h-5 w-5" />}
              </button>
              <IconVolume className="hidden h-5 w-5 sm:block" />
              <span className="hidden h-1 w-16 overflow-hidden rounded-full bg-white/20 sm:block">
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
        <div className="mt-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl font-bold leading-tight text-white sm:text-2xl md:text-3xl">{episode.title}</h1>
            <p className="mt-2 text-sm text-zinc-400">{episode.views}</p>
          </div>
          <button
            type="button"
            onClick={() => void shareEpisode()}
            className="btn-glass-dark inline-flex shrink-0 items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-white sm:px-4"
          >
            <IconShare className="h-4 w-4" />
            {shareLabel}
          </button>
        </div>
      </div>

      <div className="mt-5 rounded-xl bg-[#161616] p-5">
        <h2 className="text-sm font-bold text-white">About this broadcast</h2>
        <ExpandableText text={episode.about} />
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
