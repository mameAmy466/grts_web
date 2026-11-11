"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { ShortCard } from "@/components/cards";
import { IconChevronLeft, IconChevronRight, IconVolume, IconVolumeOff } from "@/components/icons";
import { MediaImage } from "@/components/media-image";
import type { ShortItem } from "@/lib/types";
import { cn, youtubeEmbedUrl, youtubeVideoId } from "@/lib/utils";

function isFileVideo(url?: string) {
  return !!url && /\.(mp4|webm|m3u8)(\?|$)/i.test(url);
}

function youtubeSrc(url?: string) {
  const id = youtubeVideoId(url);
  if (!id) return "";
  return youtubeEmbedUrl(
    url,
    `&autoplay=1&mute=1&playsinline=1&modestbranding=1&controls=0&loop=1&playlist=${id}&enablejsapi=1`,
  );
}

function commandYouTube(iframe: HTMLIFrameElement | null, func: "mute" | "unMute") {
  iframe?.contentWindow?.postMessage(JSON.stringify({ event: "command", func, args: [] }), "*");
}

export function ShortsPlayer({
  shorts,
  currentId,
}: {
  shorts: ShortItem[];
  currentId: string;
}) {
  const start = Math.max(0, shorts.findIndex((item) => item.id === currentId));
  const [active, setActive] = useState(start);
  const [muted, setMuted] = useState(true);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const slidesRef = useRef<Array<HTMLElement | null>>([]);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const activeRef = useRef(start);

  const scrollTo = useCallback((index: number, behavior: ScrollBehavior = "smooth") => {
    const next = Math.min(Math.max(index, 0), shorts.length - 1);
    const root = scrollerRef.current;
    const slide = slidesRef.current[next];
    if (!root || !slide) return;
    root.scrollTo({ top: slide.offsetTop, behavior });
  }, [shorts.length]);

  useLayoutEffect(() => {
    scrollTo(start, "instant");
  }, [scrollTo, start]);

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting && entry.intersectionRatio >= 0.65)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const index = Number((visible.target as HTMLElement).dataset.index);
        if (Number.isNaN(index) || index === activeRef.current) return;
        activeRef.current = index;
        setActive(index);
        const item = shorts[index];
        if (item) window.history.replaceState(null, "", item.href);
      },
      { root, threshold: [0.65, 0.85] },
    );

    slidesRef.current.forEach((slide) => {
      if (slide) observer.observe(slide);
    });

    return () => observer.disconnect();
  }, [shorts]);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowDown" || event.key === "PageDown") {
        event.preventDefault();
        scrollTo(activeRef.current + 1);
      }
      if (event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault();
        scrollTo(activeRef.current - 1);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [scrollTo]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
    const apply = () => commandYouTube(iframeRef.current, muted ? "mute" : "unMute");
    apply();
    const timer = window.setTimeout(apply, 700);
    return () => window.clearTimeout(timer);
  }, [muted, active]);

  const current = shorts[active];
  if (!current) return null;

  return (
    <div className="grid items-start gap-8 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <div className="relative mx-auto w-full max-w-[420px]">
          <div className="relative overflow-hidden rounded-2xl bg-black">
            <div
              ref={scrollerRef}
              className="shorts-scroller aspect-[9/16] snap-y snap-mandatory overflow-y-auto overscroll-y-contain"
            >
              {shorts.map((item, index) => {
                const playing = index === active;
                const file = isFileVideo(item.videoUrl);
                const embed = youtubeSrc(item.videoUrl);

                return (
                  <section
                    key={item.id}
                    ref={(node) => {
                      slidesRef.current[index] = node;
                    }}
                    data-index={index}
                    className="relative aspect-[9/16] snap-start snap-always"
                  >
                    {playing && file ? (
                      <video
                        ref={videoRef}
                        src={item.videoUrl}
                        autoPlay
                        muted={muted}
                        loop
                        playsInline
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : playing && embed ? (
                      <iframe
                        ref={iframeRef}
                        src={embed}
                        title={item.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="absolute inset-0 h-full w-full"
                      />
                    ) : (
                      <MediaImage src={item.image} alt={item.title} priority={index === start} />
                    )}
                  </section>
                );
              })}
            </div>

            {/* YouTube embeds draw their own volume + menu buttons top-right; only
                direct video files need ours (it would otherwise cover YouTube's menu). */}
            {isFileVideo(current.videoUrl) ? (
              <button
                type="button"
                aria-label={muted ? "Activer le son" : "Couper le son"}
                onClick={() => setMuted((value) => !value)}
                className="btn-glass-dark absolute right-3 top-3 z-10 flex h-10 w-10 items-center justify-center rounded-full text-white"
              >
                {muted ? <IconVolumeOff className="h-5 w-5" /> : <IconVolume className="h-5 w-5" />}
              </button>
            ) : null}
          </div>

          <div className="absolute right-[-3.25rem] top-1/2 hidden -translate-y-1/2 flex-col gap-3 xl:flex">
            <button
              type="button"
              aria-label="Short précédent"
              disabled={active === 0}
              onClick={() => scrollTo(active - 1)}
              className="btn-chrome flex h-11 w-11 items-center justify-center rounded-full text-fg disabled:opacity-30"
            >
              <IconChevronLeft className="h-5 w-5 rotate-90" />
            </button>
            <button
              type="button"
              aria-label="Short suivant"
              disabled={active === shorts.length - 1}
              onClick={() => scrollTo(active + 1)}
              className="btn-chrome flex h-11 w-11 items-center justify-center rounded-full text-fg disabled:opacity-30"
            >
              <IconChevronRight className="h-5 w-5 rotate-90" />
            </button>
          </div>
        </div>

        <div className="mx-auto mt-4 max-w-[420px]">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-brand">{current.category}</p>
          <h1 className="mt-1 text-xl font-bold leading-snug text-fg">{current.title}</h1>
          <p className="mt-1 text-sm text-fg-muted">
            {current.duration} · {active + 1}/{shorts.length}
          </p>
          <div className="mt-4 flex gap-2 xl:hidden">
            <button
              type="button"
              disabled={active === 0}
              onClick={() => scrollTo(active - 1)}
              className="btn-chrome flex-1 rounded-full py-2 text-sm text-fg disabled:opacity-30"
            >
              Précédent
            </button>
            <button
              type="button"
              disabled={active === shorts.length - 1}
              onClick={() => scrollTo(active + 1)}
              className="btn-chrome flex-1 rounded-full py-2 text-sm text-fg disabled:opacity-30"
            >
              Suivant
            </button>
          </div>
        </div>
      </div>

      <aside className="hidden lg:col-span-7 lg:block">
        <h2 className="mb-4 text-lg font-bold text-fg">Les shorts</h2>
        <div className="grid grid-cols-3 justify-items-start gap-2">
          {shorts.map((item, index) => (
            <ShortCard
              key={item.id}
              item={item}
              selected={index === active}
              onSelect={() => scrollTo(index)}
            />
          ))}
        </div>
      </aside>
    </div>
  );
}
