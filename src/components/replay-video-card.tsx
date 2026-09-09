import Link from "next/link";
import { Duration } from "@/components/cards";
import { MediaImage } from "@/components/media-image";
import type { ReplayEpisode } from "@/lib/types";
import { formatDisplayDate } from "@/lib/utils";

function episodeHref(episode: ReplayEpisode) {
  return episode.href ?? `/programmes/${episode.programSlug}/watch?e=${episode.id}`;
}

export function ReplayVideoCard({ episode }: { episode: ReplayEpisode }) {
  return (
    <Link href={episodeHref(episode)} className="group flex h-[251px] w-[263px] flex-col gap-3">
      <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-zinc-800">
        <MediaImage
          src={episode.image}
          alt={episode.title}
          sizes="263px"
        />
        <Duration value={episode.duration} />
      </div>
      <div className="min-h-0">
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-white group-hover:text-brand">
          {episode.title}
        </h3>
        <p className="mt-1 text-xs text-zinc-500">{formatDisplayDate(episode.posted)}</p>
      </div>
    </Link>
  );
}

export function UpNextRow({ episode }: { episode: ReplayEpisode }) {
  return (
    <Link href={episodeHref(episode)} className="group flex gap-3">
      <div className="relative h-[72px] w-[118px] shrink-0 overflow-hidden rounded-md bg-zinc-800">
        <MediaImage src={episode.image} alt={episode.title} sizes="118px" />
        <Duration value={episode.duration} className="text-[10px]" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-brand">{episode.category}</p>
        <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-white group-hover:text-brand">
          {episode.title}
        </h3>
      </div>
    </Link>
  );
}
