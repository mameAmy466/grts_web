import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  IconFacebook,
  IconLinkedIn,
  IconWhatsApp,
  IconX,
} from "@/components/icons";
import { MediaImage, SiteWrap } from "@/components/media-image";
import { NewsSidebar } from "@/components/news-sidebar";
import {
  allArticles,
  getArticle,
  getCategory,
  relatedArticles,
} from "@/lib/data";
import { getWpPosts } from "@/lib/api/wordpress";
import type { Article } from "@/lib/types";
import { formatDisplayDate, unsplash } from "@/lib/utils";

export function generateStaticParams() {
  return allArticles().map((article) => ({
    category: article.category,
    slug: article.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}): Promise<Metadata> {
  const { category, slug } = await params;
  const fromWp = (await getWpPosts({ slug, perPage: 1 }))[0];
  const article = fromWp ?? getArticle(category, slug);
  return { title: article?.title ?? "News" };
}

function articleBody(article: Article) {
  const lead =
    article.lead ??
    (article.excerpt ||
      `${article.title} — GRTS News follows the story from Banjul and across the country.`);

  const sections = article.sections ?? [
    {
      heading: "What we know so far",
      paragraphs: [
        "Officials briefed reporters in Kanifing, and GRTS will update this report as more detail is confirmed.",
      ],
    },
    {
      heading: "Why it matters",
      paragraphs: [
        "The story sits in a wider national conversation about public services, livelihoods, and how policy reaches communities outside the Greater Banjul Area.",
      ],
    },
  ];

  return {
    author: article.author ?? "GRTS Newsroom",
    authorImage: article.authorImage ?? unsplash("photo-1573496359142-b8d87734a5a2", 200),
    caption:
      article.caption ??
      `${article.title}. Photo: GRTS News.`,
    lead,
    sections,
    tags: article.tags ?? [article.categoryLabel, "Gambia", "GRTS"],
  };
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ category: string; slug: string }>;
}) {
  const { category, slug } = await params;
  const fromWp = (await getWpPosts({ slug, perPage: 1 }))[0];
  const article = fromWp ?? getArticle(category, slug);
  const meta = getCategory(category) ?? { slug: category, label: article?.categoryLabel ?? category };
  if (!article) notFound();

  const body = articleBody(article);
  const related = relatedArticles(article);
  const crumb = article.title.length > 42 ? `${article.title.slice(0, 42)}…` : article.title;

  const share = [
    { name: "Facebook", href: "https://www.facebook.com", Icon: IconFacebook },
    { name: "Twitter", href: "https://x.com", Icon: IconX },
    { name: "LinkedIn", href: "https://www.linkedin.com", Icon: IconLinkedIn },
    { name: "WhatsApp", href: "https://wa.me", Icon: IconWhatsApp },
  ];

  return (
    <div className="pb-16">
      <div className="border-b border-zinc-200 bg-zinc-100">
        <SiteWrap className="py-3">
          <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-500">
            <Link href="/news" className="hover:text-brand">
              News
            </Link>
            <span className="mx-2">›</span>
            <Link href={`/news/${meta.slug}`} className="hover:text-brand">
              {meta.label}
            </Link>
            <span className="mx-2">›</span>
            <span className="text-zinc-700">{crumb}</span>
          </p>
        </SiteWrap>
      </div>

      <SiteWrap className="grid gap-10 py-10 lg:grid-cols-12">
        <article className="lg:col-span-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
            {article.categoryLabel}
          </p>
          <h1 className="mt-3 text-3xl font-bold leading-tight text-zinc-900 md:text-4xl">
            {article.title}
          </h1>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-zinc-500">
            <span className="relative h-10 w-10 overflow-hidden rounded-full bg-zinc-200">
              <MediaImage src={body.authorImage} alt={body.author} sizes="40px" />
            </span>
            <span>
              By <span className="font-medium text-zinc-800">{body.author}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span>{formatDisplayDate(article.date)}</span>
            {article.readTime ? (
              <>
                <span aria-hidden="true">·</span>
                <span>{article.readTime}</span>
              </>
            ) : null}
          </div>

          <figure className="mt-7">
            <div className="relative aspect-[16/8] overflow-hidden rounded-xl bg-zinc-200">
              <MediaImage
                src={article.image}
                alt={article.title}
                priority
                sizes="(min-width: 1024px) 66vw, 100vw"
              />
            </div>
            <figcaption className="mt-2 text-xs leading-5 text-zinc-500">
              {body.caption}
            </figcaption>
          </figure>

          <div className="mt-8 space-y-6 text-[17px] leading-8 text-zinc-700">
            {article.contentHtml ? (
              <div className="wp-content" dangerouslySetInnerHTML={{ __html: article.contentHtml }} />
            ) : (
              <>
                <p className="font-semibold text-zinc-900">{body.lead}</p>
                {body.sections.map((section) => (
                  <section key={section.heading ?? section.paragraphs[0]}>
                    {section.heading ? (
                      <h2 className="mb-3 text-xl font-bold text-zinc-900">{section.heading}</h2>
                    ) : null}
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph} className="mt-3 first:mt-0">
                        {paragraph}
                      </p>
                    ))}
                  </section>
                ))}
              </>
            )}
          </div>

          <div className="mt-10 flex flex-wrap gap-2">
            {body.tags.map((tag) => (
              <Link
                key={tag}
                href={`/news/${article.category}`}
                className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:bg-zinc-200"
              >
                {tag}
              </Link>
            ))}
          </div>

          <div className="mt-8 border-t border-zinc-200 pt-6">
            <p className="text-sm font-semibold text-zinc-800">Share this article:</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {share.map(({ name, href, Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-700 hover:border-brand hover:text-brand"
                >
                  <Icon className="h-4 w-4" />
                  {name}
                </a>
              ))}
            </div>
          </div>
        </article>

        <NewsSidebar activeCategory={article.category} />
      </SiteWrap>

      <SiteWrap>
        <h2 className="text-2xl font-bold text-zinc-900">Related Articles</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {related.map((item) => (
            <Link key={item.id} href={item.href} className="group block">
              <div className="relative aspect-[16/10] overflow-hidden rounded-lg bg-zinc-200">
                <MediaImage
                  src={item.image}
                  alt={item.title}
                />
              </div>
              <p className="mt-3 text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                {item.categoryLabel} • {formatDisplayDate(item.date)}
              </p>
              <h3 className="mt-1.5 text-base font-bold leading-snug text-zinc-900 group-hover:text-brand">
                {item.title}
              </h3>
            </Link>
          ))}
        </div>
      </SiteWrap>
    </div>
  );
}
