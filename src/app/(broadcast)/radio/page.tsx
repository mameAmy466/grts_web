import type { Metadata } from "next";
import { SectionHeading } from "@/components/cards";
import { SiteWrap } from "@/components/media-image";
import { FmNowPlaying, FmPlayerBar } from "@/components/players";
import { RadioEpisodes } from "@/components/radio-episodes";
import { getLiveRadios } from "@/lib/api/tve";
import { episodes } from "@/lib/data";
import type { RadioStation } from "@/lib/types";

export const metadata: Metadata = {
  title: "GRTS FM",
};

export const revalidate = 600; // REVALIDATE_CATEGORY

export default async function RadioPage() {
  const radios = await getLiveRadios();
  const current = radios[0];
  const fallbackStation: RadioStation = {
    id: current?.slug || current?.title || "grts-radio",
    title: current?.title || "GRTS Radio",
    description: current?.desc || "National Radio - Gambia",
    streamUrl: current?.stream_url || "",
    image: current?.hd_logo || current?.sd_logo || "",
  };
  const radioEpisodes = radios.length
    ? radios.slice(0, 8).map((radio) => ({
        id: radio.slug || radio.title,
        title: radio.title,
        category: "Radio",
        duration: "Live",
        href: "/radio",
        image: radio.hd_logo || radio.sd_logo || "",
        station: {
          id: radio.slug || radio.title,
          title: radio.title || "GRTS Radio",
          description: radio.desc || "National Radio - Gambia",
          streamUrl: radio.stream_url || "",
          image: radio.hd_logo || radio.sd_logo || "",
        } satisfies RadioStation,
      }))
    : episodes.map((episode) => ({
        ...episode,
        image: episode.image || fallbackStation.image,
        station: fallbackStation,
      }));

  return (
    <div className="bg-[#0d0d0d] pb-20">
      <section className="bg-[#171717]">
        <div className="mx-auto flex min-h-[294px] w-full max-w-[1514px] flex-col justify-center gap-8 px-4 py-7 sm:px-6 lg:flex-row lg:items-center lg:gap-[88px] lg:px-16 xl:px-[185px]">
          <div className="min-w-0 flex-1">
            <h1 className="text-4xl font-bold tracking-tight text-zinc-300 md:text-5xl">
              GRTS FM
            </h1>
            <p className="mt-2 flex items-center text-3xl font-bold text-white md:text-4xl">
              106
              <span className="mx-1.5 inline-block h-3 w-3 rounded-full bg-brand md:h-3.5 md:w-3.5" />
              7 FM
            </p>
            <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-400">
              {current?.desc ||
                "Broadcasting live from Banjul. Bringing you the absolute best in national news, African sports, culture development, and high-fidelity sound."}
            </p>
          </div>
          <div className="w-full shrink-0 lg:w-[460px]">
            <FmNowPlaying image={current?.hd_logo || current?.sd_logo} />
          </div>
        </div>
      </section>

      <FmPlayerBar
        streamUrl={current?.stream_url}
        title={current?.title ?? "Morning Show"}
        image={current?.hd_logo || current?.sd_logo}
      />

      <SiteWrap className="pt-12">
        <SectionHeading title="Recent Episodes" />
        <RadioEpisodes items={radioEpisodes} />
      </SiteWrap>
    </div>
  );
}
