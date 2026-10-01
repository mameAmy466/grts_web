import { unstable_cache } from "next/cache";
import { allItems, getJson, getJsonUncached } from "@/lib/api/http";
import { TVE_API_BASE, TVE_APP_DETAILS_URL, TVE_APP_SLUG } from "@/lib/env";
import { REVALIDATE_CATEGORY, REVALIDATE_STATIC } from "@/lib/revalidate";
import type { CatalogFilter, Program, ProgramSlot, RadioStation, ReplayEpisode, ShortItem, VideoItem } from "@/lib/types";
import {
  colorFromLabel,
  durationToSeconds,
  formatClockDuration,
  formatDisplayDate,
  formatViewCount,
  isoDurationToSeconds,
  isRealDuration,
  slugify,
  viewCount,
  youtubeThumbUrl,
  youtubeVideoId,
} from "@/lib/utils";

type TveAppDetails = {
  ACAN_API?: Array<{
    app_name?: string;
    app_contact?: string;
    app_email?: string;
    app_fb_url?: string;
    app_twitter_url?: string;
    app_youtube_url?: string;
    app_data_url?: string;
    app_google_apikey?: string;
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
  stream_url?: string;
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
  video_url?: string | null;
  type?: string;
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
  categories_with_video_by_group?: string;
  categories_with_show_by_group?: string;
};

type TvePaged<T> = {
  allitems?: T[];
  pagination?: { next_page_url?: string | null };
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
  subitems?: {
    data?: TveVideo[];
    pagination?: { next_page_url?: string | null };
  };
};

type TveVideo = {
  title: string;
  desc?: string;
  logo?: string;
  logo_url?: string;
  slug?: string;
  date?: string;
  time?: string | number;
  views?: string;
  feed_url?: string;
  webdetail_url?: string;
  video_url?: string;
  type?: string;
  chaine_name?: string;
};

type TvePlaylist = {
  details?: {
    subitems?: {
      data?: TveVideo[];
    };
  };
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

function tveMediaUrl(value?: string | null) {
  if (!value || value === "null") return "";
  return value.replace(/^http:\/\//i, "https://");
}

function videoClock(time?: string | number) {
  return isRealDuration(time) ? formatClockDuration(durationToSeconds(time)) : "";
}

function videoPoster(item: Pick<TveVideo, "logo" | "logo_url" | "video_url">) {
  return item.logo_url || item.logo || youtubeThumbUrl(item.video_url) || "";
}

async function youtubeApiKey() {
  const fromEnv = process.env.YOUTUBE_API_KEY || process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
  if (fromEnv) return fromEnv;
  const details = await getTveAppDetails();
  return details?.app_google_apikey || "";
}

async function youtubeMetaMap(urls: Array<string | undefined>) {
  const ids = [...new Set(urls.map((url) => youtubeVideoId(url)).filter(Boolean))];
  const meta = new Map<string, { duration: string; views: string; publishedAt: string }>();
  if (!ids.length) return meta;

  const key = await youtubeApiKey();
  if (!key) return meta;

  for (let index = 0; index < ids.length; index += 50) {
    const chunk = ids.slice(index, index + 50);
    const url = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics,snippet&id=${chunk.map(encodeURIComponent).join(",")}&key=${encodeURIComponent(key)}`;
    try {
      const response = await fetch(url, { next: { revalidate: 86400 } });
      if (!response.ok) continue;
      const payload = (await response.json()) as {
        items?: Array<{
          id?: string;
          snippet?: { publishedAt?: string };
          contentDetails?: { duration?: string };
          statistics?: { viewCount?: string };
        }>;
      };
      for (const item of payload.items ?? []) {
        if (!item.id) continue;
        meta.set(item.id, {
          duration: formatClockDuration(isoDurationToSeconds(item.contentDetails?.duration)),
          views: item.statistics?.viewCount || "",
          publishedAt: item.snippet?.publishedAt || "",
        });
      }
    } catch {
      continue;
    }
  }

  return meta;
}

async function withYoutubeDurations(videos: TveVideo[]) {
  const youtubeVideos = videos.filter((video) => youtubeVideoId(video.video_url));
  const meta = youtubeVideos.length
    ? await youtubeMetaMap(youtubeVideos.map((video) => video.video_url))
    : new Map();

  return videos.map((video) => {
    const fromYoutube = meta.get(youtubeVideoId(video.video_url));
    const time = videoClock(video.time) || fromYoutube?.duration || "";
    const views = viewCount(video.views) > 0 ? video.views : fromYoutube?.views || "";
    const date = fromYoutube?.publishedAt || video.date || "";
    return { ...video, time, views, date };
  });
}

function appJson(...parts: Array<string | number>) {
  return tveUrl(...parts, TVE_APP_SLUG, "json");
}

export async function getTveAppDetails() {
  try {
    const data = await getJson<TveAppDetails>(TVE_APP_DETAILS_URL, REVALIDATE_STATIC);
    return data.ACAN_API?.[0] ?? null;
  } catch {
    return null;
  }
}

export async function getLiveTvChannels() {
  try {
    return allItems<TveLiveTv>(await getJson(appJson("listLiveTV"), REVALIDATE_CATEGORY));
  } catch {
    return [];
  }
}

export async function getLiveRadios() {
  try {
    return allItems<TveRadio>(await getJson(appJson("listLiveRadios"), REVALIDATE_STATIC));
  } catch {
    return [];
  }
}

export async function getLiveRadioStation(): Promise<RadioStation | null> {
  const radio = (await getLiveRadios())[0];
  if (!radio) return null;
  return {
    id: radio.slug || radio.title || "grts-radio",
    title: radio.title || "GRTS Radio",
    description: radio.desc || "National Radio - Gambia",
    streamUrl: radio.stream_url || "",
    image: radio.hd_logo || radio.sd_logo || "",
  };
}

export function programEpisodeFeed(program?: Pick<Program, "videoFeedUrl" | "feedUrl"> | null) {
  return program?.feedUrl || program?.videoFeedUrl;
}

export function programAsEpisode(program: Program): ReplayEpisode {
  return {
    id: program.slug,
    programSlug: program.slug,
    title: program.title,
    category: program.badge,
    published: program.schedule,
    posted: program.schedule,
    views: "",
    duration: program.duration || "",
    durationSeconds: durationToSeconds(program.duration || ""),
    image: program.image,
    about: program.description,
    streamFeedUrl: program.feedUrl,
    streamUrl: program.streamUrl,
    href: `/programmes/${program.slug}/watch`,
  };
}

async function getAndroidItem(title: string) {
  const items = allItems<TveAndroidItem>(await getJson(appJson("listAndroid"), REVALIDATE_STATIC));
  const needle = title.trim().toLowerCase();
  return items.find((item) => item.title.trim().toLowerCase() === needle) ?? null;
}

function uniqueCategories(categories: TveVodCategory[]) {
  const seen = new Set<string>();
  return categories.filter((category) => {
    const key = category.slug || slugify(category.title);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function nextPageUrl(value?: string | null) {
  if (!value) return "";
  return value.replace(/^http:\/\//i, "https://");
}

async function getCategoriesWithVideoUrl() {
  try {
    const menu = await getAndroidItem("CATEGORIES VOD");
    if (menu?.feed_url) {
      const groups = allItems<TveCategoryGroup>(await getJson(menu.feed_url, REVALIDATE_STATIC));
      const url = groups[0]?.categories_with_video_by_group;
      if (url) return url;
    }
  } catch {
    // fall through
  }
  return `${tveUrl("listChannelsCategoriesByGroup", TVE_APP_SLUG, "json")}?display=grid`;
}

async function fetchCategoryGridPage(url: string) {
  return getJsonUncached<TvePaged<TveVodCategory>>(url);
}

async function getAllCategoryPages(startUrl: string) {
  const collected: TveVodCategory[] = [];
  let url: string | null = startUrl;

  for (let page = 0; url && page < 8; page += 1) {
    const payload = await fetchCategoryGridPage(url);
    if (!payload) break;
    collected.push(...allItems<TveVodCategory>(payload));
    url = nextPageUrl(payload.pagination?.next_page_url);
  }

  return uniqueCategories(collected);
}

async function getVideosForCategory(category: TveVodCategory) {
  const videos = [...(category.subitems?.data ?? [])];
  let url = nextPageUrl(category.subitems?.pagination?.next_page_url);

  for (let page = 0; url && page < 20; page += 1) {
    const payload = await fetchCategoryGridPage(url);
    if (!payload) break;
    const next = allItems<TveVodCategory>(payload).find(
      (item) => item.slug === category.slug || item.id === category.id,
    );
    if (!next) break;
    videos.push(...(next.subitems?.data ?? []));
    url = nextPageUrl(next.subitems?.pagination?.next_page_url);
  }

  if (category.video_feed_url) {
    try {
      videos.push(...allItems<TveVideo>(await getJson(category.video_feed_url, REVALIDATE_STATIC)));
    } catch {
      // keep grid videos
    }
  }

  const seen = new Set<string>();
  return videos.filter((video) => {
    const key = slugify(video.slug || video.title);
    if (!video.title || !key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function uniquePrograms(programmes: Program[]) {
  const seen = new Set<string>();
  return programmes.filter((program) => {
    const key = slugify(program.slug || program.title);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

async function getShowsByGroupUrl() {
  return `${tveUrl("listChannelsbygroup", TVE_APP_SLUG, "json")}`;
}

async function getShowsWithCategoryUrl() {
  try {
    const menu = await getAndroidItem("CATEGORIES VOD");
    if (menu?.feed_url) {
      const groups = allItems<TveCategoryGroup>(await getJson(menu.feed_url, REVALIDATE_STATIC));
      const url = groups[0]?.categories_with_show_by_group;
      if (url) return url;
    }
  } catch {
    // fall through
  }
  return `${tveUrl("listChannelsCategoriesByGroup", TVE_APP_SLUG, "json")}?display=grid&subitems_type=shows`;
}

async function loadShows(): Promise<TveShow[]> {
  try {
    const shows = allItems<TveShow>(await getJson(await getShowsByGroupUrl(), REVALIDATE_STATIC));
    return shows.filter((show) => show.title && slugify(show.slug || show.title));
  } catch {
    return [];
  }
}

async function loadShowCategoryMap() {
  const map = new Map<string, TveVodCategory>();
  let url: string | null = await getShowsWithCategoryUrl();
  for (let page = 0; url && page < 8; page += 1) {
    const payload = await fetchCategoryGridPage(url);
    if (!payload) break;
    for (const category of allItems<TveVodCategory>(payload)) {
      for (const show of category.subitems?.data ?? []) {
        const slug = slugify(show.slug || show.title);
        if (slug && !map.has(slug)) map.set(slug, category);
      }
    }
    url = nextPageUrl(payload.pagination?.next_page_url);
  }
  return map;
}

async function loadProgramCatalog(): Promise<{
  categories: CatalogFilter[];
  programmes: Program[];
}> {
  const [shows, categoryMap] = await Promise.all([loadShows(), loadShowCategoryMap()]);
  const programmes = uniquePrograms(
    shows.map((show) => {
      const slug = slugify(show.slug || show.title);
      return showToProgram(show, categoryMap.get(slug));
    }),
  );
  const seen = new Set<string>();
  const categories: CatalogFilter[] = [];
  for (const program of programmes) {
    if (!program.filter || seen.has(program.filter)) continue;
    seen.add(program.filter);
    categories.push({ id: program.filter, label: program.badge });
  }
  return { categories, programmes };
}

export async function getTveProgramCatalog(): Promise<{
  categories: CatalogFilter[];
  programmes: Program[];
}> {
  try {
    const cached = await unstable_cache(loadProgramCatalog, ["tve-program-catalog-shows-v2", TVE_APP_SLUG], {
      revalidate: REVALIDATE_STATIC,
    })();
    if (cached.programmes.length) return cached;
  } catch {
    // load live below
  }
  try {
    return await loadProgramCatalog();
  } catch {
    return { categories: [], programmes: [] };
  }
}

export async function getTveShows(): Promise<Program[]> {
  const { programmes } = await getTveProgramCatalog();
  return uniquePrograms(programmes);
}

function programMatchesSlug(program: Pick<Program, "slug" | "title">, needle: string) {
  return slugify(program.slug) === needle || slugify(program.title) === needle;
}

async function findProgramInGrid(needle: string) {
  const [shows, categoryMap] = await Promise.all([loadShows(), loadShowCategoryMap()]);
  const show = shows.find((item) => programMatchesSlug({ slug: item.slug || "", title: item.title }, needle));
  if (!show) return null;
  return showToProgram(show, categoryMap.get(needle) ?? categoryMap.get(slugify(show.slug || show.title)));
}

export async function getTveShow(slug: string) {
  const needle = slugify(decodeURIComponent(slug || "").trim());
  if (!needle) return null;
  const fromGrid = await findProgramInGrid(needle);
  if (fromGrid) return fromGrid;
  const { programmes } = await getTveProgramCatalog();
  return programmes.find((show) => programMatchesSlug(show, needle)) ?? null;
}

export async function getTveEpisodes(feedUrl?: string, programSlug = ""): Promise<ReplayEpisode[]> {
  let url = nextPageUrl(feedUrl);
  if (!url) return [];
  const raw: TveVideo[] = [];
  try {
    for (let page = 0; url && page < 8; page += 1) {
      const payload = await getJsonUncached<TvePaged<TveVideo>>(url);
      if (!payload) break;
      raw.push(...allItems<TveVideo>(payload).filter((item) => item.title));
      url = nextPageUrl(payload.pagination?.next_page_url);
    }
  } catch {
    if (!raw.length) return [];
  }
  const videos = await withYoutubeDurations(raw).catch(() => raw);
  return videos.map((item) => videoToReplay(item, programSlug));
}

export async function getTveSliders(): Promise<VideoItem[]> {
  try {
    const videos = await withYoutubeDurations(allItems<TveVideo>(await getJson(appJson("alaunesliders"), REVALIDATE_CATEGORY)));
    return videos.map(sliderToVideo);
  } catch {
    return [];
  }
}

async function getAlauneEpisodes(): Promise<ReplayEpisode[]> {
  const menu = await getAndroidItem("CHAINE A la UNE");
  if (!menu?.feed_url) return [];
  const groups = allItems<{ list_alaune_by_group?: string }>(await getJson(menu.feed_url, REVALIDATE_CATEGORY));
  const url = groups[0]?.list_alaune_by_group;
  if (!url) return [];
  const videos = await withYoutubeDurations(allItems<TveVideo>(await getJson(url, REVALIDATE_CATEGORY)));
  return videos.map(replayTvToEpisode);
}

async function getVodCategories() {
  try {
    return await getAllCategoryPages(await getCategoriesWithVideoUrl());
  } catch {
    return [];
  }
}

async function getCategoryReplayEpisodes(limit: number, seen: Set<string>): Promise<ReplayEpisode[]> {
  const categories = await getVodCategories();
  const collected: ReplayEpisode[] = [];
  for (const category of categories.slice(0, 4)) {
    if (!category.video_feed_url || collected.length >= limit) break;
    try {
      const videos = await withYoutubeDurations(allItems<TveVideo>(await getJson(category.video_feed_url, REVALIDATE_CATEGORY)));
      for (const video of videos) {
        const episode = replayTvToEpisode(video);
        if (seen.has(episode.id)) continue;
        seen.add(episode.id);
        collected.push(episode);
        if (collected.length >= limit) break;
      }
    } catch {
      continue;
    }
  }
  return collected;
}

export async function getTveReplayEpisodes(): Promise<ReplayEpisode[]> {
  let featured: ReplayEpisode[] = [];
  try {
    featured = await getAlauneEpisodes();
  } catch {
    featured = [];
  }
  const seen = new Set(featured.map((item) => item.id));
  if (featured.length < 12) {
    try {
      const sliders = await getTveSliders();
      for (const video of sliders) {
        if (seen.has(video.id)) continue;
        seen.add(video.id);
        featured.push(videoItemToReplay(video));
      }
    } catch {
      // keep what we have
    }
  }
  if (featured.length < 12) {
    try {
      featured.push(...(await getCategoryReplayEpisodes(12 - featured.length, seen)));
    } catch {
      // keep what we have
    }
  }
  return featured;
}

export async function getTveReplayVideos(limit = 12): Promise<VideoItem[]> {
  return (await getTveReplayEpisodes()).slice(0, limit).map(replayToVideo);
}

export async function getTveReplayById(id: string) {
  const [episodes, sliders] = await Promise.all([getTveReplayEpisodes(), getTveSliders()]);
  const fromEpisode = episodes.find((item) => item.id === id);
  const fromSlider = sliders.find((item) => item.id === id);
  const current = fromEpisode ?? (fromSlider ? videoItemToReplay(fromSlider) : null);
  if (!current) return null;

  const seen = new Set([current.id]);
  const related: ReplayEpisode[] = [];
  for (const item of [...episodes, ...sliders.map(videoItemToReplay)]) {
    if (seen.has(item.id)) continue;
    seen.add(item.id);
    related.push(item);
  }
  return { current, related };
}

function playlistItems(payload: TvePlaylist) {
  return payload.details?.subitems?.data ?? [];
}

function shortToItem(item: TveVideo): ShortItem {
  const slug = item.slug || slugify(item.title);
  return {
    id: slug,
    title: item.title,
    category: item.chaine_name || "Shorts",
    image: videoPoster(item),
    duration: videoClock(item.time),
    href: `/shorts/${slug}`,
    videoUrl: item.video_url,
  };
}

export async function getTveShorts(limit = 10): Promise<ShortItem[]> {
  try {
    const data = await getJson<TvePlaylist>(
      tveUrl("details", "playlist", "short-videos", TVE_APP_SLUG),
      REVALIDATE_CATEGORY,
    );
    const videos = await withYoutubeDurations(playlistItems(data).slice(0, limit));
    return videos.map(shortToItem);
  } catch {
    return [];
  }
}

export async function getTveShort(slug: string) {
  const shorts = await getTveShorts(50);
  return shorts.find((item) => item.id === slug) ?? null;
}

export async function getTveShortVideoUrl(slug: string) {
  try {
    const data = await getJson<TvePlaylist>(
      tveUrl("details", "playlist", "short-videos", TVE_APP_SLUG),
      REVALIDATE_CATEGORY,
    );
    const item = playlistItems(data).find((video) => (video.slug || slugify(video.title)) === slug);
    return item?.video_url || "";
  } catch {
    return "";
  }
}

export async function getTveGuideSlots(): Promise<ProgramSlot[]> {
  try {
    const guide = await getJson<TveGuideChannel[]>(appJson("guidetvall", "today"), REVALIDATE_CATEGORY);
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

function videoToProgram(video: TveVideo, category: TveVodCategory): Program {
  const slug = slugify(video.slug || video.title);
  return {
    id: slug,
    slug,
    title: String(video.title || slug),
    badge: String(category.title || "GRTS TV"),
    badgeColor: colorFromLabel(String(category.title || "GRTS TV")),
    filter: slugify(category.slug || category.title) || "all",
    schedule: formatDisplayDate(video.date ? String(video.date) : "") || String(category.title || ""),
    duration: videoClock(video.time),
    image: videoPoster(video),
    poster: videoPoster(video),
    description: String(video.desc || video.title || ""),
    feedUrl: video.webdetail_url || video.feed_url,
    videoFeedUrl: category.video_feed_url,
    streamUrl: video.video_url,
  };
}

function showToProgram(show: TveShow, category?: TveVodCategory): Program {
  const badge = category?.title || "";
  const filter = category?.slug || slugify(badge);
  const image = tveMediaUrl(show.poster) || tveMediaUrl(show.logo_url) || tveMediaUrl(show.logo);
  return {
    id: slugify(show.slug || show.title),
    slug: slugify(show.slug || show.title),
    title: show.title,
    badge,
    badgeColor: badge ? colorFromLabel(badge) : "#e31c23",
    filter,
    schedule: "",
    image,
    poster: image,
    description: show.desc?.trim() || "",
    feedUrl: tveMediaUrl(show.feed_url),
    streamUrl: tveMediaUrl(show.video_url),
  };
}

function videoToReplay(item: TveVideo, programSlug: string): ReplayEpisode {
  const slug = slugify(item.slug || item.title);
  const showSlug = programSlug || slug;
  return {
    id: slug,
    programSlug: showSlug,
    title: item.title,
    category: item.chaine_name || "",
    published: formatDisplayDate(item.date),
    posted: formatDisplayDate(item.date),
    views: formatViewCount(item.views),
    duration: videoClock(item.time),
    durationSeconds: durationToSeconds(item.time || ""),
    image: videoPoster(item),
    about: item.desc || item.title,
    streamFeedUrl: nextPageUrl(item.feed_url || item.webdetail_url),
    streamUrl: tveMediaUrl(item.video_url),
    href: `/programmes/${showSlug}/watch?e=${slug}`,
  };
}

function replayTvToEpisode(item: TveVideo): ReplayEpisode {
  const episode = videoToReplay(item, "replay");
  return { ...episode, href: `/replay/${episode.id}` };
}

function videoItemToReplay(video: VideoItem): ReplayEpisode {
  return {
    id: video.id,
    programSlug: "replay",
    title: video.title,
    category: video.category || "",
    published: video.posted,
    posted: video.posted,
    views: video.views || "",
    duration: video.duration,
    durationSeconds: durationToSeconds(video.duration || ""),
    image: video.image,
    about: video.description || video.title,
    streamFeedUrl: video.streamFeedUrl,
    streamUrl: video.streamUrl,
    href: `/replay/${video.id}`,
  };
}

function replayToVideo(episode: ReplayEpisode): VideoItem {
  return {
    id: episode.id,
    title: episode.title,
    image: episode.image,
    posted: episode.posted,
    description: episode.about,
    category: episode.category,
    views: episode.views,
    duration: episode.duration,
    href: episode.href || `/replay/${episode.id}`,
    streamFeedUrl: episode.streamFeedUrl,
    streamUrl: episode.streamUrl,
  };
}

function sliderToVideo(item: TveVideo): VideoItem {
  const slug = item.slug || slugify(item.title);
  return {
    id: slug,
    title: item.title,
    image: videoPoster(item),
    posted: formatDisplayDate(item.date),
    description: item.desc,
    category: item.chaine_name || "",
    views: formatViewCount(item.views),
    duration: videoClock(item.time),
    href: `/replay/${slug}`,
    streamFeedUrl: item.feed_url || item.webdetail_url,
    streamUrl: item.video_url,
  };
}

export function tveAppSlug() {
  return TVE_APP_SLUG;
}
