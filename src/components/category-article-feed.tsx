"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { loadMoreCategoryPosts } from "@/app/(editorial)/news/[category]/actions";
import { MediaImage } from "@/components/media-image";
import type { Article } from "@/lib/types";
import { clipText, formatDisplayDate } from "@/lib/utils";

function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={article.href} className="group block">
      <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-zinc-200">
        <MediaImage src={article.image} alt={article.title} />
      </div>
      <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
        <span className="text-brand">{article.categoryLabel}</span>
        <span className="mx-1.5">·</span>
        {formatDisplayDate(article.date)}
        {article.readTime ? ` · ${article.readTime}` : null}
      </p>
      <h2 className="mt-1.5 line-clamp-3 break-words text-base font-bold leading-snug text-zinc-900 group-hover:text-brand">
        {clipText(article.title, 90)}
      </h2>
    </Link>
  );
}

function ArticleSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[16/10] rounded-lg bg-zinc-200" />
      <div className="mt-3 h-3 w-28 rounded bg-zinc-200" />
      <div className="mt-2 h-4 w-full rounded bg-zinc-200" />
      <div className="mt-2 h-4 w-3/4 rounded bg-zinc-200" />
    </div>
  );
}

export function CategoryArticleFeed({
  initialArticles,
  categoryId,
  excludeId,
  hasMore: initialHasMore,
}: {
  initialArticles: Article[];
  categoryId: number;
  excludeId?: string;
  hasMore: boolean;
}) {
  const [articles, setArticles] = useState(initialArticles);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore && categoryId > 0);
  const [loading, setLoading] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadingRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (!hasMore || loadingRef.current || categoryId <= 0) return;
    loadingRef.current = true;
    setLoading(true);
    const nextPage = page + 1;
    const result = await loadMoreCategoryPosts(categoryId, nextPage);
    const seen = new Set(articles.map((item) => item.id));
    if (excludeId) seen.add(excludeId);
    const extra = result.articles.filter((item) => !seen.has(item.id));
    setArticles((current) => [...current, ...extra]);
    setPage(nextPage);
    setHasMore(result.hasMore);
    setLoading(false);
    loadingRef.current = false;
  }, [articles, categoryId, excludeId, hasMore, page]);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) void loadMore();
      },
      { rootMargin: "240px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  return (
    <>
      <div className="mt-10 grid gap-7 sm:grid-cols-2">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
        {loading
          ? [0, 1].map((key) => <ArticleSkeleton key={`sk-${key}`} />)
          : null}
      </div>
      {hasMore ? <div ref={sentinelRef} className="h-8" aria-hidden="true" /> : null}
    </>
  );
}
