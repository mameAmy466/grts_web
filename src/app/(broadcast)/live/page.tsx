import type { Metadata } from "next";
import { SectionHeading, VideoCard } from "@/components/cards";
import { SiteWrap } from "@/components/media-image";
import { LiveRadioCard, LiveVideoPlayer, StickyRadioBar } from "@/components/players";
import { ProgramGuide } from "@/components/program-guide";
import { getLivePlayback, getLiveTvChannels, getTveGuideSlots, getTveSliders } from "@/lib/api/tve";
import { latestVideos } from "@/lib/data";

export const metadata: Metadata = {
  title: "Live",
};

export const revalidate = 60;

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
    <div className="pb-28">
      <SiteWrap className="py-10">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <LiveVideoPlayer
              src={stream}
              poster={channel?.logo_url || channel?.logo}
              title={channel ? `${channel.title} — Live` : "GRTS TV — Live Broadcast"}
            />
            <LiveRadioCard />
          </div>
          <div className="lg:col-span-4">
            <ProgramGuide todaySlots={guide} />
          </div>
        </div>
      </SiteWrap>

      <SiteWrap>
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
