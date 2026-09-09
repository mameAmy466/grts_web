"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ShortCard } from "@/components/cards";
import type { ShortItem } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ShortsRow({ items }: { items: ShortItem[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);

  const sync = useCallback(() => {
    const root = scrollerRef.current;
    if (!root) return;
    const width = root.clientWidth;
    if (!width) return;
    const total = Math.max(1, Math.ceil(root.scrollWidth / width));
    setPages(total);
    setPage(Math.min(total - 1, Math.round(root.scrollLeft / width)));
  }, []);

  useEffect(() => {
    const root = scrollerRef.current;
    if (!root) return;
    sync();
    root.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    return () => {
      root.removeEventListener("scroll", sync);
      window.removeEventListener("resize", sync);
    };
  }, [sync, items.length]);

  function go(index: number) {
    const root = scrollerRef.current;
    if (!root) return;
    root.scrollTo({ left: index * root.clientWidth, behavior: "smooth" });
  }

  if (!items.length) return null;

  return (
    <div>
      <div
        ref={scrollerRef}
        className="shorts-scroller flex snap-x snap-mandatory gap-3 overflow-x-auto"
      >
        {items.map((item) => (
          <div key={item.id} className="h-[350px] w-[220px] shrink-0 snap-start">
            <ShortCard item={item} className="h-full w-full" />
          </div>
        ))}
      </div>
      {pages > 1 ? (
        <div className="mt-4 flex justify-center gap-1.5">
          {Array.from({ length: pages }, (_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Page ${index + 1}`}
              aria-current={index === page}
              onClick={() => go(index)}
              className={cn(
                "h-1.5 rounded-full transition-all",
                index === page ? "w-5 bg-brand" : "w-1.5 bg-white/30 hover:bg-white/50",
              )}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}
