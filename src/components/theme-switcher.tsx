"use client";

import { useEffect, useRef, useState, type ComponentType, type SVGProps } from "react";
import { IconMonitor, IconMoon, IconSun } from "@/components/icons";
import { useLocale } from "@/components/locale-provider";
import { useTheme } from "@/components/theme-provider";
import type { MessageKey } from "@/lib/i18n";
import type { ThemePreference } from "@/lib/theme";
import { cn } from "@/lib/utils";

const OPTIONS: Array<{
  value: ThemePreference;
  label: MessageKey;
  Icon: ComponentType<SVGProps<SVGSVGElement>>;
}> = [
  { value: "light", label: "themeLight", Icon: IconSun },
  { value: "dark", label: "themeDark", Icon: IconMoon },
  { value: "system", label: "themeSystem", Icon: IconMonitor },
];

/** Compact icon button + dropdown, for the desktop header. */
export function ThemeMenu({ onOpen }: { onOpen?: () => void }) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const TriggerIcon = theme === "system" ? IconMonitor : resolvedTheme === "dark" ? IconMoon : IconSun;

  useEffect(() => {
    if (!open) return;
    function onPointer(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={t("theme")}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => {
          onOpen?.();
          setOpen((value) => !value);
        }}
        className="flex h-6 w-6 shrink-0 items-center justify-center text-fg hover:text-brand"
      >
        <TriggerIcon className="h-5 w-5" />
      </button>
      {open ? (
        <div
          role="listbox"
          aria-label={t("theme")}
          className="absolute right-0 top-full z-50 mt-2 w-40 overflow-hidden rounded-lg border border-line bg-card py-1 text-fg shadow-xl"
        >
          {OPTIONS.map(({ value, label, Icon }) => (
            <button
              key={value}
              type="button"
              role="option"
              aria-selected={theme === value}
              onClick={() => {
                setTheme(value);
                setOpen(false);
              }}
              className={cn(
                "flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm hover:text-brand",
                theme === value && "text-brand",
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{t(label)}</span>
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/** Segmented control, for the mobile menu. */
export function ThemeSegmented() {
  const { theme, setTheme } = useTheme();
  const { t } = useLocale();

  return (
    <div role="radiogroup" aria-label={t("theme")} className="flex gap-1">
      {OPTIONS.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          role="radio"
          aria-checked={theme === value}
          aria-label={t(label)}
          title={t(label)}
          onClick={() => setTheme(value)}
          className={cn(
            "inline-flex h-8 min-w-8 items-center justify-center gap-1.5 rounded-full px-3 text-xs font-semibold",
            theme === value ? "bg-brand text-white" : "btn-chrome text-fg-soft",
          )}
        >
          <Icon className="h-3.5 w-3.5" />
          <span className="hidden min-[380px]:inline">{t(label)}</span>
        </button>
      ))}
    </div>
  );
}
