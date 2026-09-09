import type { Metadata } from "next";
import { SectionHeading, VideoCard } from "@/components/cards";
import { SiteWrap } from "@/components/media-image";
import { LiveNowCopy, LiveRadioCard, LiveVideoPlayer, StickyRadioBar } from "@/components/players";
import { ProgramGuide } from "@/components/program-guide";
import { getLivePlayback, getLiveTvChannels, getTveGuideSlots, getTveSliders } from "@/lib/api/tve";
import { latestVideos } from "@/lib/data";

export const metadata: Metadata = {
  title: "Live",
};

export const revalidate = 60;

const fallbackDescription =
  "Watch GRTS TV live or switch to radio mode. Follow The Gambia's political, economic and social news in real time.";

export default async function LivePage() {
  const [channels, sliders, guide] = await Promise.all([
    getLiveTvChannels(),
    getTveSliders(),
    getTveGuideSlots(),
  ]);
  const channel = channels[0];
  const stream = channel?.id ? await getLivePlayback(channel.id) : "";
  const videos = sliders.length ? sliders.slice(0, 4) : latestVideos.slice(0, 4);

  return (
    <div className="bg-[#0A0A0A] pb-28">
      <SiteWrap className="py-8">
        <div className="grid items-start gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <LiveVideoPlayer
              src={stream}
              poster={channel?.logo_url || channel?.logo}
              title={channel ? `${channel.title} — Live Broadcast` : "GRTS TV — Live Broadcast"}
            />
            <LiveNowCopy
              title="Live Now"
              description={channel?.desc || fallbackDescription}
            />
            <LiveRadioCard />
          </div>
          <div className="lg:col-span-4">
            <ProgramGuide todaySlots={guide} />
          </div>
        </div>
      </SiteWrap>

      <SiteWrap className="border-t border-white/10 pt-8">
        <SectionHeading title="Latest videos" href="/programmes" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </SiteWrap>

      <StickyRadioBar />
    </div>
  );
}
