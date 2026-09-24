"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { SectionHeading, VideoCard } from "@/components/cards";
import { SiteWrap } from "@/components/media-image";
import { LiveNowCopy, LiveRadioCard, LiveVideoPlayer } from "@/components/players";
import { loadLivePlayback } from "@/app/(broadcast)/live/actions";
import type { VideoItem } from "@/lib/types";
import { youtubeEmbedUrl } from "@/lib/utils";

const LiveVideosContext = createContext<(videos: VideoItem[]) => void>(() => undefined);

type LiveDeskProps = {
  channelId?: string;
  src?: string;
  liveTitle: string;
  liveDescription: string;
  latest?: ReactNode;
  guide: ReactNode;
};

export function LiveDesk({
  channelId,
  src: initialSrc = "",
  liveTitle,
  liveDescription,
  latest,
  guide,
}: LiveDeskProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedId = searchParams.get("v");
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const replay = videos.find((video) => video.id === selectedId) ?? null;

  const [stream, setStream] = useState(initialSrc);
  const [loadingStream, setLoadingStream] = useState(!initialSrc && Boolean(channelId));

  useEffect(() => {
    setStream(initialSrc);
    if (initialSrc || !channelId) {
      setLoadingStream(false);
      return;
    }
    let cancelled = false;
    setLoadingStream(true);
    void loadLivePlayback(channelId).then((url) => {
      if (cancelled) return;
      setStream(url);
      setLoadingStream(false);
    });
    return () => {
      cancelled = true;
    };
  }, [channelId, initialSrc]);

  function playVideo(video: VideoItem) {
    router.replace(`${pathname}?v=${video.id}`, { scroll: false });
  }

  function goLive() {
    router.replace(pathname, { scroll: false });
  }

  const youtubeSrc = replay ? youtubeEmbedUrl(replay.streamUrl, "&autoplay=1") : "";
  const replaySrc = youtubeSrc ? "" : replay?.streamUrl || "";

  return (
    <LiveVideosContext.Provider value={setVideos}>
      <SiteWrap className="py-8">
        <div className="w-full border-b border-[var(--color-text-disabled,#525252)] pb-8">
          <div className="grid items-start gap-6 md:grid-cols-12">
            <div className="md:col-span-7 lg:col-span-8">
              <LiveVideoPlayer
                src={replay ? replaySrc : stream}
                youtubeSrc={youtubeSrc || undefined}
                poster={replay?.image}
                title={replay ? replay.title : liveTitle}
                replay={Boolean(replay)}
                loading={!replay && loadingStream}
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

      {latest}

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
    </LiveVideosContext.Provider>
  );
}

export function LiveLatestVideos({ videos }: { videos: VideoItem[] }) {
  const setVideos = useContext(LiveVideosContext);

  useEffect(() => {
    setVideos(videos);
  }, [setVideos, videos]);

  return null;
}
