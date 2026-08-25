import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getNewsNav } from "@/lib/api/wordpress";

export default async function EditorialLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const newsCategories = await getNewsNav();

  return (
    <div className="flex min-h-full flex-col bg-white text-zinc-900">
      <SiteHeader theme="light" newsCategories={newsCategories} />
      <main className="flex-1">{children}</main>
      <SiteFooter theme="light" />
    </div>
  );
}
