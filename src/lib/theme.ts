export const THEMES = ["light", "dark", "system"] as const;

export type ThemePreference = (typeof THEMES)[number];
export type ResolvedTheme = "light" | "dark";

export const DEFAULT_THEME: ThemePreference = "system";
export const THEME_STORAGE_KEY = "grts-theme";

export function isThemePreference(value: unknown): value is ThemePreference {
  return typeof value === "string" && (THEMES as readonly string[]).includes(value);
}

/**
 * Runs inline in <head> before first paint so the right theme is applied
 * immediately (no flash of the wrong theme). Keep it dependency-free.
 */
export const themeInitScript = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var p=localStorage.getItem(k);if(p!=="light"&&p!=="dark")p="system";var d=p==="dark"||(p==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var r=document.documentElement;r.classList.toggle("dark",d);r.style.colorScheme=d?"dark":"light";r.dataset.theme=p;}catch(e){}})();`;
