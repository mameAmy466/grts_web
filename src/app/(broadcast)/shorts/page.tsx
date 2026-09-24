import { redirect } from "next/navigation";
import { getTveShorts } from "@/lib/api/tve";

export const revalidate = 600; // REVALIDATE_CATEGORY

export default async function ShortsIndexPage() {
  const shorts = await getTveShorts(50);
  if (shorts[0]) redirect(shorts[0].href);
  redirect("/");
}
