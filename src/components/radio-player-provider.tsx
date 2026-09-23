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
};

const RadioPlayerContext = createContext<RadioPlayerContextValue | null>(null);

function playableStreamUrl(streamUrl: string) {
  if (!streamUrl) return "";
  if (streamUrl.startsWith("http://")) return "/api/radio";
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
  const src = playableStreamUrl(station?.streamUrl || "");
  const srcRef = useRef(src);
  srcRef.current = src;

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "none";
    audioRef.current = audio;
    const sync = () => setPlaying(!audio.paused);
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

  const toggle = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.paused) {
      audio.pause();
      return;
    }
    await play();
  }, [play]);

  const value = useMemo(
    () => ({ station, playing, play, pause, toggle }),
    [station, playing, play, pause, toggle],
  );

  return <RadioPlayerContext.Provider value={value}>{children}</RadioPlayerContext.Provider>;
}

export function useRadioPlayer() {
  return useContext(RadioPlayerContext);
}
