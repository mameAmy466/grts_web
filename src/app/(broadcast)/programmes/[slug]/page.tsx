import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PlayBadge, SectionHeading, VideoCard } from "@/components/cards";
import { ProgramCard } from "@/components/program-card";
import { MediaImage, SiteWrap } from "@/components/media-image";
import { getTveEpisodes, getTveProgramCatalog, getTveShow } from "@/lib/api/tve";
import { getProgramme, relatedProgrammes } from "@/lib/programmes";

export const dynamic = "force-dynamic";

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

  const apiEpisodes = await getTveEpisodes(program.feedUrl, program.slug);
  const { programmes: catalog } = await getTveProgramCatalog();
  const related = catalog.length
    ? catalog
        .filter((item) => item.slug !== program.slug)
        .filter((item, index, list) => list.findIndex((entry) => entry.slug === item.slug) === index)
        .slice(0, 5)
    : relatedProgrammes(program.slug);
  const episodeVideos = apiEpisodes.map((item) => ({
    id: item.id,
    title: item.title,
    image: item.image,
    posted: item.posted,
    description: item.about,
    views: item.views,
    duration: item.duration,
    href: `/programmes/${program.slug}/watch?e=${item.id}`,
    streamUrl: item.streamUrl,
  }));
  const watchHref = episodeVideos[0]
    ? `/programmes/${program.slug}/watch?e=${episodeVideos[0].id}`
    : `/programmes/${program.slug}/watch`;

  return (
    <div className="pb-20">
      <section>
        <SiteWrap className="pt-10">
          <div className="w-full pb-10">
          <div className="flex h-auto w-full max-w-[1143px] flex-col items-start gap-6 opacity-100 sm:flex-row sm:items-center sm:gap-8 lg:h-[335px] lg:gap-10">
            <div className="relative mx-auto h-[260px] w-[195px] shrink-0 overflow-hidden rounded-xl bg-zinc-800 sm:mx-0 sm:h-[300px] sm:w-[225px] lg:h-[335px] lg:w-[251px]">
              <MediaImage
                src={program.poster ?? program.image}
                alt={program.title}
                priority
                sizes="251px"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black to-transparent p-4">
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-white">
                  {program.title}
                </p>
              </div>
            </div>
            <div className="min-w-0 flex-1">
              {program.badge ? (
                <span
                  className="inline-block rounded px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white"
                  style={{ backgroundColor: program.badgeColor }}
                >
                  {program.badge}
                </span>
              ) : null}
              <h1 className="mt-3 text-3xl font-bold uppercase tracking-tight text-white sm:mt-4 sm:text-4xl md:text-5xl">
                {program.title}
              </h1>
              {program.description ? (
                <p className="mt-4 text-sm leading-7 text-zinc-300">{program.description}</p>
              ) : null}
              {episodeVideos.length ? (
                <Link
                  href={watchHref}
                  className="mt-6 inline-flex items-center gap-2 rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-hover"
                >
                  <PlayBadge className="h-6 w-6 bg-white text-brand" />
                  Watch now
                </Link>
              ) : null}
            </div>
          </div>
          </div>
        </SiteWrap>
      </section>

      {episodeVideos.length ? (
        <SiteWrap className="py-14">
          <SectionHeading title="Episodes" />
          <div className="grid w-full grid-cols-2 items-stretch justify-items-stretch gap-3 md:grid-cols-4 md:gap-4">
            {episodeVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        </SiteWrap>
      ) : null}

      <SiteWrap>
        <SectionHeading title="More programmes" href="/programmes" />
        <div className="grid w-full grid-cols-2 items-stretch justify-items-stretch gap-3 md:grid-cols-4 md:gap-4">
          {related.map((item) => (
            <ProgramCard key={item.id} program={item} />
          ))}
        </div>
      </SiteWrap>
    </div>
  );
}
