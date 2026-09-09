function slugFromAppDetailsUrl(url?: string) {
  const match = url?.match(/appdetails\/([^/?#]+)/i);
  return match?.[1];
}

function baseFromAppDetailsUrl(url?: string) {
  const match = url?.match(/^(https?:\/\/[^/]+\/myapiv2)/i);
  return match?.[1];
}

export const TVE_APP_SLUG =
  process.env.NEXT_PUBLIC_TVE_APP_SLUG ??
  slugFromAppDetailsUrl(process.env.EXPO_PUBLIC_API_URL) ??
  "dmedia";

export const TVE_API_BASE =
  process.env.NEXT_PUBLIC_TVE_API_BASE ??
  baseFromAppDetailsUrl(process.env.EXPO_PUBLIC_API_URL) ??
  "https://tveapi.acan.group/myapiv2";

function wordpressApiBase(url?: string) {
  if (!url) return "";
  return url.replace(/\/+$/, "").replace(/\/posts$/i, "");
}

export const WORDPRESS_API_BASE = wordpressApiBase(
  process.env.NEXT_PUBLIC_WORDPRESS_API_BASE,
);

export const TVE_APP_DETAILS_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  `${TVE_API_BASE}/appdetails/${TVE_APP_SLUG}`;
