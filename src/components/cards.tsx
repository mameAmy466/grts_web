import Link from "next/link";
import { IconArrowRight, IconClock, IconPlay } from "@/components/icons";
import { MediaImage } from "@/components/media-image";
import type { Article, Episode, ShortItem, VideoItem } from "@/lib/types";
import { clipText, cn, formatDisplayDate, isRealDuration } from "@/lib/utils";

export function PlayBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "btn-glass-dark flex h-10 w-10 items-center justify-center rounded-full text-white",
        className,
      )}
    >
      <IconPlay className="ml-0.5 h-4 w-4" />
    </span>
  );
}

export function Duration({ value, className }: { value: string; className?: string }) {
  if (!isRealDuration(value)) return null;
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
  selected,
  onSelect,
  compact,
}: {
  video: VideoItem;
  className?: string;
  selected?: boolean;
  onSelect?: () => void;
  compact?: boolean;
}) {
  const cardClassName = cn(
    "group flex h-auto w-full max-w-[267px] flex-col gap-2.5 rounded-lg border border-transparent text-left sm:h-[233px]",
    selected && "rounded-xl border-white/10 bg-[#141414] p-4",
    className,
  );
  const date = formatDisplayDate(video.posted);
  const description = video.description?.trim();
  const content = (
    <>
      <div className="relative h-[150px] w-full shrink-0 overflow-hidden rounded-[8px] bg-zinc-800">
        <MediaImage
          src={video.image}
          alt={video.title}
          sizes="267px"
        />
        <PlayBadge className="absolute bottom-2 left-2 h-8 w-8" />
        <Duration value={video.duration} />
      </div>
      <div className="min-w-0 px-0.5">
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-white group-hover:text-brand">
          {video.title}
        </h3>
        {compact ? (
          description || date ? (
            <p className="mt-1 flex items-center gap-1 text-xs leading-5 text-zinc-400">
              {description ? <span className="min-w-0 truncate">{description}</span> : null}
              {description && date ? <span className="shrink-0 text-zinc-500">·</span> : null}
              {date ? <span className="shrink-0 text-zinc-500">{date}</span> : null}
            </p>
          ) : null
        ) : date ? (
          <p className="mt-1 text-xs text-zinc-400">{date}</p>
        ) : null}
      </div>
    </>
  );

  if (onSelect) {
    return (
      <button type="button" onClick={onSelect} className={cardClassName}>
        {content}
      </button>
    );
  }

  return (
    <Link href={video.href} className={cardClassName}>
      {content}
    </Link>
  );
}

export function ShortCard({
  item,
  selected,
  onSelect,
  className,
}: {
  item: ShortItem;
  selected?: boolean;
  onSelect?: () => void;
  className?: string;
}) {
  const cardClassName = cn(
    "group relative block h-[350px] w-[220px] overflow-hidden rounded-lg border bg-zinc-800 text-left",
    selected ? "border-brand" : "border-[var(--color-bg-primary,#0A0A0A)]",
    className,
  );
  const content = (
    <>
      <MediaImage
        src={item.image}
        alt={item.title}
        sizes="220px"
      />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(179.84deg, rgba(0, 0, 0, 0) 0.14%, rgba(0, 0, 0, 0.9) 86.02%)",
        }}
      />
      <Duration value={item.duration} className="top-2 right-2 bottom-auto" />
      <div className="absolute inset-x-0 bottom-0 pb-3 pl-5 pr-3">
        <p className="line-clamp-3 break-words text-sm font-semibold leading-snug text-white">{item.title}</p>
        <p className="mt-1 text-[11px] uppercase tracking-wide text-zinc-300">{item.category}</p>
      </div>
    </>
  );

  if (onSelect) {
    return (
      <button type="button" onClick={onSelect} className={cardClassName}>
        {content}
      </button>
    );
  }

  return (
    <Link href={item.href} className={cardClassName}>
      {content}
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
      <div className={cn("relative h-full min-w-0 bg-zinc-800", large ? "aspect-[16/10] min-h-[220px] sm:min-h-[360px] md:min-h-[420px]" : "aspect-[16/10]")}>
        <MediaImage
          src={article.image}
          alt={article.title}
          priority={large}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 md:p-7">
          <span className="inline-block rounded bg-brand px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            {article.categoryLabel}
          </span>
          <h3 className={cn("mt-2 line-clamp-3 break-words font-bold leading-tight text-white", large ? "text-xl sm:text-2xl md:text-3xl" : "text-lg")}>
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
