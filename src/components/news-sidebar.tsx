import Link from "next/link";
import { IconChevronRight } from "@/components/icons";
import { MediaImage } from "@/components/media-image";
import { StayConnectedCard } from "@/components/stay-connected-card";
import { getNewsPosts } from "@/lib/api/news";
import { categories, editorsChoiceSidebar } from "@/lib/data";
import { clipText } from "@/lib/utils";

export async function NewsSidebar({
  activeCategory,
  topics,
}: {
  activeCategory: string;
  topics?: { slug: string; label: string }[];
}) {
  const choice = await getNewsPosts({ categorySlug: "editors-choice", perPage: 3 });
  const picks = choice.length ? choice.slice(0, 3) : editorsChoiceSidebar.slice(0, 3);
  const list = topics?.length ? topics : categories.filter((item) => item.slug !== "culture");
  return (
    <aside className="min-w-0 md:col-span-5 md:self-start lg:sticky lg:top-[calc(var(--site-header)+1rem)] lg:col-span-4">
      <h2 className="text-lg font-bold text-zinc-900">Explore Topics</h2>
      <ul className="mt-4 divide-y divide-zinc-200 border-y border-zinc-200">
        {list.map((item) => (
            <li key={item.slug}>
              <Link
                href={`/news/${item.slug}`}
                className={`flex items-center justify-between py-3 text-sm ${
                  item.slug === activeCategory
                    ? "font-semibold text-brand"
                    : "text-zinc-700 hover:text-brand"
                }`}
              >
                {item.label}
                <IconChevronRight className="h-4 w-4" />
              </Link>
            </li>
          ))}
      </ul>

      <h2 className="mt-8 text-lg font-bold text-zinc-900">Editor&apos;s Choice</h2>
      <ul className="mt-4 space-y-4">
        {picks.map((article) => (
          <li key={article.id}>
            <Link href={article.href} className="group flex gap-3">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-zinc-200">
                <MediaImage src={article.image} alt={article.title} sizes="64px" />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase tracking-wide text-brand">
                  {article.categoryLabel}
                </p>
                <p className="line-clamp-3 break-words text-sm font-semibold leading-snug text-zinc-900 group-hover:text-brand">
                  {clipText(article.title, 72)}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-8">
        <StayConnectedCard />
      </div>
    </aside>
  );
}
