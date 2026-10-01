import Link from "next/link";
import { Duration, PlayBadge } from "@/components/cards";
import { MediaImage } from "@/components/media-image";
import type { ReplayEpisode } from "@/lib/types";
import { cn, formatDisplayDate } from "@/lib/utils";

function episodeHref(episode: ReplayEpisode, autoplay = false) {
  const href = episode.href ?? `/programmes/${episode.programSlug}/watch?e=${episode.id}`;
  if (!autoplay) return href;
  return href.includes("?") ? `${href}&play=1` : `${href}?play=1`;
}

export { episodeHref };

export function ReplayVideoCard({ episode }: { episode: ReplayEpisode }) {
  return (
    <Link href={episodeHref(episode)} className="group flex h-full w-full flex-col gap-3">
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

export function UpNextRow({ episode, playing = false }: { episode: ReplayEpisode; playing?: boolean }) {
  const content = (
    <>
      <div className="relative h-[72px] w-[118px] shrink-0 overflow-hidden rounded-md bg-zinc-800">
        <MediaImage src={episode.image} alt={episode.title} sizes="118px" />
        {playing ? (
          <>
            <div className="absolute inset-0 bg-black/45" />
            <PlayBadge className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2" />
          </>
        ) : (
          <Duration value={episode.duration} className="text-[10px]" />
        )}
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-brand">
          {playing ? "Now playing" : episode.category}
        </p>
        <h3
          className={cn(
            "mt-1 line-clamp-2 text-sm font-semibold leading-snug",
            playing ? "text-white" : "text-white group-hover:text-brand",
          )}
        >
          {episode.title}
        </h3>
        {formatDisplayDate(episode.posted || episode.published) ? (
          <p className="mt-1 text-xs text-zinc-500">{formatDisplayDate(episode.posted || episode.published)}</p>
        ) : null}
      </div>
    </>
  );

  if (playing) {
    return (
      <div className="flex gap-3 rounded-lg bg-white/5 p-1.5" aria-current="true">
        {content}
      </div>
    );
  }

  return (
    <Link href={episodeHref(episode)} className="group flex gap-3">
      {content}
    </Link>
  );
}
