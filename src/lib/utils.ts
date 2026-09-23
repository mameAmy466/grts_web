export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function unsplash(_id?: string, _width = 1200) {
  return "/logo.png";
}

export function titleCase(slug: string) {
  return slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function clipText(value: string, max = 90) {
  const text = value.replace(/\s+/g, " ").trim();
  if (!text || text.length <= max) return text;
  return `${text.slice(0, max).replace(/\s+\S*$/, "").trimEnd()}…`;
}

const HTML_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
  nbsp: " ",
  rsquo: "’",
  lsquo: "‘",
  rdquo: "”",
  ldquo: "“",
  mdash: "—",
  ndash: "–",
  hellip: "…",
  laquo: "«",
  raquo: "»",
};

export function decodeHtmlEntities(value: string) {
  return value
    .replace(/&amp;(#x?[0-9a-f]+|[a-z]+);/gi, "&$1;")
    .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, body: string) => {
      if (body.startsWith("#")) {
        const code = body[1] === "x" || body[1] === "X" ? Number.parseInt(body.slice(2), 16) : Number(body.slice(1));
        return Number.isFinite(code) ? String.fromCodePoint(code) : match;
      }
      return HTML_ENTITIES[body.toLowerCase()] ?? match;
    });
}

export function stripHtml(value: string) {
  return decodeHtmlEntities(value.replace(/<[^>]+>/g, " ")).replace(/\s+/g, " ").trim();
}

function parseFlexibleDate(value: string) {
  const trimmed = value
    .trim()
    .replace(/^(published on|publié le|le)\s+/i, "");
  if (!trimmed) return null;
  if (/^(il y a|\d+\s+(min|minute|hour|day|week|month|year)s?\s+ago)/i.test(trimmed)) {
    return null;
  }

  const dmy = trimmed.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);
  if (dmy) {
    const date = new Date(Number(dmy[3]), Number(dmy[2]) - 1, Number(dmy[1]));
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const ymd = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (ymd) {
    const date = new Date(Number(ymd[1]), Number(ymd[2]) - 1, Number(ymd[3]));
    return Number.isNaN(date.getTime()) ? null : date;
  }

  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function formatDisplayDate(value?: string) {
  if (!value) return "";
  if (/^le \d/i.test(value.trim())) return value;
  const date = parseFlexibleDate(value);
  if (!date) return value;
  const day = date.getDate();
  const month = date.toLocaleDateString("fr-FR", { month: "long" });
  return `le ${day === 1 ? "1er" : day} ${month} ${date.getFullYear()}`;
}

export function formatWpDate(value: string) {
  return formatDisplayDate(value) || value;
}

export function colorFromLabel(label: string) {
  const palette = ["#e31c23", "#16a34a", "#2563eb", "#ea580c", "#7c3aed", "#0d9488", "#ca8a04", "#db2777"];
  let hash = 0;
  for (const char of label) hash += char.charCodeAt(0);
  return palette[hash % palette.length];
}

export function youtubeVideoId(url?: string) {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("youtu")) return "";
    return parsed.searchParams.get("v") || parsed.pathname.split("/").filter(Boolean).pop() || "";
  } catch {
    return "";
  }
}

export function youtubeEmbedUrl(url?: string, params = "") {
  const id = youtubeVideoId(url);
  return id ? `https://www.youtube.com/embed/${id}?rel=0${params}` : "";
}

export function durationToSeconds(value: string) {
  const parts = value.split(":").map((part) => Number(part) || 0);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return 0;
}

export function isRealDuration(value?: string) {
  return Boolean(value && durationToSeconds(value) > 0);
}

export function formatClockDuration(seconds: number) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "";
  const total = Math.round(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const rest = total % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(rest).padStart(2, "0")}`;
  }
  return `${minutes}:${String(rest).padStart(2, "0")}`;
}

export function isoDurationToSeconds(value?: string) {
  if (!value) return 0;
  const match = value.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/i);
  if (!match) return 0;
  return (Number(match[1]) || 0) * 3600 + (Number(match[2]) || 0) * 60 + (Number(match[3]) || 0);
}

export function viewCount(value?: string | number) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (!value) return 0;
  const parsed = Number(String(value).replace(/[^\d]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

export function formatViewCount(value?: string | number) {
  const count = viewCount(value);
  if (count <= 0) return "";
  if (count >= 1_000_000) {
    const compact = count >= 10_000_000 ? Math.round(count / 1_000_000) : Number((count / 1_000_000).toFixed(1));
    return `${compact}M views`;
  }
  if (count >= 1_000) {
    const compact = count >= 10_000 ? Math.round(count / 1_000) : Number((count / 1_000).toFixed(1));
    return `${compact}K views`;
  }
  return `${count} views`;
}
