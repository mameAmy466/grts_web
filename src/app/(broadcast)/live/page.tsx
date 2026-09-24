import type { Metadata } from "next";
import { Suspense } from "react";
import { LiveDesk, LiveLatestVideos } from "@/components/live-desk";
import { ProgramGuide } from "@/components/program-guide";
import { getLivePlayback, getLiveTvChannels, getTveGuideSlots, getTveReplayVideos, getTveSliders } from "@/lib/api/tve";

export const metadata: Metadata = {
  title: "Live",
};

export const revalidate = 20;

const fallbackDescription =
  "Watch GRTS TV live or switch to radio mode. Follow The Gambia's political, economic and social news in real time.";

async function LiveGuide() {
  const guide = await getTveGuideSlots();
  return <ProgramGuide todaySlots={guide} />;
}

async function LiveLatest() {
  const [sliders, replays] = await Promise.all([getTveSliders(), getTveReplayVideos(8)]);
  const withStream = sliders.filter((video) => video.streamUrl);
  return <LiveLatestVideos videos={(withStream.length ? withStream : replays).slice(0, 4)} />;
}

export default async function LivePage() {
  const channels = await getLiveTvChannels();
  const channel = channels[0];
  const stream = channel?.id ? await getLivePlayback(String(channel.id)) : "";

  return (
    <div className="bg-[#0A0A0A] pb-28">
      <Suspense fallback={<div className="h-[70vh] animate-pulse bg-white/5" />}>
      <LiveDesk
        src={stream}
        channelId={channel?.id}
        liveTitle={channel ? `${channel.title} — Live Broadcast` : "GRTS TV — Live Broadcast"}
        liveDescription={channel?.desc || fallbackDescription}
        guide={
          <Suspense fallback={<div className="h-[420px] animate-pulse rounded-xl bg-white/5" />}>
            <LiveGuide />
          </Suspense>
        }
        latest={
          <Suspense fallback={null}>
            <LiveLatest />
          </Suspense>
        }
      />
      </Suspense>
    </div>
  );
}
