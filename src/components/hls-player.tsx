"use client";

import { useEffect, useRef } from "react";

type HlsPlayerProps = {
  src?: string;
  poster?: string;
  className?: string;
  controls?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
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
  ref,
}: HlsPlayerProps) {
  const localRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = localRef.current;
    if (!video || !src) return;

    const tryPlay = () => {
      if (autoPlay) void video.play().catch(() => undefined);
    };

    if (video.canPlayType("application/vnd.apple.mpegurl") || !src.includes(".m3u8")) {
      video.src = src;
      tryPlay();
      return;
    }

    let cancelled = false;
    let hls: { destroy: () => void } | undefined;

    import("hls.js")
      .then((module) => {
        if (cancelled || !localRef.current) return;
        const Hls = module.default;
        if (!Hls.isSupported()) {
          localRef.current.src = src;
          tryPlay();
          return;
        }
        const instance = new Hls();
        instance.loadSource(src);
        instance.attachMedia(localRef.current);
        instance.on(Hls.Events.MANIFEST_PARSED, tryPlay);
        hls = instance;
      })
      .catch(() => {
        if (localRef.current) {
          localRef.current.src = src;
          tryPlay();
        }
      });

    return () => {
      cancelled = true;
      hls?.destroy();
    };
  }, [src, autoPlay]);

  return (
    <video
      ref={(node) => {
        localRef.current = node;
        assignRef(ref, node);
      }}
      poster={poster}
      controls={controls}
      autoPlay={autoPlay}
      muted={muted}
      playsInline
      className={className ?? "h-full w-full object-cover"}
    />
  );
}
