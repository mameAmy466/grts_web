import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import { ProgrammeWatch } from "@/components/programme-watch";
import { getTveEpisodes, getTveShow, programAsEpisode, programEpisodeFeed } from "@/lib/api/tve";
import { getProgramme, getReplay } from "@/lib/programmes";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const program = (await getTveShow(slug)) ?? getProgramme(slug);
  return { title: program?.title ?? getReplay(slug)?.title ?? "Replay" };
}

export default async function ProgrammeReplayPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = (await getTveShow(slug)) ?? getProgramme(slug);
  if (!program) notFound();
  const apiEpisodes = await getTveEpisodes(program.feedUrl || programEpisodeFeed(program), program.slug);
  const own = program.streamUrl ? programAsEpisode(program) : null;
  const rest = apiEpisodes.filter((item) => !own || item.id !== own.id);
  const episodes = own ? [own, ...rest] : apiEpisodes;
  const fallback = getReplay(slug);
  if (!episodes.length && !fallback) notFound();

  return (
    <Suspense fallback={<div className="h-[70vh] animate-pulse bg-white/5" />}>
      <ProgrammeWatch slug={slug} episodes={episodes} fallback={fallback} />
    </Suspense>
  );
}
