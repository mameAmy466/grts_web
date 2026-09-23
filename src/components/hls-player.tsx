"use client";

import Hls from "hls.js";
import { useEffect, useRef } from "react";

type HlsPlayerProps = {
  src?: string;
  poster?: string;
  className?: string;
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  live?: boolean;
  onReady?: () => void;
  onError?: (message: string) => void;
  ref?: React.Ref<HTMLVideoElement>;
};

function assignRef<T>(ref: React.Ref<T> | undefined, value: T | null) {
  if (!ref) return;
  if (typeof ref === "function") ref(value);
  else ref.current = value;
}

export function HlsPlayer({
  src,
  poster,
  className,
  controls = false,
  autoPlay = false,
  muted = false,
  live = false,
  onReady,
  onError,
  ref,
}: HlsPlayerProps) {
  const localRef = useRef<HTMLVideoElement | null>(null);
  const onReadyRef = useRef(onReady);
  const onErrorRef = useRef(onError);
  onReadyRef.current = onReady;
  onErrorRef.current = onError;

  useEffect(() => {
    const video = localRef.current;
    if (!video || !src) return;

    const ready = () => onReadyRef.current?.();
    const fail = (message: string) => onErrorRef.current?.(message);
    const tryPlay = () => {
      if (!autoPlay) return;
      void video.play().catch(() => undefined);
    };

    video.addEventListener("playing", ready);
    video.addEventListener("loadeddata", ready);
    const resume = () => {
      if (live && video.paused && autoPlay) void video.play().catch(() => undefined);
    };
    video.addEventListener("waiting", resume);
    const onVideoError = () => fail(video.error?.message || "Live stream unavailable");
    video.addEventListener("error", onVideoError);

    if (Hls.isSupported() && src.includes(".m3u8")) {
      const instance = new Hls({
        enableWorker: true,
        lowLatencyMode: live,
        backBufferLength: live ? 30 : 90,
        liveSyncDurationCount: 2,
        liveMaxLatencyDurationCount: 6,
        startLevel: live ? 0 : -1,
        capLevelToPlayerSize: true,
        maxBufferLength: live ? 8 : 30,
        maxMaxBufferLength: live ? 15 : 60,
        manifestLoadingTimeOut: 8000,
        levelLoadingTimeOut: 8000,
        fragLoadingTimeOut: 10000,
        manifestLoadingMaxRetry: 3,
        levelLoadingMaxRetry: 3,
      });
      instance.loadSource(src);
      instance.attachMedia(video);
      instance.on(Hls.Events.MANIFEST_PARSED, tryPlay);
      instance.on(Hls.Events.ERROR, (_event, data) => {
        if (!data.fatal) return;
        if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
          instance.startLoad();
          return;
        }
        if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
          instance.recoverMediaError();
          return;
        }
        fail(data.details || "Live stream unavailable");
      });

      return () => {
        video.removeEventListener("playing", ready);
        video.removeEventListener("loadeddata", ready);
        video.removeEventListener("waiting", resume);
        video.removeEventListener("error", onVideoError);
        instance.destroy();
      };
    }

    if (video.canPlayType("application/vnd.apple.mpegurl") || !src.includes(".m3u8")) {
      video.src = src;
      tryPlay();
      return () => {
        video.removeEventListener("playing", ready);
        video.removeEventListener("loadeddata", ready);
        video.removeEventListener("waiting", resume);
        video.removeEventListener("error", onVideoError);
      };
    }

    fail("This browser cannot play the live stream");
    return () => {
      video.removeEventListener("playing", ready);
      video.removeEventListener("loadeddata", ready);
      video.removeEventListener("waiting", resume);
      video.removeEventListener("error", onVideoError);
    };
  }, [src, autoPlay, live]);

  return (
    <video
      ref={(node) => {
        localRef.current = node;
        assignRef(ref, node);
      }}
      poster={live ? undefined : poster}
      controls={controls}
      autoPlay={autoPlay}
      muted={muted}
      playsInline
      preload="auto"
      className={className ?? "h-full w-full object-cover"}
    />
  );
}
