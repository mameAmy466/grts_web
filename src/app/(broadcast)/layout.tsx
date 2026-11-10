import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getNewsNav } from "@/lib/api/news";

export default async function BroadcastLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const newsCategories = await getNewsNav();

  return (
    <div className="flex min-h-full flex-col bg-page text-fg">
      <SiteHeader newsCategories={newsCategories} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
