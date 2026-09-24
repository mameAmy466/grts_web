import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { IconArrowRight } from "@/components/icons";
import { SiteWrap } from "@/components/media-image";
import { ReplayPlayer } from "@/components/replay-player";
import { ReplayVideoCard } from "@/components/replay-video-card";
import { UpNextPanel } from "@/components/up-next-panel";
import { getTveReplayById } from "@/lib/api/tve";

export const revalidate = 600; // REVALIDATE_CATEGORY

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const data = await getTveReplayById(slug);
  return { title: data?.current.title ?? "Replay TV" };
}

export default async function ReplayTvPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const data = await getTveReplayById(slug);
  if (!data) notFound();

  const episode = data.current;
  const others = data.related;

  return (
    <div className="pb-20 pt-8">
      <SiteWrap>
        <div className="grid w-full items-stretch gap-6 border-b border-[var(--color-text-disabled,#525252)] pb-8 md:grid-cols-12 md:gap-8">
          <div className="flex h-full min-h-0 flex-col md:col-span-7 lg:col-span-8">
            <ReplayPlayer episode={episode} />
          </div>
          <div className="flex max-h-[360px] min-h-0 flex-col md:col-span-5 md:max-h-none lg:col-span-4">
            <UpNextPanel episodes={others.slice(0, 7)} />
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
          {others.slice(0, 8).map((item) => (
            <ReplayVideoCard key={item.id} episode={item} />
          ))}
        </div>
      </SiteWrap>
    </div>
  );
}
