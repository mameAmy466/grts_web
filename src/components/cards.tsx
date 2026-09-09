import Link from "next/link";
import { IconArrowRight, IconClock, IconPlay } from "@/components/icons";
import { MediaImage } from "@/components/media-image";
import type { Article, Episode, ShortItem, VideoItem } from "@/lib/types";
import { clipText, cn, formatDisplayDate } from "@/lib/utils";

export function PlayBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white shadow-lg",
        className,
      )}
    >
      <IconPlay className="ml-0.5 h-4 w-4" />
    </span>
  );
}

export function Duration({ value, className }: { value: string; className?: string }) {
  return (
    <span
      className={cn(
        "absolute bottom-2 right-2 rounded bg-black/75 px-1.5 py-0.5 text-[11px] font-medium text-white",
        className,
      )}
    >
      {value}
    </span>
  );
}

export function VideoCard({
  video,
  className,
}: {
  video: VideoItem;
  className?: string;
}) {
  return (
    <Link href={video.href} className={cn("group block", className)}>
      <div className="relative aspect-video overflow-hidden rounded-lg bg-zinc-800">
        <MediaImage
          src={video.image}
          alt={video.title}
        />
        <Duration value={video.duration} />
      </div>
      <h3 className="mt-2.5 text-sm font-semibold leading-snug text-white group-hover:text-brand">
        {video.title}
      </h3>
      <p className="mt-1 text-xs text-zinc-400">{formatDisplayDate(video.posted)}</p>
    </Link>
  );
}

export function ShortCard({ item }: { item: ShortItem }) {
  return (
    <Link href={item.href} className="group relative block overflow-hidden rounded-xl">
      <div className="relative aspect-[9/16] bg-zinc-800">
        <MediaImage
          src={item.image}
          alt={item.title}
          sizes="168px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
        <Duration value={item.duration} className="top-2 right-2 bottom-auto" />
        <div className="absolute inset-x-0 bottom-0 p-3">
          <p className="line-clamp-3 break-words text-sm font-semibold leading-snug text-white">{item.title}</p>
          <p className="mt-1 text-[11px] uppercase tracking-wide text-zinc-300">{item.category}</p>
        </div>
      </div>
    </Link>
  );
}

export function NewsThumbRow({
  article,
  theme = "dark",
}: {
  article: Article;
  theme?: "dark" | "light";
}) {
  return (
    <Link href={article.href} className="group flex gap-3">
      <div className="relative h-[68px] w-[104px] shrink-0 overflow-hidden rounded-md bg-zinc-200">
        <MediaImage src={article.image} alt={article.title} sizes="120px" />
      </div>
      <div className="min-w-0">
        <h3
          className={cn(
            "line-clamp-3 break-words text-sm font-semibold leading-snug group-hover:text-brand",
            theme === "dark" ? "text-white" : "text-zinc-900",
          )}
        >
          {clipText(article.title, 72)}
        </h3>
        <p className="mt-1 text-xs text-zinc-500">{formatDisplayDate(article.date)}</p>
      </div>
    </Link>
  );
}

export function NewsGridCard({
  article,
  theme = "dark",
}: {
  article: Article;
  theme?: "dark" | "light";
}) {
  return (
    <Link href={article.href} className="group block">
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-zinc-200">
        <MediaImage
          src={article.image}
          alt={article.title}
        />
      </div>
      <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-brand">
        {article.categoryLabel}
      </p>
      <h3
        className={cn(
          "mt-1 line-clamp-3 break-words text-[15px] font-semibold leading-snug group-hover:text-brand",
          theme === "dark" ? "text-white" : "text-zinc-900",
        )}
      >
        {clipText(article.title, 90)}
      </h3>
      <p className="mt-1.5 text-xs text-zinc-500">{formatDisplayDate(article.date)}</p>
    </Link>
  );
}

export function NewsOverlayCard({
  article,
  className,
  large = false,
}: {
  article: Article;
  className?: string;
  large?: boolean;
}) {
  return (
    <Link href={article.href} className={cn("group relative block h-full overflow-hidden rounded-xl", className)}>
      <div className={cn("relative h-full bg-zinc-800", large ? "aspect-[16/10] min-h-[360px] md:min-h-[420px]" : "aspect-[16/10]")}>
        <MediaImage
          src={article.image}
          alt={article.title}
          priority={large}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
          <span className="inline-block rounded bg-brand px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            {article.categoryLabel}
          </span>
          <h3 className={cn("mt-2 line-clamp-3 break-words font-bold leading-tight text-white", large ? "text-2xl md:text-3xl" : "text-lg")}>
            {clipText(article.title, large ? 110 : 90)}
          </h3>
          <p className="mt-2 text-xs text-zinc-300">{formatDisplayDate(article.date)}</p>
        </div>
      </div>
    </Link>
  );
}

export function SideNewsRow({
  article,
  theme = "dark",
  className,
}: {
  article: Article;
  theme?: "dark" | "light";
  className?: string;
}) {
  return (
    <Link href={article.href} className={cn("group flex items-center gap-3", className)}>
      <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-md bg-zinc-200">
        <MediaImage src={article.image} alt={article.title} sizes="140px" />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
          {article.categoryLabel}
        </p>
        <h3
          className={cn(
            "mt-1 line-clamp-3 break-words text-sm font-semibold leading-snug group-hover:text-brand",
            theme === "dark" ? "text-white" : "text-zinc-900",
          )}
        >
          {clipText(article.title, 80)}
        </h3>
        <p className="mt-1 text-xs text-zinc-500">{formatDisplayDate(article.date)}</p>
      </div>
    </Link>
  );
}

export function EpisodeCard({ episode }: { episode: Episode }) {
  return (
    <Link
      href={episode.href}
      className="group overflow-hidden rounded-[12px] border border-white/15 bg-[#171717] opacity-100"
    >
      <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-[#1b1530]">
        <WaveArt />
        <PlayBadge className="relative z-10 h-11 w-11" />
      </div>
      <div className="p-4">
        <p className="text-[11px] uppercase tracking-wide text-zinc-500">{episode.category}</p>
        <h3 className="mt-1 text-sm font-semibold text-white group-hover:text-brand">{episode.title}</h3>
        <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-zinc-400">
          <IconClock className="h-3.5 w-3.5" />
          {episode.duration}
        </p>
      </div>
    </Link>
  );
}

function WaveArt() {
  return (
    <svg
      className="absolute inset-0 h-full w-full opacity-70"
      viewBox="0 0 400 220"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        d="M0 130 C 40 80, 80 180, 120 120 S 200 40, 240 110 320 190, 400 90"
        fill="none"
        stroke="#7c5cff"
        strokeWidth="3"
      />
      <path
        d="M0 150 C 50 100, 90 190, 140 140 S 220 70, 270 130 340 200, 400 120"
        fill="none"
        stroke="#3b82f6"
        strokeWidth="2"
        opacity="0.7"
      />
    </svg>
  );
}

export function SectionHeading({
  title,
  href,
  theme = "dark",
}: {
  title: string;
  href?: string;
  theme?: "dark" | "light";
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <h2 className={cn("text-2xl font-bold", theme === "dark" ? "text-white" : "text-zinc-900")}>
        {title}
      </h2>
      {href ? (
        <Link
          href={href}
          aria-label={`See more: ${title}`}
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full",
            theme === "dark" ? "btn-glass-dark text-white hover:text-brand" : "btn-glass text-zinc-700 hover:text-brand",
          )}
        >
          <IconArrowRight className="h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}
