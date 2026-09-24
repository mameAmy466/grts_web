import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IconArrowRight } from "@/components/icons";
import { SiteWrap } from "@/components/media-image";
import { ReplayPlayer } from "@/components/replay-player";
import { ReplayVideoCard } from "@/components/replay-video-card";
import { UpNextPanel } from "@/components/up-next-panel";
import {
  getTveEpisodes,
  getTveShow,
  getVideoPlayback,
  programAsEpisode,
  programEpisodeFeed,
} from "@/lib/api/tve";
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
  if (!program) notFound();
  const own = program.streamUrl ? programAsEpisode(program) : null;
  const episodes = own && !apiEpisodes.some((item) => item.id === own.id) ? [own, ...apiEpisodes] : apiEpisodes;
  const fallback = getReplay(slug);
  const current = episodes.find((item) => item.id === e) ?? episodes[0] ?? fallback;
  if (!current) notFound();

  const streamUrl =
    current.streamUrl || (current.streamFeedUrl ? await getVideoPlayback(current.streamFeedUrl) : "");
  const episode = { ...current, streamUrl };
  const rest = episodes.filter((item) => item.id !== current.id);
  const upNext = rest.slice(0, 7);
  const related = rest.slice(0, 8);

  return (
    <div className="pb-20 pt-8">
      <SiteWrap>
        <div className="grid w-full items-stretch gap-6 border-b border-[var(--color-text-disabled,#525252)] pb-8 md:grid-cols-12 md:gap-8">
          <div className="flex h-full min-h-0 flex-col md:col-span-7 lg:col-span-8">
            <ReplayPlayer episode={episode} />
          </div>
          <div className="flex max-h-[360px] min-h-0 flex-col md:col-span-5 md:max-h-none lg:col-span-4">
            <UpNextPanel episodes={upNext.length ? upNext : upNextEpisodes(slug)} />
          </div>
        </div>
      </SiteWrap>

      <SiteWrap className="mt-10 md:mt-14">
        <div className="mb-5 flex items-end justify-between gap-4">
          <h2 className="text-xl font-bold text-white md:text-2xl">Related Videos</h2>
          <Link
            href="/programmes"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-400 hover:text-brand"
          >
            View all programs
            <IconArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 justify-start gap-3 sm:grid-cols-[repeat(auto-fill,minmax(200px,263px))]">
          {(related.length ? related : relatedReplays(slug)).map((item) => (
            <ReplayVideoCard key={item.id} episode={item} />
          ))}
        </div>
      </SiteWrap>
    </div>
  );
}
