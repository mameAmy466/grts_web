"use client";

import { useEffect, useState, type CSSProperties, type RefObject } from "react";
import { IconExpand, IconPause, IconPlay, IconVolume, IconVolumeOff } from "@/components/icons";
import { useRadioPlayer } from "@/components/radio-player-provider";
import { cn } from "@/lib/utils";

const VOLUME_STORAGE_KEY = "grts-video-volume";

function readStoredVolume() {
  try {
    const value = Number(window.localStorage.getItem(VOLUME_STORAGE_KEY));
    return Number.isFinite(value) && value > 0 && value <= 1 ? value : 1;
  } catch {
    return 1;
  }
}

function formatTime(total: number) {
  if (!Number.isFinite(total) || total < 0) return "00:00";
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = Math.floor(total % 60)
    .toString()
    .padStart(2, "0");
  return hours > 0 ? `${hours}:${minutes}:${seconds}` : `${minutes}:${seconds}`;
}

/**
 * Control bar wired to a real <video>: play/pause, seek, volume + mute,
 * elapsed / total time and fullscreen. Meant to sit over the video.
 */
export function VideoControls({
  videoRef,
  stageRef,
  fallbackDuration = 0,
  className,
}: {
  videoRef: RefObject<HTMLVideoElement | null>;
  stageRef: RefObject<HTMLElement | null>;
  /** Shown until the stream reports its own duration. */
  fallbackDuration?: number;
  className?: string;
}) {
  const radio = useRadioPlayer();
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.volume = readStoredVolume();

    const sync = () => {
      setPlaying(!video.paused);
      setTime(video.currentTime);
      setDuration(Number.isFinite(video.duration) ? video.duration : 0);
      setVolume(video.volume);
      setMuted(video.muted);
    };
    const events = ["play", "pause", "timeupdate", "durationchange", "loadedmetadata", "volumechange", "ended"];
    events.forEach((name) => video.addEventListener(name, sync));
    sync();
    return () => events.forEach((name) => video.removeEventListener(name, sync));
  }, [videoRef]);

  const total = duration || fallbackDuration;
  const silent = muted || volume === 0;
  const level = silent ? 0 : Math.round(volume * 100);
  const progress = total > 0 ? Math.min(100, (time / total) * 100) : 0;

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      radio?.pause();
      void video.play().catch(() => undefined);
    } else {
      video.pause();
    }
  }

  function changeVolume(next: number) {
    const video = videoRef.current;
    if (!video) return;
    video.volume = next;
    video.muted = next === 0;
    if (next > 0) {
      try {
        window.localStorage.setItem(VOLUME_STORAGE_KEY, String(next));
      } catch {
        // Storage unavailable: the volume still applies for this visit.
      }
    }
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    if (video.muted && video.volume === 0) video.volume = readStoredVolume();
    video.muted = !video.muted;
  }

  function seek(percent: number) {
    const video = videoRef.current;
    if (!video || !Number.isFinite(video.duration) || video.duration <= 0) return;
    video.currentTime = (percent / 100) * video.duration;
  }

  function toggleFullscreen() {
    const video = videoRef.current as (HTMLVideoElement & { webkitEnterFullscreen?: () => void }) | null;
    if (video?.webkitEnterFullscreen && !document.fullscreenEnabled) {
      video.webkitEnterFullscreen();
      return;
    }
    const stage = stageRef.current;
    if (!stage) return;
    if (document.fullscreenElement) void document.exitFullscreen();
    else void stage.requestFullscreen();
  }

  return (
    <div
      className={cn(
        "player-controls-glass absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end text-white backdrop-blur-[18px]",
        className,
      )}
    >
      <input
        type="range"
        min={0}
        max={100}
        step={0.1}
        value={progress}
        onChange={(event) => seek(Number(event.target.value))}
        disabled={!duration}
        aria-label="Seek"
        aria-valuetext={`${formatTime(time)} / ${formatTime(total)}`}
        className="range-slider on-media h-1 w-full cursor-pointer disabled:cursor-default"
        style={{ "--level": `${progress}%` } as CSSProperties}
      />
      <div className="flex items-center gap-2 md:gap-3">
        <button
          type="button"
          aria-label={playing ? "Pause" : "Play"}
          onClick={togglePlay}
          className="flex h-8 w-8 items-center justify-center"
        >
          {playing ? <IconPause className="h-5 w-5" /> : <IconPlay className="h-5 w-5" />}
        </button>
        <button
          type="button"
          aria-label={silent ? "Unmute" : "Mute"}
          aria-pressed={silent}
          onClick={toggleMute}
          className="flex h-8 w-8 items-center justify-center"
        >
          {silent ? <IconVolumeOff className="h-5 w-5" /> : <IconVolume className="h-5 w-5" />}
        </button>
        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={level}
          onChange={(event) => changeVolume(Number(event.target.value) / 100)}
          aria-label="Volume"
          aria-valuetext={`${level}%`}
          className="range-slider on-media hidden h-1 w-20 cursor-pointer sm:block"
          style={{ "--level": `${level}%` } as CSSProperties}
        />
        <span className="text-[11px] tabular-nums text-zinc-200">
          {formatTime(time)} / {formatTime(total)}
        </span>
        <button
          type="button"
          aria-label="Fullscreen"
          onClick={toggleFullscreen}
          className="ml-auto flex h-8 w-8 items-center justify-center"
        >
          <IconExpand className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
