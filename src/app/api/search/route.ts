import { NextResponse } from "next/server";
import { searchSite } from "@/lib/api/search";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q") ?? "";
  const results = await searchSite(query, 5);
  return NextResponse.json(results);
}
