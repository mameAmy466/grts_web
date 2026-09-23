import { unstable_cache } from "next/cache";
import { Agent, request } from "undici";

const CONNECT_MS = 20_000;
const ATTEMPTS = 2;

const dispatcher = new Agent({
  connectTimeout: CONNECT_MS,
  headersTimeout: CONNECT_MS,
  bodyTimeout: 30_000,
  connections: 8,
  connect: {
    timeout: CONNECT_MS,
    autoSelectFamily: true,
    autoSelectFamilyAttemptTimeout: 250,
  },
});

function errorCode(error: unknown) {
  if (!error || typeof error !== "object") return "";
  const direct = "code" in error ? String(error.code) : "";
  const cause = "cause" in error && error.cause && typeof error.cause === "object" ? error.cause : null;
  const nested = cause && "code" in cause ? String(cause.code) : "";
  return nested || direct;
}

function isTransient(error: unknown, status = 0) {
  if (status >= 500) return true;
  const code = errorCode(error);
  return (
    code === "UND_ERR_CONNECT_TIMEOUT" ||
    code === "UND_ERR_HEADERS_TIMEOUT" ||
    code === "UND_ERR_BODY_TIMEOUT" ||
    code === "UND_ERR_SOCKET" ||
    code === "ETIMEDOUT" ||
    code === "ECONNRESET" ||
    code === "EAI_AGAIN" ||
    (error instanceof TypeError && error.message === "fetch failed")
  );
}

function readHeader(headers: unknown, name: string) {
  if (headers && typeof headers === "object" && "get" in headers && typeof headers.get === "function") {
    return String(headers.get(name) ?? "");
  }
  if (headers && typeof headers === "object") {
    const value = (headers as Record<string, string | string[] | undefined>)[name.toLowerCase()];
    return String(Array.isArray(value) ? value[0] : value ?? "");
  }
  return "";
}

async function requestJson<T>(url: string): Promise<{ data: T; header: (name: string) => string }> {
  const { statusCode, body, headers } = await request(url, {
    dispatcher,
    headers: { accept: "application/json" },
  });

  if (statusCode < 200 || statusCode >= 300) {
    const error = new Error(`Request failed ${statusCode}: ${url}`);
    (error as Error & { status: number }).status = statusCode;
    throw error;
  }

  return {
    data: (await body.json()) as T,
    header: (name) => readHeader(headers, name),
  };
}

async function loadJson<T>(url: string) {
  let lastError: unknown;

  for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
    try {
      return await requestJson<T>(url);
    } catch (error) {
      lastError = error;
      const status = error instanceof Error && "status" in error ? Number(error.status) : 0;
      if (attempt === ATTEMPTS || !isTransient(error, status)) break;
    }
  }

  const code = errorCode(lastError) || (lastError instanceof Error ? lastError.message : "request failed");
  throw new Error(code);
}

type CachedJson<T> = { ok: true; data: T; totalPages: number } | { ok: false; message: string };

async function cachedJson<T>(url: string, revalidate: number, key: string) {
  return unstable_cache(
    async (): Promise<CachedJson<T>> => {
      try {
        const result = await loadJson<T>(url);
        return {
          ok: true,
          data: result.data,
          totalPages: Number(result.header("x-wp-totalpages") || 1),
        };
      } catch (error) {
        const message = error instanceof Error ? error.message : "request failed";
        console.warn(`[api] ${message} ${url}`);
        return { ok: false, message };
      }
    },
    [key, url],
    { revalidate },
  )();
}

export async function getJsonUncached<T>(url: string): Promise<T | null> {
  try {
    return (await loadJson<T>(url)).data;
  } catch (error) {
    const message = error instanceof Error ? error.message : "request failed";
    console.warn(`[api] ${message} ${url}`);
    return null;
  }
}

export async function getJson<T>(url: string, revalidate = 120): Promise<T> {
  if (url.includes("/newsposts/")) {
    const data = await getJsonUncached<T>(url);
    if (data == null) throw new Error("request failed");
    return data;
  }
  const cached = await cachedJson<T>(url, revalidate, "json");
  if (!cached.ok) throw new Error(cached.message);
  return cached.data;
}

export async function getJsonMeta<T>(url: string, revalidate = 60): Promise<{ data: T; totalPages: number }> {
  const cached = await cachedJson<T>(url, revalidate, "json-meta");
  if (!cached.ok) throw new Error(cached.message);
  return { data: cached.data, totalPages: cached.totalPages };
}

export function allItems<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object" && "allitems" in payload) {
    const items = (payload as { allitems: unknown }).allitems;
    return Array.isArray(items) ? (items as T[]) : [];
  }
  return [];
}
