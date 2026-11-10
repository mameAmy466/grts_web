import type { Metadata } from "next";
import Link from "next/link";
import { SiteWrap } from "@/components/media-image";
import { searchSite } from "@/lib/api/search";
import { emptySearch, searchHasHits } from "@/lib/search";

export const metadata: Metadata = {
  title: "Search",
};

function Group({
  title,
  items,
}: {
  title: string;
  items: Array<{ title: string; href: string; meta?: string }>;
}) {
  if (!items.length) return null;
  return (
    <section className="mt-10">
      <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-brand">{title}</h2>
      <ul className="mt-4 divide-y divide-line border-y border-line">
        {items.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="block py-3 hover:text-brand">
              <span className="block text-sm font-semibold text-fg">{item.title}</span>
              {item.meta ? <span className="mt-1 block text-xs text-zinc-500">{item.meta}</span> : null}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const params = await searchParams;
  const raw = params.q;
  const query = (Array.isArray(raw) ? raw[0] : raw)?.trim() ?? "";
  const results = query.length >= 2 ? await searchSite(query, 12) : emptySearch(query);
  const hits = searchHasHits(results);

  return (
    <div className="pb-20 pt-10">
      <SiteWrap>
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-brand">Search</p>
        <h1 className="mt-3 text-3xl font-bold text-fg">
          {query ? `Results for “${query}”` : "Search GRTS"}
        </h1>
        <form action="/search" className="mt-6 max-w-xl">
          <input
            type="search"
            name="q"
            defaultValue={query}
            placeholder="Search news, programmes, videos…"
            className="h-12 w-full rounded-full border border-line bg-subtle px-5 text-sm text-fg outline-none placeholder:text-zinc-500 focus:border-brand"
          />
        </form>

        {query.length > 0 && query.length < 2 ? (
          <p className="mt-10 text-sm text-fg-muted">Type at least 2 characters.</p>
        ) : query && !hits ? (
          <p className="mt-10 text-sm text-fg-muted">No results for this search.</p>
        ) : hits ? (
          <>
            <Group title="Pages" items={results.pages} />
            <Group title="News" items={results.news} />
            <Group title="Programmes" items={results.programmes} />
            <Group title="Videos" items={results.videos} />
            <Group title="Shorts" items={results.shorts} />
          </>
        ) : (
          <p className="mt-10 text-sm text-fg-muted">Search news, programmes, replays and shorts.</p>
        )}
      </SiteWrap>
    </div>
  );
}
