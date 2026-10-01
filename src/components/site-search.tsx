"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { IconClose, IconSearch } from "@/components/icons";
import { useLocale } from "@/components/locale-provider";
import { emptySearch, searchHasHits, type SearchResults } from "@/lib/search";
import type { ChromeTheme } from "@/lib/types";
import { cn } from "@/lib/utils";

function ResultGroup({
  title,
  items,
  light,
  onPick,
}: {
  title: string;
  items: SearchResults["news"];
  light: boolean;
  onPick: () => void;
}) {
  if (!items.length) return null;
  return (
    <div>
      <p className="px-3 pb-1 text-[11px] font-bold uppercase tracking-[0.14em] text-zinc-500">{title}</p>
      <ul>
        {items.map((item) => (
          <li key={`${item.type}-${item.href}`}>
            <Link
              href={item.href}
              onClick={onPick}
              className={cn(
                "block rounded-md px-3 py-2 hover:text-brand",
                light ? "hover:bg-zinc-100" : "hover:bg-white/5",
              )}
            >
              <span className="block text-sm font-medium">{item.title}</span>
              {item.meta ? <span className="mt-0.5 block text-xs text-zinc-500">{item.meta}</span> : null}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function SiteSearch({
  open,
  onClose,
  theme = "dark",
}: {
  open: boolean;
  onClose: () => void;
  theme?: ChromeTheme;
}) {
  const router = useRouter();
  const { t } = useLocale();
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const light = theme === "light";
  const [query, setQuery] = useState("");
  const [fetched, setFetched] = useState<SearchResults>(emptySearch());
  const [loading, setLoading] = useState(false);
  const needle = query.trim();
  const results = needle.length < 2 ? emptySearch(needle) : fetched;
  const hits = searchHasHits(results);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    if (needle.length < 2) return;

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(needle)}`, {
          signal: controller.signal,
        });
        if (!response.ok) return;
        setFetched((await response.json()) as SearchResults);
      } catch {
        if (!controller.signal.aborted) setFetched(emptySearch(needle));
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 280);

    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [open, needle]);

  if (!open) return null;

  function submit(event: FormEvent) {
    event.preventDefault();
    const needle = query.trim();
    if (needle.length < 2) return;
    onClose();
    router.push(`/search?q=${encodeURIComponent(needle)}`);
  }

  return (
    <div className="fixed inset-0 z-50">
      <button type="button" aria-label={t("closeMenu")} className="absolute inset-0 bg-black/55" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={inputId}
        className={cn(
          "absolute inset-x-0 top-0 mx-auto w-full max-w-2xl px-4 pt-16 sm:px-6 sm:pt-20",
        )}
      >
        <div
          className={cn(
            "overflow-hidden rounded-2xl border shadow-2xl",
            light ? "border-zinc-200 bg-white text-zinc-900" : "border-white/10 bg-[#171717] text-white",
          )}
        >
          <form onSubmit={submit} className="flex items-center gap-2 border-b border-inherit px-3 py-2">
            <IconSearch className="h-5 w-5 shrink-0 text-zinc-500" />
            <label htmlFor={inputId} className="sr-only">
              {t("search")}
            </label>
            <input
              id={inputId}
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("searchPlaceholder")}
              className={cn(
                "h-11 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-zinc-500",
                light ? "text-zinc-900" : "text-white",
              )}
            />
            <button
              type="button"
              aria-label={t("closeMenu")}
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 hover:text-brand"
            >
              <IconClose className="h-4 w-4" />
            </button>
          </form>

          <div className="max-h-[min(70vh,28rem)] space-y-4 overflow-y-auto px-2 py-3">
            {query.trim().length < 2 ? (
              <p className="px-3 py-6 text-sm text-zinc-500">{t("searchHint")}</p>
            ) : loading && !hits ? (
              <p className="px-3 py-6 text-sm text-zinc-500">…</p>
            ) : !hits ? (
              <p className="px-3 py-6 text-sm text-zinc-500">{t("searchNone")}</p>
            ) : (
              <>
                <ResultGroup title={t("searchPages")} items={results.pages} light={light} onPick={onClose} />
                <ResultGroup title={t("searchNews")} items={results.news} light={light} onPick={onClose} />
                <ResultGroup title={t("searchProgrammes")} items={results.programmes} light={light} onPick={onClose} />
                <ResultGroup title={t("searchVideos")} items={results.videos} light={light} onPick={onClose} />
                <ResultGroup title={t("searchShorts")} items={results.shorts} light={light} onPick={onClose} />
                <Link
                  href={`/search?q=${encodeURIComponent(query.trim())}`}
                  onClick={onClose}
                  className="block px-3 py-2 text-sm font-semibold text-brand hover:text-brand-hover"
                >
                  {t("searchAll")}
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
