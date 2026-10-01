import { getLiveRadios } from "@/lib/api/tve";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const radios = await getLiveRadios();
  const slug = new URL(request.url).searchParams.get("s");
  const radio = radios.find((item) => (item.slug || item.title) === slug) ?? radios[0];
  const url = radio?.stream_url;
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
