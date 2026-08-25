import Link from "next/link";
import { MediaImage } from "@/components/media-image";
import { breakingNews } from "@/lib/data";
import type { Article } from "@/lib/types";

export function BreakingTicker({ articles }: { articles?: Article[] }) {
  const source = articles?.length ? articles : breakingNews;
  const items = [...source, ...source];

  return (
    <div className="flex overflow-hidden border-y border-zinc-800 bg-[#2a2a2a] text-white">
      <div className="flex shrink-0 items-center bg-brand px-4 text-xs font-bold tracking-[0.14em]">
        BREAKING
      </div>
      <div className="relative flex-1 overflow-hidden">
        <div className="ticker-track flex w-max items-center gap-8 py-2.5 pr-8">
          {items.map((item, index) => (
            <Link
              key={`${item.id}-${index}`}
              href={item.href}
              className="flex items-center gap-2 text-sm whitespace-nowrap hover:text-brand"
            >
              <span className="relative h-7 w-7 overflow-hidden rounded-sm bg-zinc-600">
                <MediaImage src={item.image} alt="" sizes="28px" />
              </span>
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
