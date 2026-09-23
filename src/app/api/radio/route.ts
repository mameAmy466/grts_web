import { getLiveRadios } from "@/lib/api/tve";

export const dynamic = "force-dynamic";

export async function GET() {
  const radios = await getLiveRadios();
  const url = radios[0]?.stream_url;
  if (!url) return new Response("Radio stream unavailable", { status: 404 });

  const upstream = await fetch(url, {
    cache: "no-store",
    headers: { "user-agent": "GRTS Radio" },
  });
  if (!upstream.ok || !upstream.body) {
    return new Response("Radio stream unavailable", { status: 502 });
  }

  return new Response(upstream.body, {
    headers: {
      "content-type": upstream.headers.get("content-type") || "audio/aac",
      "cache-control": "no-store",
    },
  });
}
