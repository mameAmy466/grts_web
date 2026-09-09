"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
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
import { SITE, socialLinks } from "@/lib/data";
import type { ChromeTheme } from "@/lib/types";
import { cn } from "@/lib/utils";

type NewsNavItem = { slug: string; label: string };

const nav = [
  { href: "/", label: "Home" },
  { href: "/live", label: "Live" },
  { href: "/programmes", label: "TV programs" },
  { href: "/news", label: "News", children: true },
  { href: "/about", label: "About" },
];

const mobileNav = [
  { href: "/", label: "Home" },
  { href: "/live", label: "Live TV" },
  { href: "/radio", label: "Radio" },
  { href: "/programmes", label: "TV programs" },
  { href: "/shorts", label: "Shorts" },
  { href: "/news", label: "News", children: true },
  { href: "/about", label: "About" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/live") return pathname === "/live";
  if (href === "/radio") return pathname === "/radio";
  if (href === "/news") return pathname.startsWith("/news");
  if (href === "/shorts") return pathname.startsWith("/shorts");
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader({
  newsCategories = [],
}: {
  theme?: ChromeTheme;
  newsCategories?: NewsNavItem[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [newsOpen, setNewsOpen] = useState(false);
  const [mobileNewsOpen, setMobileNewsOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-[var(--color-bg-primary,#0A0A0A)] bg-[#171717] text-white">
      <div className="hidden border-b border-[var(--color-bg-primary,#0A0A0A)] bg-[var(--color-bg-primary,#0A0A0A)] text-[12px] text-zinc-400 sm:block">
        <div className="mx-auto flex h-12 w-full max-w-[1514px] items-center justify-between px-6 sm:px-8 xl:px-32">
          <div className="flex items-center gap-4">
            <a href={`tel:${SITE.phone.replace(/\s/g, "")}`} className="inline-flex items-center gap-1.5 hover:text-brand">
              <IconPhone className="h-3.5 w-3.5" />
              {SITE.phone}
            </a>
            <a href={`mailto:${SITE.email}`} className="hidden items-center gap-1.5 sm:inline-flex hover:text-brand">
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
                    "flex h-6 w-6 items-center justify-center rounded-full",
                    "bg-white/10 hover:bg-brand hover:text-white",
                  )}
                >
                  <Icon className="h-3 w-3" />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto flex h-[68px] w-full max-w-[1514px] items-center px-6 sm:px-8 xl:px-32">
        <Logo className="text-white" />

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
                    isActive(pathname, item.href) ? "text-brand" : "hover:text-white",
                    isActive(pathname, item.href) && "shadow-[inset_0_-2px_0_0_var(--color-brand)]",
                  )}
                >
                  {item.label}
                  <IconChevronDown className="h-3.5 w-3.5" />
                </Link>
                {newsOpen ? (
                  <div
                    className={cn(
                      "absolute left-1/2 top-full z-50 w-52 -translate-x-1/2 rounded-lg border py-2 shadow-xl",
                      "border-white/10 bg-[#171717]",
                    )}
                  >
                    {newsCategories.map((category) => (
                      <Link
                        key={category.slug}
                        href={`/news/${category.slug}`}
                        className="block px-4 py-2 text-sm hover:text-brand"
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
                  isActive(pathname, item.href) ? "text-brand" : "hover:text-white",
                  isActive(pathname, item.href) && "shadow-[inset_0_-2px_0_0_var(--color-brand)]",
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
              aria-label="Search"
              className="flex h-6 w-5 shrink-0 items-center justify-center text-white hover:text-brand"
            >
              <IconSearch className="h-5 w-5" />
            </button>
            <button
              type="button"
              className="inline-flex h-6 w-[41px] shrink-0 items-center justify-center rounded-[4px] border border-white/20 px-3 py-1.5 text-[11px] font-semibold leading-none text-white hover:border-brand hover:text-brand"
            >
              EN
            </button>
          </div>
          <button
            type="button"
            className="lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
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
            aria-label="Close menu"
            className="fixed inset-x-0 bottom-0 top-[var(--site-header)] z-30 bg-black/50"
            onClick={() => setOpen(false)}
          />
          <nav
            className={cn(
              "absolute inset-x-0 top-full z-40 max-h-[calc(100dvh-var(--site-header))] overflow-y-auto border-t",
              "border-white/10 bg-[#171717]",
            )}
          >
            <div className="px-4 py-2">
              {mobileNav.map((item) =>
                item.children ? (
                  <div key={item.href} className="border-b border-white/10">
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
                        aria-label={mobileNewsOpen ? "Hide news categories" : "Show news categories"}
                        aria-expanded={mobileNewsOpen}
                        onClick={() => setMobileNewsOpen((value) => !value)}
                        className="flex h-11 w-11 items-center justify-center text-zinc-400"
                      >
                        <IconChevronDown className={cn("h-4 w-4 transition-transform", mobileNewsOpen && "rotate-180")} />
                      </button>
                    </div>
                    {mobileNewsOpen ? (
                      <div className="mb-3 ml-1 grid grid-cols-2 gap-1 border-l border-white/10 pl-3">
                        <Link
                          href="/news"
                          onClick={() => setOpen(false)}
                          className={cn(
                            "col-span-2 rounded-md px-2 py-2 text-sm",
                            pathname === "/news" ? "text-brand" : "text-zinc-400",
                          )}
                        >
                          All news
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
                      "border-white/10",
                      isActive(pathname, item.href) ? "text-brand" : "",
                    )}
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </div>

            <div className="mt-2 bg-black/20 px-4 pb-6 pt-3">
              <div className="mb-4 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                  Language
                </span>
                <span className="btn-glass inline-flex h-8 items-center rounded-full px-3 text-xs font-semibold text-brand">
                  EN
                </span>
              </div>
              <div className="flex flex-col gap-2 text-sm text-zinc-400">
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
                        "flex h-9 w-9 items-center justify-center rounded-full",
                        "bg-white/10 hover:bg-brand hover:text-white",
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
    </header>
  );
}
