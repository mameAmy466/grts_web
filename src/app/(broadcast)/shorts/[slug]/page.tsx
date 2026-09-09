import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteWrap } from "@/components/media-image";
import { ShortsPlayer } from "@/components/shorts-player";
import { getTveShorts } from "@/lib/api/tve";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const shorts = await getTveShorts(50);
  const current = shorts.find((item) => item.id === slug);
  return { title: current?.title ?? "Shorts" };
}

export default async function ShortPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const shorts = await getTveShorts(50);
  const current = shorts.find((item) => item.id === slug);
  if (!current) notFound();

  return (
    <div className="pb-16 pt-8">
      <SiteWrap>
        <ShortsPlayer shorts={shorts} currentId={slug} />
      </SiteWrap>
    </div>
  );
}
