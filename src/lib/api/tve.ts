import { allItems, getJson } from "@/lib/api/http";
import { TVE_API_BASE, TVE_APP_DETAILS_URL, TVE_APP_SLUG } from "@/lib/env";
import type { CatalogFilter, Program, ProgramSlot, ReplayEpisode, VideoItem } from "@/lib/types";
import { colorFromLabel, durationToSeconds, formatDisplayDate, slugify } from "@/lib/utils";

type TveAppDetails = {
  ACAN_API?: Array<{
    app_name?: string;
    app_contact?: string;
    app_email?: string;
    app_fb_url?: string;
    app_twitter_url?: string;
    app_youtube_url?: string;
    app_data_url?: string;
  }>;
};

type TveLiveTv = {
  id?: string;
  title: string;
  desc?: string;
  logo?: string;
  logo_url?: string;
  slug?: string;
  feed_url?: string;
};

type TveRadio = {
  title: string;
  slug?: string;
  desc?: string;
  sd_logo?: string;
  hd_logo?: string;
  stream_url?: string;
  feed_url?: string;
};

type TveShow = {
  title: string;
  desc?: string | null;
  logo?: string;
  logo_url?: string;
  poster?: string;
  slug?: string;
  time?: string;
  chaine_name?: string;
  feed_url?: string;
};

type TveAndroidItem = {
  title: string;
  feed_url?: string;
  type?: string;
};

type TveCategoryGroup = {
  group_name?: string;
  list_categories_by_group?: string;
  list_shows_by_group?: string;
};

type TveVodCategory = {
  id?: string;
  title: string;
  slug?: string;
  desc?: string;
  image?: string;
  image_url?: string;
  feed_url?: string;
  video_feed_url?: string;
};

type TveVideo = {
  title: string;
  desc?: string;
  logo?: string;
  logo_url?: string;
  slug?: string;
  date?: string;
  time?: string;
  views?: string;
  feed_url?: string;
  webdetail_url?: string;
  video_url?: string;
  type?: string;
};

type TveGuideSlot = {
  title: string;
  startTime?: string;
  endTime?: string;
  categoryName?: string;
  slug?: string;
};

type TveGuideChannel = {
  id?: string;
  titre?: string;
  subitems?: {
    matin?: TveGuideSlot[];
    soir?: TveGuideSlot[];
    direct?: TveGuideSlot | string;
  };
};

function tveUrl(...parts: Array<string | number>) {
  return `${TVE_API_BASE}/${parts.join("/")}`;
}

function appJson(...parts: Array<string | number>) {
  return tveUrl(...parts, TVE_APP_SLUG, "json");
}

export async function getTveAppDetails() {
  try {
    const data = await getJson<TveAppDetails>(TVE_APP_DETAILS_URL);
    return data.ACAN_API?.[0] ?? null;
  } catch {
    return null;
  }
}

export async function getLiveTvChannels() {
  try {
    return allItems<TveLiveTv>(await getJson(appJson("listLiveTV")));
  } catch {
    return [];
  }
}

export async function getLiveRadios() {
  try {
    return allItems<TveRadio>(await getJson(appJson("listLiveRadios")));
  } catch {
    return [];
  }
}

export async function getLivePlayback(channelId: string) {
  try {
    const data = await getJson<{ web_url?: string; direct_url?: string }>(
      tveUrl("directplayback", channelId, "json"),
      30,
    );
    return data.web_url || data.direct_url || "";
  } catch {
    return "";
  }
}

export async function getVideoPlayback(feedUrl: string) {
  try {
    const data = await getJson<unknown>(feedUrl, 30);
    const item = (Array.isArray(data) ? data[0] : data) as
      | { web_url?: string; video_url?: string; direct_url?: string }
      | undefined;
    return item?.web_url || item?.video_url || item?.direct_url || "";
  } catch {
    return "";
  }
}

export function programEpisodeFeed(program?: Pick<Program, "videoFeedUrl" | "feedUrl"> | null) {
  return program?.videoFeedUrl || program?.feedUrl;
}

async function getAndroidItem(title: string) {
  const items = allItems<TveAndroidItem>(await getJson(appJson("listAndroid")));
  const needle = title.trim().toLowerCase();
  return items.find((item) => item.title.trim().toLowerCase() === needle) ?? null;
}

