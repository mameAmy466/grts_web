import type { Metadata } from "next";
import { Suspense } from "react";
import { LiveDesk } from "@/components/live-desk";
import { ProgramGuide } from "@/components/program-guide";
import { getLiveTvChannels, getTveGuideSlots, getTveReplayVideos, getTveSliders } from "@/lib/api/tve";
import type { VideoItem } from "@/lib/types";

export const metadata: Metadata = {
  title: "Live",
};

export const revalidate = 600; // REVALIDATE_CATEGORY

const fallbackDescription =
  "Watch GRTS TV live or switch to radio mode. Follow The Gambia's political, economic and social news in real time.";

function hasPlayback(video: VideoItem) {
  return Boolean(video.streamUrl || video.streamFeedUrl);
}

function pickLatestVideos(sliders: VideoItem[], replays: VideoItem[]) {
  const seen = new Set<string>();
  const videos: VideoItem[] = [];
  const hasStream = (video: VideoItem) => Boolean(video.streamUrl);
  const ordered = [
    ...replays.filter(hasStream),
    ...sliders.filter(hasStream),
    ...replays.filter(hasPlayback),
    ...sliders.filter(hasPlayback),
    ...replays,
    ...sliders,
  ];
  for (const video of ordered) {
    if (!video.id || seen.has(video.id)) continue;
    seen.add(video.id);
    videos.push(video);
    if (videos.length >= 4) break;
  }
  return videos;
}

async function LiveGuide() {
  const guide = await getTveGuideSlots();
  return <ProgramGuide todaySlots={guide} />;
}

export default async function LivePage({
  searchParams,
}: {
  searchParams: Promise<{ v?: string | string[] }>;
}) {
  const [params, channels, sliders, replays] = await Promise.all([
    searchParams,
    getLiveTvChannels(),
    getTveSliders(),
    getTveReplayVideos(8),
  ]);
  const channel = channels[0];
  const videos = pickLatestVideos(sliders, replays);
  const videoId = typeof params.v === "string" ? params.v : params.v?.[0];

  return (
    <div className="bg-[#0A0A0A] pb-28">
      <LiveDesk
        channelId={channel?.id}
        liveTitle={channel ? `${channel.title} — Live Broadcast` : "GRTS TV — Live Broadcast"}
        liveDescription={channel?.desc || fallbackDescription}
        videoId={videoId}
        videos={videos}
        guide={
          <Suspense fallback={<div className="h-[420px] animate-pulse rounded-xl bg-white/5" />}>
            <LiveGuide />
          </Suspense>
        }
      />
    </div>
  );
}
