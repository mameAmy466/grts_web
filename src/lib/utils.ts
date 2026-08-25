export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function unsplash(id: string, width = 1200) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=80`;
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

export function stripHtml(value: string) {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/\s+/g, " ")
    .trim();
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

export function youtubeEmbedUrl(url?: string) {
  if (!url) return "";
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.includes("youtu")) return "";
    const id = parsed.searchParams.get("v") || parsed.pathname.split("/").filter(Boolean).pop();
    return id ? `https://www.youtube.com/embed/${id}?rel=0` : "";
  } catch {
    return "";
  }
}

export function durationToSeconds(value: string) {
  const parts = value.split(":").map((part) => Number(part) || 0);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return 0;
}
