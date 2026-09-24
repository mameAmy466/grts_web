"use client";

import { useMemo, useRef, useState } from "react";
import { IconChevronLeft, IconChevronRight, IconSearch } from "@/components/icons";
import { ProgramCard } from "@/components/program-card";
import { SiteWrap } from "@/components/media-image";
import type { CatalogFilter, Program } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ProgrammesCatalog({
  programmes,
  filters,
}: {
  programmes: Program[];
  filters?: CatalogFilter[];
}) {
  const chips = useMemo(() => {
    const counts = programmes.reduce<Record<string, number>>((acc, item) => {
      if (item.filter) acc[item.filter] = (acc[item.filter] ?? 0) + 1;
      return acc;
    }, {});
    const source = filters?.length
      ? filters
      : [...new Set(programmes.map((item) => item.filter).filter(Boolean))].map((id) => ({
          id,
          label: programmes.find((item) => item.filter === id)?.badge ?? id,
        }));
    const filled = source.filter((item) => (counts[item.id] ?? 0) > 0);
    return [{ id: "all", label: "All" }, ...filled];
  }, [filters, programmes]);

  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const scrollerRef = useRef<HTMLDivElement>(null);

  function slide(direction: -1 | 1) {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    scroller.scrollBy({ left: direction * Math.max(220, scroller.clientWidth * 0.7), behavior: "smooth" });
  }

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const seen = new Set<string>();
    return programmes.filter((program) => {
      const matchesFilter = filter === "all" || program.filter === filter;
      const matchesQuery =
        !needle ||
        program.title.toLowerCase().includes(needle) ||
        program.badge.toLowerCase().includes(needle) ||
        program.schedule.toLowerCase().includes(needle);
      if (!matchesFilter || !matchesQuery) return false;
      if (filter === "all") {
        if (seen.has(program.slug)) return false;
        seen.add(program.slug);
      }
      return true;
    });
  }, [filter, query, programmes]);

  return (
    <div className="pb-20 pt-8">
      <SiteWrap>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex min-w-0 flex-1 items-center gap-2">
            <button
              type="button"
              aria-label="Catégories précédentes"
              onClick={() => slide(-1)}
              className="btn-glass-dark hidden h-9 w-9 shrink-0 items-center justify-center rounded-full text-white sm:flex"
            >
              <IconChevronLeft className="h-4 w-4" />
            </button>
            <div
              ref={scrollerRef}
              className="-mx-1 flex min-w-0 flex-1 snap-x snap-mandatory gap-2 overflow-x-auto px-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {chips.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={(event) => {
                    setFilter(item.id);
                    event.currentTarget.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
                  }}
                  className={cn(
                    "shrink-0 snap-start rounded-full px-3.5 py-1.5 text-sm font-medium whitespace-nowrap",
                    filter === item.id
                      ? "bg-brand text-white"
                      : "btn-glass-dark text-zinc-200 hover:text-white",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <button
              type="button"
              aria-label="Catégories suivantes"
              onClick={() => slide(1)}
              className="btn-glass-dark hidden h-9 w-9 shrink-0 items-center justify-center rounded-full text-white sm:flex"
            >
              <IconChevronRight className="h-4 w-4" />
            </button>
          </div>
          <label className="relative block w-full lg:max-w-xs">
            <span className="sr-only">Search a programme</span>
            <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search a programme"
              className="h-10 w-full rounded-full border border-white/10 bg-[#1a1a1a] pl-9 pr-4 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-brand"
            />
          </label>
        </div>

        {visible.length === 0 ? (
          <p className="mt-16 text-center text-sm text-zinc-400">
            No programme matches that search.
          </p>
        ) : (
          <div className="mt-8 grid grid-cols-2 justify-center gap-3 sm:grid-cols-[repeat(auto-fill,minmax(160px,209px))] sm:justify-start sm:gap-4">
            {visible.map((program) => (
              <ProgramCard key={`${program.slug}-${program.filter}`} program={program} />
            ))}
          </div>
        )}
      </SiteWrap>
    </div>
  );
}
