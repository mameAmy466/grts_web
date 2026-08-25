import type { Metadata } from "next";
import { EpisodeCard, SectionHeading } from "@/components/cards";
import { SiteWrap } from "@/components/media-image";
import { FmNowPlaying, FmPlayerBar } from "@/components/players";
import { getLiveRadios } from "@/lib/api/tve";
import { episodes } from "@/lib/data";

export const metadata: Metadata = {
  title: "GRTS FM",
};

export const revalidate = 120;

export default async function RadioPage() {
  const radios = await getLiveRadios();
  const current = radios[0];
  const radioEpisodes = radios.slice(0, 8).map((radio) => ({
    id: radio.slug || radio.title,
    title: radio.title,
    category: "Radio",
    duration: "Live",
    href: "/radio",
  }));

  return (
    <div className="bg-[#0d0d0d] pb-20">
      <SiteWrap className="py-12 md:py-16">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h1 className="text-5xl font-bold tracking-tight text-white md:text-6xl">
              {current?.title ?? "GRTS FM"}
            </h1>
            <p className="mt-2 text-3xl font-semibold text-white">106.7 FM</p>
            <p className="mt-4 max-w-md text-sm leading-7 text-zinc-400">
              {current?.desc ||
                "Broadcasting from Banjul — news, conversation, music and community programmes on Radio Gambia, across the country."}
            </p>
          </div>
          <FmNowPlaying />
        </div>
        <div className="mt-8">
          <FmPlayerBar
            streamUrl={current?.stream_url}
            title={current?.title ?? "Morning Show"}
            image={current?.hd_logo || current?.sd_logo}
          />
        </div>
      </SiteWrap>

      <SiteWrap>
        <SectionHeading title="Recent Episodes" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {(radioEpisodes.length ? radioEpisodes : episodes).map((episode) => (
            <EpisodeCard key={episode.id} episode={episode} />
          ))}
        </div>
      </SiteWrap>
    </div>
  );
}
