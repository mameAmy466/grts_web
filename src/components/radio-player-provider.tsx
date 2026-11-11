"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { RadioStation } from "@/lib/types";

type RadioPlayerContextValue = {
  station: RadioStation | null;
  playing: boolean;
  play: () => Promise<void>;
  pause: () => void;
  toggle: () => Promise<void>;
  playStation: (station: RadioStation) => Promise<void>;
  /** 0–1 */
  volume: number;
  muted: boolean;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
};

const VOLUME_STORAGE_KEY = "grts-radio-volume";

function readStoredVolume() {
  try {
    const value = Number(window.localStorage.getItem(VOLUME_STORAGE_KEY));
    return Number.isFinite(value) && value > 0 && value <= 1 ? value : 1;
  } catch {
    return 1;
  }
}

const RadioPlayerContext = createContext<RadioPlayerContextValue | null>(null);

function playableStreamUrl(streamUrl: string, stationId?: string) {
  if (!streamUrl) return "";
  if (streamUrl.startsWith("http://")) {
    const query = stationId ? `?s=${encodeURIComponent(stationId)}` : "";
    return `/api/radio${query}`;
  }
  return streamUrl;
}

export function RadioPlayerProvider({
  station,
  children,
}: {
  station: RadioStation | null;
  children: ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState<RadioStation | null>(station);
  const [volume, setVolumeState] = useState(1);
  const [muted, setMuted] = useState(false);
  const src = playableStreamUrl(current?.streamUrl || "", current?.id);
  const srcRef = useRef(src);
  srcRef.current = src;

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "none";
    audio.volume = readStoredVolume();
    audioRef.current = audio;
    const sync = () => setPlaying(!audio.paused);
    const syncVolume = () => {
      setVolumeState(audio.volume);
      setMuted(audio.muted);
    };
    audio.addEventListener("volumechange", syncVolume);
    syncVolume();
    audio.addEventListener("play", sync);
    audio.addEventListener("pause", sync);
    audio.addEventListener("ended", sync);
    return () => {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      audio.removeEventListener("play", sync);
      audio.removeEventListener("pause", sync);
      audio.removeEventListener("ended", sync);
      audio.removeEventListener("volumechange", syncVolume);
      audioRef.current = null;
    };
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
  }, []);

  const play = useCallback(async () => {
    const audio = audioRef.current;
    const stream = srcRef.current;
    if (!audio || !stream) return;
    window.dispatchEvent(new Event("grts:pause-video"));
    audio.src = stream;
    await audio.play().catch(() => undefined);
  }, []);

  const playStation = useCallback(async (next: RadioStation) => {
    setCurrent(next);
    srcRef.current = playableStreamUrl(next.streamUrl, next.id);
    await play();
  }, [play]);

  const toggle = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) {
      audio.pause();
      return;
    }
    await play();
  }, [play]);

  const setVolume = useCallback((next: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    const clamped = Math.min(1, Math.max(0, next));
    audio.volume = clamped;
    // Dragging to 0 mutes; dragging back up unmutes.
    audio.muted = clamped === 0;
    if (clamped > 0) {
      try {
        window.localStorage.setItem(VOLUME_STORAGE_KEY, String(clamped));
      } catch {
        // Storage unavailable: the volume still applies for this visit.
      }
    }
  }, []);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.muted && audio.volume === 0) audio.volume = readStoredVolume();
    audio.muted = !audio.muted;
  }, []);

  const value = useMemo(
    () => ({ station: current, playing, play, pause, toggle, playStation, volume, muted, setVolume, toggleMute }),
    [current, playing, play, pause, toggle, playStation, volume, muted, setVolume, toggleMute],
  );

  return <RadioPlayerContext.Provider value={value}>{children}</RadioPlayerContext.Provider>;
}

export function useRadioPlayer() {
  return useContext(RadioPlayerContext);
}
