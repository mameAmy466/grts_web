"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { SectionHeading, VideoCard } from "@/components/cards";
import { SiteWrap } from "@/components/media-image";
import { LiveNowCopy, LiveRadioCard, LiveVideoPlayer } from "@/components/players";
import { fetchLivePlayback, fetchVideoPlayback } from "@/lib/playback-client";
import type { VideoItem } from "@/lib/types";
import { youtubeEmbedUrl } from "@/lib/utils";

type LiveDeskProps = {
  channelId?: string;
  liveTitle: string;
  liveDescription: string;
  videoId?: string;
  videos: VideoItem[];
  guide: ReactNode;
};

function videoById(videos: VideoItem[], id: string | null) {
  if (!id) return null;
  return videos.find((video) => video.id === id) ?? null;
}

function catalogPlayback(video: VideoItem | null) {
  if (!video) return { youtubeSrc: "", src: "", needsFetch: false };
  const youtubeSrc = youtubeEmbedUrl(video.streamUrl, "&autoplay=1");
  if (youtubeSrc) return { youtubeSrc, src: "", needsFetch: false };
  if (video.streamUrl) return { youtubeSrc: "", src: video.streamUrl, needsFetch: false };
  return { youtubeSrc: "", src: "", needsFetch: Boolean(video.streamFeedUrl) };
}

export function LiveDesk({
  channelId,
  liveTitle,
  liveDescription,
  videoId,
  videos,
  guide,
}: LiveDeskProps) {
  const pathname = usePathname();
  const [picked, setPicked] = useState<VideoItem | null>(null);
  const [watchingLive, setWatchingLive] = useState(false);
  const replay = watchingLive ? null : (picked ?? videoById(videos, videoId ?? null));
  const catalog = catalogPlayback(replay);

  const [stream, setStream] = useState("");
  const [loadingStream, setLoadingStream] = useState(Boolean(channelId));
  const [fetchedYoutube, setFetchedYoutube] = useState("");
  const [fetchedSrc, setFetchedSrc] = useState("");
  const [fetchedFor, setFetchedFor] = useState<string | null>(null);

  useEffect(() => {
    if (!channelId) {
      setStream("");
      setLoadingStream(false);
      return;
    }
    let cancelled = false;
    setLoadingStream(true);
    void fetchLivePlayback(channelId).then((url) => {
      if (cancelled) return;
      setStream(url);
      setLoadingStream(false);
    });
    return () => {
      cancelled = true;
    };
  }, [channelId]);

  useEffect(() => {
    if (!replay || !catalog.needsFetch || !replay.streamFeedUrl) {
      setFetchedYoutube("");
      setFetchedSrc("");
      setFetchedFor(replay?.id ?? null);
      return;
    }
    const id = replay.id;
    const feedUrl = replay.streamFeedUrl;
    let cancelled = false;
    setFetchedYoutube("");
    setFetchedSrc("");
    setFetchedFor(null);
    void fetchVideoPlayback(feedUrl).then((url) => {
      if (cancelled) return;
      const youtube = youtubeEmbedUrl(url, "&autoplay=1");
      setFetchedYoutube(youtube);
      setFetchedSrc(youtube ? "" : url);
      setFetchedFor(id);
    });
    return () => {
      cancelled = true;
    };
  }, [replay, catalog.needsFetch]);

  const youtubeSrc = catalog.youtubeSrc || (fetchedFor === replay?.id ? fetchedYoutube : "");
  const replaySrc = catalog.src || (fetchedFor === replay?.id ? fetchedSrc : "");
  const loadingReplay = Boolean(replay && catalog.needsFetch && fetchedFor !== replay.id);

  function setQuery(id?: string) {
    const url = id ? `${pathname}?v=${encodeURIComponent(id)}` : pathname;
    window.history.replaceState(window.history.state, "", url);
  }

  function playVideo(video: VideoItem) {
    setWatchingLive(false);
    setPicked(video);
    setQuery(video.id);
  }

  function goLive() {
    setWatchingLive(true);
    setPicked(null);
    setQuery();
  }

  return (
    <>
      <SiteWrap className="py-8">
        <div className="w-full border-b border-[var(--color-text-disabled,#525252)] pb-8">
          <div className="grid items-start gap-6 md:grid-cols-12">
            <div className="md:col-span-7 lg:col-span-8">
              <LiveVideoPlayer
                key={replay?.id ?? "live"}
                src={replay ? replaySrc : stream}
                youtubeSrc={youtubeSrc || undefined}
                poster={replay?.image}
                title={replay ? replay.title : liveTitle}
                replay={Boolean(replay)}
                loading={replay ? loadingReplay : loadingStream}
                onLive={goLive}
              />
              <LiveNowCopy
                title={replay ? replay.title : "Live Now"}
                description={replay ? undefined : liveDescription}
                live={!replay}
              />
              {replay ? (
                <div className="mt-4">
                  <button
                    type="button"
                    onClick={goLive}
                    className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-hover"
                  >
                    <span className="h-2 w-2 rounded-full bg-white" />
                    Back to live
                  </button>
                </div>
              ) : null}
              <LiveRadioCard />
            </div>
            <div className="md:col-span-5 lg:col-span-4">{guide}</div>
          </div>
        </div>
      </SiteWrap>

      {videos.length ? (
        <SiteWrap className="pt-8">
          <SectionHeading title="Latest videos" href="/programmes" />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                className="max-w-none"
                compact
                selected={video.id === replay?.id}
                onSelect={() => playVideo(video)}
              />
            ))}
          </div>
        </SiteWrap>
      ) : null}
    </>
  );
}
