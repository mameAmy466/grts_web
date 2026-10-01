"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/logo";
import {
  IconChevronDown,
  IconClose,
  IconMail,
  IconMenu,
  IconPhone,
  IconSearch,
  socialIcons,
} from "@/components/icons";
import { LOCALES, useLocale } from "@/components/locale-provider";
import { SiteSearch } from "@/components/site-search";
import { SITE, socialLinks } from "@/lib/data";
import type { ChromeTheme } from "@/lib/types";
import { cn } from "@/lib/utils";

type NewsNavItem = { slug: string; label: string };

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/live") return pathname === "/live";
  if (href === "/radio") return pathname === "/radio";
  if (href === "/news") return pathname.startsWith("/news");
  if (href === "/shorts") return pathname.startsWith("/shorts");
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader({
  theme = "dark",
  newsCategories = [],
}: {
  theme?: ChromeTheme;
  newsCategories?: NewsNavItem[];
}) {
  const pathname = usePathname();
  const { locale, setLocale, t } = useLocale();
  const [open, setOpen] = useState(false);
  const [newsOpen, setNewsOpen] = useState(false);
  const [mobileNewsOpen, setMobileNewsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const light = theme === "light";
  const currentLang = LOCALES.find((item) => item.code === locale) ?? LOCALES[0];

  const nav = [
    { href: "/", label: t("navHome") },
    { href: "/live", label: t("navLive") },
    { href: "/programmes", label: t("navPrograms") },
    { href: "/news", label: t("navNews"), children: true },
    { href: "/about", label: t("navAbout") },
  ];

  const mobileNav = [
    { href: "/", label: t("navHome") },
    { href: "/live", label: t("navLiveTv") },
    { href: "/radio", label: t("navRadio") },
    { href: "/programmes", label: t("navPrograms") },
    { href: "/shorts", label: t("navShorts") },
    { href: "/news", label: t("navNews"), children: true },
    { href: "/about", label: t("navAbout") },
  ];

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!langOpen) return;
    function onPointer(event: MouseEvent) {
      if (!langRef.current?.contains(event.target as Node)) setLangOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setLangOpen(false);
    }
    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [langOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40",
        light
          ? "bg-[var(--color-bg-tertiary,#F5F5F5)] text-zinc-800"
          : "border-b border-[var(--color-bg-primary,#0A0A0A)] bg-[#171717] text-white",
      )}
    >
      <div
        className={cn(
          "hidden text-[12px] sm:block",
          light
            ? "bg-white text-zinc-500"
            : "border-b border-[var(--color-bg-primary,#0A0A0A)] bg-[var(--color-bg-primary,#0A0A0A)] text-zinc-400",
        )}
      >
        <div className="mx-auto flex h-12 w-full max-w-[1514px] items-center justify-between px-4 sm:px-8 xl:px-32">
          <div className="flex items-center gap-4">
            <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1.5 hover:text-brand">
              <IconPhone className="h-3.5 w-3.5" />
              {SITE.phone}
            </a>
            <a href={`mailto:${SITE.email}`} className="hidden items-center gap-1.5 hover:text-brand sm:inline-flex">
              <IconMail className="h-3.5 w-3.5" />
              {SITE.email}
            </a>
          </div>
          <div className="flex items-center gap-2">
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
                    "flex h-6 w-6 items-center justify-center rounded-full hover:bg-brand hover:text-white",
                    light ? "bg-zinc-200 text-zinc-600" : "bg-white/10",
                  )}
                >
                  <Icon className="h-3 w-3" />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto flex h-[68px] w-full max-w-[1514px] items-center px-4 sm:px-8 xl:px-32">
        <Logo className={light ? "text-zinc-900" : "text-white"} />

        <nav className="hidden items-center gap-7 text-[15px] font-medium lg:ml-16 lg:flex xl:ml-[265px]">
          {nav.map((item) =>
            item.children ? (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => setNewsOpen(true)}
                onMouseLeave={() => setNewsOpen(false)}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-1 py-5",
                    isActive(pathname, item.href)
                      ? "text-brand shadow-[inset_0_-2px_0_0_var(--color-brand)]"
                      : light
                        ? "hover:text-zinc-950"
                        : "hover:text-white",
                  )}
                >
                  {item.label}
                  <IconChevronDown className="h-3.5 w-3.5" />
                </Link>
                {newsOpen ? (
                  <div
                    className={cn(
                      "absolute left-1/2 top-full z-50 w-52 -translate-x-1/2 rounded-lg border py-2 shadow-xl",
                      light
                        ? "border-zinc-200 bg-[var(--color-bg-tertiary,#F5F5F5)]"
                        : "border-white/10 bg-[#171717]",
                    )}
                  >
                    {newsCategories.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/news/${category.slug}`}
                        className={cn(
                          "block px-4 py-2 text-sm hover:text-brand",
                          light ? "text-zinc-700" : "",
                        )}
                      >
                        {category.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "py-5",
                  isActive(pathname, item.href)
                    ? "text-brand shadow-[inset_0_-2px_0_0_var(--color-brand)]"
                    : light
                      ? "hover:text-zinc-950"
                      : "hover:text-white",
                )}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="flex h-6 w-[85px] items-center gap-6">
            <button
              type="button"
              aria-label={t("search")}
              aria-expanded={searchOpen}
              onClick={() => {
                setLangOpen(false);
                setOpen(false);
                setSearchOpen(true);
              }}
              className={cn(
                "flex h-6 w-5 shrink-0 items-center justify-center hover:text-brand",
                light ? "text-zinc-800" : "text-white",
              )}
            >
              <IconSearch className="h-5 w-5" />
            </button>
            <div ref={langRef} className="relative">
              <button
                type="button"
                aria-label={t("language")}
                aria-haspopup="listbox"
                aria-expanded={langOpen}
                onClick={() => {
                  setSearchOpen(false);
                  setLangOpen((value) => !value);
                }}
                className={cn(
                  "inline-flex h-6 w-[41px] shrink-0 items-center justify-center rounded-[4px] px-3 py-1.5 text-[11px] font-semibold leading-none hover:text-brand",
                  light ? "btn-glass text-zinc-800" : "btn-glass-dark text-white",
                )}
              >
                {currentLang.short}
              </button>
              {langOpen ? (
                <div
                  role="listbox"
                  className={cn(
                    "absolute right-0 top-full z-50 mt-2 w-36 overflow-hidden rounded-lg border py-1 shadow-xl",
                    light
                      ? "border-zinc-200 bg-white text-zinc-800"
                      : "border-white/10 bg-[#171717] text-white",
                  )}
                >
                  {LOCALES.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      role="option"
                      aria-selected={item.code === locale}
                      onClick={() => {
                        setLocale(item.code);
                        setLangOpen(false);
                      }}
                      className={cn(
                        "flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:text-brand",
                        item.code === locale && "text-brand",
                      )}
                    >
                      <span>{item.name}</span>
                      <span className="text-[11px] font-semibold">{item.short}</span>
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
          <button
            type="button"
            className="lg:hidden"
            aria-label={open ? t("closeMenu") : t("openMenu")}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <IconClose className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open ? (
        <div className="lg:hidden">
          <button
            type="button"
            aria-label={t("closeMenu")}
            className="fixed inset-x-0 bottom-0 top-[var(--site-header)] z-30 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <nav
            className={cn(
              "absolute inset-x-0 top-full z-40 max-h-[calc(100dvh-var(--site-header))] overflow-y-auto border-t",
              light
                ? "border-zinc-200 bg-[var(--color-bg-tertiary,#F5F5F5)]"
                : "border-white/10 bg-[#171717]",
            )}
          >
            <div className="px-4 py-2">
              {mobileNav.map((item) =>
                item.children ? (
                  <div
                    key={item.href}
                    className={cn("border-b", light ? "border-zinc-200" : "border-white/10")}
                  >
                    <div className="flex items-center">
                      <Link
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className={cn(
                          "flex-1 py-3.5 text-[16px] font-semibold",
                          isActive(pathname, item.href) ? "text-brand" : "",
                        )}
                      >
                        {item.label}
                      </Link>
                      <button
                        type="button"
                        aria-label={mobileNewsOpen ? t("hideNews") : t("showNews")}
                        aria-expanded={mobileNewsOpen}
                        onClick={() => setMobileNewsOpen((value) => !value)}
                        className="flex h-11 w-11 items-center justify-center text-zinc-400"
                      >
                        <IconChevronDown className={cn("h-4 w-4 transition-transform", mobileNewsOpen && "rotate-180")} />
                      </button>
                    </div>
                    {mobileNewsOpen ? (
                      <div
                        className={cn(
                          "mb-3 ml-1 grid grid-cols-2 gap-1 border-l pl-3",
                          light ? "border-zinc-200" : "border-white/10",
                        )}
                      >
                        <Link
                          href="/news"
                          onClick={() => setOpen(false)}
                          className={cn(
                            "col-span-2 rounded-md px-2 py-2 text-sm",
                            pathname === "/news" ? "text-brand" : light ? "text-zinc-500" : "text-zinc-400",
                          )}
                        >
                          {t("allNews")}
                        </Link>
                        {newsCategories.map((category) => (
                          <Link
                            key={category.slug}
                            href={`/news/${category.slug}`}
                            onClick={() => setOpen(false)}
                            className={cn(
                              "rounded-md px-2 py-2 text-sm",
                              pathname.startsWith(`/news/${category.slug}`)
                                ? "text-brand"
                                : light
                                  ? "text-zinc-500"
                                  : "text-zinc-400",
                            )}
                          >
                            {category.label}
                          </Link>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block border-b py-3.5 text-[16px] font-semibold",
                      light ? "border-zinc-200" : "border-white/10",
                      isActive(pathname, item.href) ? "text-brand" : "",
                    )}
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </div>

            <div className={cn("mt-2 px-4 pb-6 pt-3", light ? "bg-zinc-50" : "bg-black/20")}>
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  {t("language")}
                </span>
                <div className="flex gap-1">
                  {LOCALES.map((item) => (
                    <button
                      key={item.code}
                      type="button"
                      onClick={() => setLocale(item.code)}
                      className={cn(
                        "inline-flex h-8 min-w-8 items-center justify-center rounded-full px-3 text-xs font-semibold",
                        item.code === locale
                          ? "bg-brand text-white"
                          : light
                            ? "bg-zinc-200 text-zinc-700"
                            : "btn-glass text-zinc-300",
                      )}
                    >
                      {item.short}
                    </button>
                  ))}
                </div>
              </div>
              <div className={cn("flex flex-col gap-2 text-sm", light ? "text-zinc-600" : "text-zinc-400")}>
                <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-2 hover:text-brand">
                  <IconPhone className="h-4 w-4" />
                  {SITE.phone}
                </a>
                <a href={`mailto:${SITE.email}`} className="inline-flex items-center gap-2 hover:text-brand">
                  <IconMail className="h-4 w-4" />
                  {SITE.email}
                </a>
              </div>
              <div className="mt-4 flex items-center gap-2">
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
                        "flex h-9 w-9 items-center justify-center rounded-full hover:bg-brand hover:text-white",
                        light ? "bg-zinc-200 text-zinc-600" : "bg-white/10",
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </a>
                  );
                })}
              </div>
            </div>
          </nav>
        </div>
      ) : null}

      <SiteSearch open={searchOpen} onClose={() => setSearchOpen(false)} theme={theme} />
    </header>
  );
}
