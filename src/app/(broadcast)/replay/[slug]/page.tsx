import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ReplayWatch } from "@/components/replay-watch";
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

  return <ReplayWatch episode={data.current} others={data.related} />;
}
