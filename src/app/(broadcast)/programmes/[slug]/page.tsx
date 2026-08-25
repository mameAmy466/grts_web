import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PlayBadge, SectionHeading, VideoCard } from "@/components/cards";
import { ProgramCard } from "@/components/program-card";
import { MediaImage, SiteWrap } from "@/components/media-image";
import { getTveEpisodes, getTveProgramCatalog, getTveShow, getTveShows, programEpisodeFeed } from "@/lib/api/tve";
import { latestVideos } from "@/lib/data";
import { getProgramme, programmes, relatedProgrammes } from "@/lib/programmes";

export const revalidate = 120;

export async function generateStaticParams() {
  const fromApi = await getTveShows();
  const list = fromApi.length ? fromApi : programmes;
  return list.map((program) => ({ slug: program.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const program = (await getTveShow(slug)) ?? getProgramme(slug);
  return { title: program?.title ?? "TV programs" };
}

export default async function ProgrammeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const program = (await getTveShow(slug)) ?? getProgramme(slug);
  if (!program) notFound();

  const apiEpisodes = await getTveEpisodes(programEpisodeFeed(program), program.slug);
  const { programmes: catalog } = await getTveProgramCatalog();
  const related = catalog.length
    ? catalog
        .filter((item) => item.slug !== program.slug)
        .sort((left, right) => Number(right.filter === program.filter) - Number(left.filter === program.filter))
        .filter((item, index, list) => list.findIndex((entry) => entry.slug === item.slug) === index)
        .slice(0, 5)
    : relatedProgrammes(program.slug);
  const episodeVideos = apiEpisodes.length
    ? apiEpisodes.slice(0, 4).map((item) => ({
        id: item.id,
        title: item.title,
        image: item.image,
        posted: item.posted,
        duration: item.duration,
        href: `/programmes/${program.slug}/watch?e=${item.id}`,
      }))
    : latestVideos.slice(0, 4).map((video) => ({
        ...video,
        href: `/programmes/${program.slug}/watch`,
      }));

  return (
    <div className="pb-20">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <MediaImage src={program.image} alt="" priority sizes="100vw" />
          <div className="absolute inset-0 bg-black/75" />
        </div>
        <SiteWrap className="relative grid items-center gap-8 py-16 md:grid-cols-2 md:py-24">
          <div className="relative mx-auto aspect-3/4 w-full max-w-[280px] overflow-hidden rounded-xl border border-white/10 shadow-2xl">
            <MediaImage
              src={program.poster ?? program.image}
              alt={program.title}
              sizes="280px"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent p-4">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-white">
                {program.title}
              </p>
            </div>
          </div>
          <div>
            <span
              className="inline-block rounded px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white"
              style={{ backgroundColor: program.badgeColor }}
            >
              {program.badge}
            </span>
            <h1 className="mt-4 text-4xl font-bold uppercase tracking-tight text-white md:text-5xl">
              {program.title}
            </h1>
            <p className="mt-2 text-sm font-medium text-zinc-300">{program.schedule}</p>
            <p className="mt-4 max-w-lg text-sm leading-7 text-zinc-300">{program.description}</p>
            <Link
              href={`/programmes/${program.slug}/watch`}
              className="mt-6 inline-flex items-center gap-2 rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover"
            >
              <PlayBadge className="h-6 w-6 bg-white text-brand" />
              Watch now
            </Link>
          </div>
        </SiteWrap>
      </section>

      <SiteWrap className="py-14">
        <SectionHeading title="Latest episodes" href="/programmes" />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {episodeVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      </SiteWrap>

      <SiteWrap>
        <SectionHeading title="More programmes" href="/programmes" />
        <div className="grid justify-start gap-4 [grid-template-columns:repeat(auto-fill,209px)]">
          {related.map((item) => (
            <ProgramCard key={item.id} program={item} />
          ))}
        </div>
      </SiteWrap>
    </div>
  );
}