async function getVodCategories(): Promise<TveVodCategory[]> {
  const menu = await getAndroidItem("CATEGORIES VOD");
  if (!menu?.feed_url) return [];

  const groups = allItems<TveCategoryGroup>(await getJson(menu.feed_url));
  const lists = await Promise.all(
    groups.map(async (group) => {
      if (!group.list_categories_by_group) return [] as TveVodCategory[];
      return allItems<TveVodCategory>(await getJson(group.list_categories_by_group));
    }),
  );

  const seen = new Set<string>();
  return lists.flat().filter((category) => {
    const key = category.slug || slugify(category.title);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function getShowsForCategory(category: TveVodCategory): Promise<TveShow[]> {
  if (!category.feed_url) return [];

  const byGroupUrl = category.feed_url.replace(
    "/listChannelsByCategory/",
    "/listChannelsbygroupByCategory/",
  );
  if (byGroupUrl !== category.feed_url) {
    const direct = allItems<TveShow>(await getJson(byGroupUrl));
    if (direct[0]?.title) return direct;
  }

  const groups = allItems<TveCategoryGroup>(await getJson(category.feed_url));
  const url = groups[0]?.list_shows_by_group;
  if (!url) return [];
  return allItems<TveShow>(await getJson(url));
}

function uniquePrograms(programmes: Program[]) {
  const seen = new Set<string>();
  return programmes.filter((program) => {
    if (seen.has(program.slug)) return false;
    seen.add(program.slug);
    return true;
  });
}

export async function getTveProgramCatalog(): Promise<{
  categories: CatalogFilter[];
  programmes: Program[];
}> {
  try {
    const categories = await getVodCategories();
    const grouped = await Promise.all(
      categories.map(async (category) => {
        try {
          const shows = await getShowsForCategory(category);
          return shows.map((show) => showToProgram(show, category));
        } catch {
          return [] as Program[];
        }
      }),
    );
    return {
      categories: categories.map((category) => ({
        id: category.slug || slugify(category.title),
        label: category.title,
      })),
      programmes: grouped.flat(),
    };
  } catch {
    return { categories: [], programmes: [] };
  }
}

export async function getTveShows(): Promise<Program[]> {
  const { programmes } = await getTveProgramCatalog();
  return uniquePrograms(programmes);
}

export async function getTveShow(slug: string) {
  const shows = await getTveShows();
  return shows.find((show) => show.slug === slug) ?? null;
}

export async function getTveEpisodes(feedUrl?: string, programSlug = ""): Promise<ReplayEpisode[]> {
  if (!feedUrl) return [];
  try {
    return allItems<TveVideo>(await getJson(feedUrl)).map((item) => videoToReplay(item, programSlug));
  } catch {
    return [];
  }
}

export async function getTveSliders(): Promise<VideoItem[]> {
  try {
    return allItems<TveVideo>(await getJson(appJson("alaunesliders"))).map(sliderToVideo);
  } catch {
    return [];
  }
}

export async function getTveGuideSlots(): Promise<ProgramSlot[]> {
  try {
    const guide = await getJson<TveGuideChannel[]>(appJson("guidetvall", "today"));
    const first = Array.isArray(guide) ? guide[0] : null;
    const slots = [...(first?.subitems?.matin ?? []), ...(first?.subitems?.soir ?? [])];
    return slots.map((slot) => ({
      time: slot.startTime ?? "",
      title: slot.title,
      category: slot.categoryName,
    }));
  } catch {
    return [];
  }
}

function showToProgram(show: TveShow, category?: TveVodCategory): Program {
  const badge = category?.title || show.chaine_name || "TV";
  const filter = category?.slug || slugify(badge);
  return {
    id: show.slug || slugify(show.title),
    slug: show.slug || slugify(show.title),
    title: show.title,
    badge,
    badgeColor: colorFromLabel(badge),
    filter,
    schedule: show.time ? `On air — ${show.time}` : badge,
    image: show.poster || show.logo_url || show.logo || "",
    poster: show.poster || show.logo,
    description: show.desc || show.title,
    feedUrl: show.feed_url,
    videoFeedUrl: category?.video_feed_url,
  };
}

function videoToReplay(item: TveVideo, programSlug: string): ReplayEpisode {
  const slug = item.slug || slugify(item.title);
  return {
    id: slug,
    programSlug: programSlug || slug,
    title: item.title,
    category: item.type?.toUpperCase() || "VOD",
    published: formatDisplayDate(item.date),
    posted: formatDisplayDate(item.date),
    views: item.views && item.views !== "0" ? `${item.views} views` : "Replay",
    duration: item.time || "00:00",
    durationSeconds: durationToSeconds(item.time || "00:00"),
    image: item.logo_url || item.logo || "",
    about: item.desc || item.title,
    streamFeedUrl: item.feed_url || item.webdetail_url,
    streamUrl: item.video_url,
  };
}

function sliderToVideo(item: TveVideo): VideoItem {
  const slug = item.slug || slugify(item.title);
  return {
    id: slug,
    title: item.title,
    image: item.logo_url || item.logo || "",
    posted: formatDisplayDate(item.date),
    duration: item.time || "",
    href: `/watch/${slug}`,
    streamFeedUrl: item.feed_url || item.webdetail_url,
  };
}

export function tveAppSlug() {
  return TVE_APP_SLUG;
}
