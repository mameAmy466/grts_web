"use client";

import Link from "next/link";
import { Logo } from "@/components/logo";
import { socialIcons } from "@/components/icons";
import { useLocale } from "@/components/locale-provider";
import { SITE, socialLinks } from "@/lib/data";
import type { ChromeTheme } from "@/lib/types";
import { cn } from "@/lib/utils";

export function SiteFooter({ theme }: { theme: ChromeTheme }) {
  const dark = theme === "dark";
  const { t } = useLocale();

  const broadcast = [
    { href: "/live", label: t("liveTv") },
    { href: "/radio", label: t("radioGambia") },
    { href: "/programmes", label: t("programmes") },
    { href: "/live#guide", label: t("schedules") },
  ];

  const company = [
    { href: "/about", label: t("aboutUs") },
    { href: "/news", label: t("newsPress") },
    { href: "/about#careers", label: t("careers") },
    { href: "/about#contact", label: t("contact") },
  ];

  return (
    <footer
      className={cn(
        "mt-auto border-t",
        dark
          ? "border-[var(--color-bg-primary,#0A0A0A)] bg-[var(--color-bg-secondary,#171717)] text-zinc-300"
          : "border-zinc-200 bg-zinc-100 text-zinc-600",
      )}
    >
      <div className="mx-auto grid w-full max-w-[1514px] gap-10 px-4 py-14 sm:px-8 md:grid-cols-2 lg:grid-cols-4 xl:px-32">
        <div>
          <Logo className={dark ? "text-white" : "text-zinc-900"} />
          <p className="mt-4 max-w-xs text-sm leading-6">{SITE.tagline}</p>
        </div>
        <div>
          <h3 className="text-xs font-bold tracking-[0.14em] text-brand">{t("broadcast").toUpperCase()}</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {broadcast.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "hover:text-brand",
                    item.href === "/programmes" && (dark ? "font-semibold text-white" : "font-semibold text-zinc-900"),
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-bold tracking-[0.14em] text-brand">{t("company").toUpperCase()}</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {company.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-brand">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-bold tracking-[0.14em] text-brand">{t("followUs").toUpperCase()}</h3>
          <div className="mt-4 flex gap-2">
            {socialLinks.map((item) => {
              const Icon = socialIcons[item.name];
              return (
                <a
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={item.name}
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full",
                    dark ? "bg-white/10 hover:bg-brand hover:text-white" : "bg-white hover:bg-brand hover:text-white",
                  )}
                >
                  <Icon className="h-4 w-4" />
                </a>
              );
            })}
          </div>
          <p className="mt-6 text-xs font-medium">{t("downloadApps")}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <StoreBadge store="apple" />
            <StoreBadge store="google" />
          </div>
        </div>
      </div>
      <div
        className={cn(
          "border-t",
          dark ? "border-[var(--color-bg-primary,#0A0A0A)] text-zinc-500" : "border-zinc-200 text-zinc-500",
        )}
      >
        <div className="mx-auto flex w-full max-w-[1514px] flex-col gap-2 px-4 py-4 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-8 xl:px-32">
          <p>{t("rights")}</p>
          <p>{t("government")}</p>
        </div>
      </div>
    </footer>
  );
}

function StoreBadge({ store }: { store: "apple" | "google" }) {
  const label = store === "apple" ? "Download on the" : "GET IT ON";
  const name = store === "apple" ? "App Store" : "Google Play";

  return (
    <span className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-black px-3 py-1.5 text-white">
      <span className="text-lg leading-none">{store === "apple" ? "" : "▶"}</span>
      <span className="leading-tight">
        <span className="block text-[9px] uppercase tracking-wide text-zinc-300">{label}</span>
        <span className="block text-xs font-semibold">{name}</span>
      </span>
    </span>
  );
}
