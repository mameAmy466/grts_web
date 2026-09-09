import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IconArrowRight } from "@/components/icons";
import { SiteWrap } from "@/components/media-image";
import { ReplayPlayer } from "@/components/replay-player";
import { ReplayVideoCard } from "@/components/replay-video-card";
import { UpNextPanel } from "@/components/up-next-panel";
import { getTveReplayEpisodes, getVideoPlayback } from "@/lib/api/tve";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const episodes = await getTveReplayEpisodes();
  const current = episodes.find((item) => item.id === slug);
  return { title: current?.title ?? "Replay TV" };
}

export default async function ReplayTvPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const episodes = await getTveReplayEpisodes();
  const current = episodes.find((item) => item.id === slug);
  if (!current) notFound();

  const streamUrl =
    current.streamUrl || (current.streamFeedUrl ? await getVideoPlayback(current.streamFeedUrl) : "");
  const episode = { ...current, streamUrl };
  const others = episodes.filter((item) => item.id !== slug);

  return (
    <div className="pb-20 pt-8">
      <SiteWrap className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <ReplayPlayer episode={episode} />
        </div>
        <div className="lg:col-span-4">
          <UpNextPanel episodes={others.slice(0, 5)} />
        </div>
      </SiteWrap>

      <SiteWrap className="mt-14">
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold text-white">Related Videos</h2>
          <Link
            href="/programmes"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-brand"
          >
            View all programs
            <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid justify-start gap-3 [grid-template-columns:repeat(auto-fill,263px)]">
          {others.slice(0, 8).map((item) => (
            <ReplayVideoCard key={item.id} episode={item} />
          ))}
        </div>
      </SiteWrap>
    </div>
  );
}
