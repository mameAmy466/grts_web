import { unstable_cache } from "next/cache";
import { allItems, getJson, getJsonUncached } from "@/lib/api/http";
import { TVE_API_BASE, TVE_APP_DETAILS_URL, TVE_APP_SLUG } from "@/lib/env";
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
  time?: string;
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

function videoClock(time?: string) {
  return isRealDuration(time) ? formatClockDuration(durationToSeconds(time!)) : "";
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
    const url = `https://www.googleapis.com/youtube/v3/videos?part=contentDetails,statistics,snippet&id=${chunk.join(",")}&key=${encodeURIComponent(key)}`;
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

export async function getLiveRadioStation(): Promise<RadioStation | null> {
  const radio = (await getLiveRadios())[0];
  if (!radio) return null;
  return {
    title: radio.title || "GRTS Radio",
    description: radio.desc || "National Radio - Gambia",
    streamUrl: radio.stream_url || "",
    image: radio.hd_logo || radio.sd_logo || "",
  };
}

export async function getLivePlayback(channelId: string) {
  try {
    const data = await getJsonUncached<{ web_url?: string; direct_url?: string }>(
      tveUrl("directplayback", channelId, "json"),
    );
    return data?.direct_url || data?.web_url || "";
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
  const items = allItems<TveAndroidItem>(await getJson(appJson("listAndroid")));
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
      const groups = allItems<TveCategoryGroup>(await getJson(menu.feed_url));
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

  for (let page = 0; url && page < 12; page += 1) {
    const payload = await fetchCategoryGridPage(url);
    if (!payload) break;
    const next = allItems<TveVodCategory>(payload).find((item) => item.slug === category.slug)
      ?? allItems<TveVodCategory>(payload)[0];
    videos.push(...(next?.subitems?.data ?? []));
    url = nextPageUrl(next?.subitems?.pagination?.next_page_url);
  }

  const seen = new Set<string>();
  return videos.filter((video) => {
    const key = video.slug || slugify(video.title);
    if (!video.title || !key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function uniquePrograms(programmes: Program[]) {
  const seen = new Set<string>();
  return programmes.filter((program) => {
    if (seen.has(program.slug)) return false;
    seen.add(program.slug);
    return true;
  });
}

async function loadProgramCatalog(): Promise<{
  categories: CatalogFilter[];
  programmes: Program[];
}> {
  const startUrl = await getCategoriesWithVideoUrl();
  const categories = await getAllCategoryPages(startUrl);
  const grouped = await Promise.all(
    categories.map(async (category) => ({
      category,
      videos: await getVideosForCategory(category),
    })),
  );
  const filled = grouped.filter(({ videos }) => videos.length > 0);
  const meta = await youtubeMetaMap(
    filled.flatMap(({ videos }) => videos.filter((video) => !isRealDuration(video.time)).map((video) => video.video_url)),
  );

  return {
    categories: filled.map(({ category }) => ({
      id: category.slug || slugify(category.title),
      label: category.title,
    })),
    programmes: filled.flatMap(({ category, videos }) =>
      videos.map((video) => {
        const fromApi = videoClock(video.time);
        const fromYoutube = meta.get(youtubeVideoId(video.video_url));
        return videoToProgram({ ...video, time: fromApi || fromYoutube?.duration || video.time }, category);
      }),
    ),
  };
}

export async function getTveProgramCatalog(): Promise<{
  categories: CatalogFilter[];
  programmes: Program[];
}> {
  try {
    return await unstable_cache(loadProgramCatalog, ["tve-program-catalog-duration", TVE_APP_SLUG], {
      revalidate: 120,
    })();
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
    const videos = await withYoutubeDurations(allItems<TveVideo>(await getJson(feedUrl)));
    return videos.map((item) => videoToReplay(item, programSlug));
  } catch {
    return [];
  }
}

export async function getTveSliders(): Promise<VideoItem[]> {
  try {
    const videos = await withYoutubeDurations(allItems<TveVideo>(await getJson(appJson("alaunesliders"))));
    return videos.map(sliderToVideo);
  } catch {
    return [];
  }
}

async function getAlauneEpisodes(): Promise<ReplayEpisode[]> {
  const menu = await getAndroidItem("CHAINE A la UNE");
  if (!menu?.feed_url) return [];
  const groups = allItems<{ list_alaune_by_group?: string }>(await getJson(menu.feed_url));
  const url = groups[0]?.list_alaune_by_group;
  if (!url) return [];
  const videos = await withYoutubeDurations(allItems<TveVideo>(await getJson(url)));
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
      const videos = await withYoutubeDurations(allItems<TveVideo>(await getJson(category.video_feed_url)));
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
    image: item.logo_url || item.logo || "",
    duration: videoClock(item.time),
    href: `/shorts/${slug}`,
    videoUrl: item.video_url,
  };
}

export async function getTveShorts(limit = 10): Promise<ShortItem[]> {
  try {
    const data = await getJson<TvePlaylist>(
      tveUrl("details", "playlist", "short-videos", TVE_APP_SLUG),
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
    );
    const item = playlistItems(data).find((video) => (video.slug || slugify(video.title)) === slug);
    return item?.video_url || "";
  } catch {
    return "";
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

function videoToProgram(video: TveVideo, category: TveVodCategory): Program {
  const slug = video.slug || slugify(video.title);
  return {
    id: slug,
    slug,
    title: video.title,
    badge: category.title,
    badgeColor: colorFromLabel(category.title),
    filter: category.slug || slugify(category.title),
    schedule: formatDisplayDate(video.date) || category.title,
    duration: videoClock(video.time),
    image: video.logo_url || video.logo || "",
    poster: video.logo_url || video.logo,
    description: video.desc || video.title,
    feedUrl: video.webdetail_url || video.feed_url,
    videoFeedUrl: category.video_feed_url,
    streamUrl: video.video_url,
  };
}

function showToProgram(show: TveShow, category?: TveVodCategory): Program {
  const badge = category?.title || show.chaine_name || "GRTS TV";
  const filter = category?.slug || slugify(badge);
  return {
    id: show.slug || slugify(show.title),
    slug: show.slug || slugify(show.title),
    title: show.title,
    badge,
    badgeColor: colorFromLabel(badge),
    filter,
    schedule: category?.title || show.chaine_name || "GRTS TV",
    image: show.poster || show.logo_url || show.logo || "",
    poster: show.poster || show.logo_url || show.logo,
    description: show.desc || `${show.title} on GRTS TV.`,
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
    category: item.chaine_name || "",
    published: formatDisplayDate(item.date),
    posted: formatDisplayDate(item.date),
    views: formatViewCount(item.views),
    duration: videoClock(item.time),
    durationSeconds: durationToSeconds(item.time || ""),
    image: item.logo_url || item.logo || "",
    about: item.desc || item.title,
    streamFeedUrl: item.feed_url || item.webdetail_url,
    streamUrl: item.video_url,
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
    image: item.logo_url || item.logo || "",
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
