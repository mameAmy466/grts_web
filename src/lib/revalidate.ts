function seconds(name: string, fallback: number) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value >= 0 ? value : fallback;
}

export const REVALIDATE_HOME = seconds("REVALIDATE_HOME", 120);

export const REVALIDATE_CATEGORY = seconds("REVALIDATE_CATEGORY", 600);

export const REVALIDATE_STATIC = seconds("REVALIDATE_STATIC", 3600);
