import Link from "next/link";
import { IconChevronRight } from "@/components/icons";
import { MediaImage } from "@/components/media-image";
import { categories, editorsChoiceSidebar } from "@/lib/data";
import { clipText, unsplash } from "@/lib/utils";

export function NewsSidebar({
  activeCategory,
  topics,
}: {
  activeCategory: string;
  topics?: { slug: string; label: string }[];
}) {
  const list = topics?.length ? topics : categories.filter((item) => item.slug !== "culture");
  return (
    <aside className="lg:sticky lg:top-[calc(var(--site-header)+1rem)] lg:col-span-4 lg:self-start">
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
        {editorsChoiceSidebar.slice(0, 3).map((article) => (
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

      <div className="relative mt-8 overflow-hidden rounded-xl bg-[#0b3d91] p-5 text-white">
        <div className="absolute inset-y-0 right-0 w-1/2">
          <MediaImage
            src={unsplash("photo-1573497019940-1c28c88b4f3e", 500)}
            alt=""
            sizes="200px"
            className="opacity-50"
          />
        </div>
        <p className="relative text-xs font-semibold uppercase tracking-[0.16em] text-sky-200">
          Stay Connected
        </p>
        <p className="relative mt-2 max-w-[180px] text-lg font-bold leading-snug">
          Unlimited Data Plans Starting at D199/month
        </p>
        <p className="relative mt-4 text-sm font-bold">QCell</p>
      </div>
    </aside>
  );
}
