import { TVE_API_BASE } from "@/lib/env";

type PlaybackPayload = {
  web_url?: string;
  video_url?: string;
  direct_url?: string;
};

function firstItem(payload: PlaybackPayload | PlaybackPayload[] | null) {
  return Array.isArray(payload) ? payload[0] : payload;
}

export async function fetchLivePlayback(channelId: string) {
  if (!channelId) return "";
  try {
    const response = await fetch(`${TVE_API_BASE}/directplayback/${encodeURIComponent(channelId)}/json`, {
      cache: "no-store",
    });
    if (!response.ok) return "";
    const item = firstItem((await response.json()) as PlaybackPayload);
    return item?.direct_url || item?.web_url || "";
  } catch {
    return "";
  }
}

export async function fetchVideoPlayback(feedUrl: string) {
  if (!feedUrl) return "";
  try {
    const response = await fetch(feedUrl, { cache: "no-store" });
    if (!response.ok) return "";
    const item = firstItem((await response.json()) as PlaybackPayload | PlaybackPayload[]);
    return item?.web_url || item?.video_url || item?.direct_url || "";
  } catch {
    return "";
  }
}
