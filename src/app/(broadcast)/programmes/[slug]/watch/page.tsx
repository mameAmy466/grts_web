import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IconArrowRight } from "@/components/icons";
import { SiteWrap } from "@/components/media-image";
import { ReplayPlayer } from "@/components/replay-player";
import { ReplayVideoCard } from "@/components/replay-video-card";
import { UpNextPanel } from "@/components/up-next-panel";
import { getTveEpisodes, getTveShow, getVideoPlayback, programEpisodeFeed } from "@/lib/api/tve";
import { getProgramme, getReplay, relatedReplays, upNextEpisodes } from "@/lib/programmes";

export const revalidate = 60;

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ e?: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { e } = await searchParams;
  const program = (await getTveShow(slug)) ?? getProgramme(slug);
  const episodes = await getTveEpisodes(programEpisodeFeed(program), slug);
  const current = episodes.find((item) => item.id === e) ?? episodes[0];
  return { title: current?.title ?? getReplay(slug)?.title ?? "Replay" };
}

export default async function ProgrammeReplayPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ e?: string }>;
}) {
  const { slug } = await params;
  const { e } = await searchParams;
  const program = (await getTveShow(slug)) ?? getProgramme(slug);
  const apiEpisodes = await getTveEpisodes(programEpisodeFeed(program), slug);
  const fallback = getReplay(slug);
  const current = apiEpisodes.find((item) => item.id === e) ?? apiEpisodes[0] ?? fallback;
  if (!program || !current) notFound();

  const streamUrl =
    current.streamUrl || (current.streamFeedUrl ? await getVideoPlayback(current.streamFeedUrl) : "");
  const episode = { ...current, streamUrl };
  const upNext = apiEpisodes.slice(1, 6);
  const related = apiEpisodes.slice(1, 9);

  return (
    <div className="pb-20 pt-8">
      <SiteWrap className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <ReplayPlayer episode={episode} />
        </div>
        <div className="lg:col-span-4">
          <UpNextPanel episodes={upNext.length ? upNext : upNextEpisodes(slug)} />
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
        <div className="grid justify-start gap-4 [grid-template-columns:repeat(auto-fill,209px)]">
          {(related.length ? related : relatedReplays(slug)).map((item) => (
            <ReplayVideoCard key={item.id} episode={item} />
          ))}
        </div>
      </SiteWrap>
    </div>
  );
}
