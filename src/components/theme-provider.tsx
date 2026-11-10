"use client";

import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";
import {
  DEFAULT_THEME,
  THEME_STORAGE_KEY,
  isThemePreference,
  type ResolvedTheme,
  type ThemePreference,
} from "@/lib/theme";

type ThemeContextValue = {
  /** What the user picked: light, dark or follow the system. */
  theme: ThemePreference;
  /** What is actually displayed. */
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemePreference) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);
const THEME_EVENT = "grts-theme";
const MEDIA_QUERY = "(prefers-color-scheme: dark)";

function readPreference(): ThemePreference {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isThemePreference(stored) ? stored : DEFAULT_THEME;
  } catch {
    return DEFAULT_THEME;
  }
}

function readSystemDark() {
  return window.matchMedia(MEDIA_QUERY).matches;
}

function subscribePreference(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY) onChange();
  };
  window.addEventListener(THEME_EVENT, onChange);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(THEME_EVENT, onChange);
    window.removeEventListener("storage", onStorage);
  };
}

function subscribeSystem(onChange: () => void) {
  const media = window.matchMedia(MEDIA_QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function resolve(preference: ThemePreference): ResolvedTheme {
  if (preference === "system") return readSystemDark() ? "dark" : "light";
  return preference;
}

function applyTheme(preference: ThemePreference, resolved: ResolvedTheme = resolve(preference)) {
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
  root.style.colorScheme = resolved;
  root.dataset.theme = preference;
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribePreference, readPreference, () => DEFAULT_THEME);
  const systemDark = useSyncExternalStore(subscribeSystem, readSystemDark, () => false);
  const resolvedTheme: ResolvedTheme = theme === "system" ? (systemDark ? "dark" : "light") : theme;

  const setTheme = useCallback((next: ThemePreference) => {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage unavailable (private mode…): the choice still applies for this page.
    }
    applyTheme(next);
    window.dispatchEvent(new Event(THEME_EVENT));
  }, []);

  // Re-apply from the real sources (storage + media query) rather than from
  // state: during hydration the state still holds the server defaults, and in
  // development Strict Mode's remount strips the class the inline script set.
  useLayoutEffect(() => {
    applyTheme(readPreference());
  }, [theme, resolvedTheme]);

  const value = useMemo<ThemeContextValue>(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    return { theme: DEFAULT_THEME, resolvedTheme: "light", setTheme: () => undefined };
  }
  return context;
}
