"use server";

import { getLivePlayback } from "@/lib/api/tve";

export async function loadLivePlayback(channelId: string) {
  if (!channelId) return "";
  return getLivePlayback(channelId);
}
