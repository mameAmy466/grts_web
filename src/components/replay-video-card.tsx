import Link from "next/link";
import { Duration } from "@/components/cards";
import { MediaImage } from "@/components/media-image";
import type { ReplayEpisode } from "@/lib/types";
import { formatDisplayDate } from "@/lib/utils";

export function ReplayVideoCard({ episode }: { episode: ReplayEpisode }) {
  return (
    <Link href={`/programmes/${episode.programSlug}/watch?e=${episode.id}`} className="group block w-[209px]">
      <article className="flex h-[285px] w-[209px] flex-col overflow-hidden rounded-[12px] border border-white/15 bg-[#141414] opacity-100">
        <div className="relative h-[168px] shrink-0 overflow-hidden bg-zinc-800">
          <MediaImage
            src={episode.image}
            alt={episode.title}
            sizes="209px"
          />
          <Duration value={episode.duration} />
        </div>
        <div className="flex flex-1 flex-col p-3">
          <p className="text-[11px] uppercase tracking-wide text-zinc-400">{episode.category}</p>
          <h3 className="mt-1 line-clamp-3 text-sm font-bold leading-snug text-white group-hover:text-brand">
            {episode.title}
          </h3>
          <p className="mt-auto pt-2 text-xs text-zinc-500">{formatDisplayDate(episode.posted)}</p>
        </div>
      </article>
    </Link>
  );
}

export function UpNextRow({ episode }: { episode: ReplayEpisode }) {
  return (
    <Link href={`/programmes/${episode.programSlug}/watch?e=${episode.id}`} className="group flex gap-3">
      <div className="relative h-[72px] w-[118px] shrink-0 overflow-hidden rounded-md bg-zinc-800">
        <MediaImage src={episode.image} alt={episode.title} sizes="118px" />
        <Duration value={episode.duration} className="text-[10px]" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-brand">{episode.category}</p>
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-white group-hover:text-brand">
          {episode.title}
        </h3>
        <p className="mt-1 text-xs text-zinc-500">GRTS News</p>
      </div>
    </Link>
  );
}
