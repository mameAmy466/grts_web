export async function getJson<T>(url: string, revalidate = 120): Promise<T> {
  const response = await fetch(url, {
    next: { revalidate },
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`Request failed ${response.status}: ${url}`);
  }
  return (await response.json()) as T;
}

export function allItems<T>(payload: unknown): T[] {
  if (Array.isArray(payload)) return payload as T[];
  if (payload && typeof payload === "object" && "allitems" in payload) {
    const items = (payload as { allitems: unknown }).allitems;
    return Array.isArray(items) ? (items as T[]) : [];
  }
  return [];
}
