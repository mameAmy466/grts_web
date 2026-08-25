"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
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

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href === "/live") return pathname === "/live" || pathname === "/radio";
  if (href === "/news") return pathname.startsWith("/news");
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader({
  theme,
  newsCategories = [],
}: {
  theme: ChromeTheme;
  newsCategories?: NewsNavItem[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [newsOpen, setNewsOpen] = useState(false);
  const dark = theme === "dark";

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b",
        dark ? "border-white/10 bg-[#0a0a0a] text-white" : "border-zinc-200 bg-white text-zinc-900",
      )}
    >
      <div
        className={cn(
          "border-b text-[12px]",
          dark ? "border-white/10 bg-black text-zinc-400" : "border-zinc-200 bg-zinc-100 text-zinc-500",
        )}
      >
        <div className="mx-auto flex h-9 max-w-[1240px] items-center justify-between px-4 sm:px-6">
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
                    dark ? "bg-white/10 hover:bg-brand hover:text-white" : "bg-zinc-200 hover:bg-brand hover:text-white",
                  )}
                >
                  <Icon className="h-3 w-3" />
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto flex h-[72px] max-w-[1240px] items-center justify-between gap-4 px-4 sm:px-6">
        <Logo className={dark ? "text-white" : "text-zinc-900"} />

        <nav className="hidden items-center gap-7 text-[15px] font-medium lg:flex">
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
                    "inline-flex items-center gap-1 py-6",
                    isActive(pathname, item.href) ? "text-brand" : dark ? "hover:text-white" : "hover:text-zinc-950",
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
                      dark ? "border-white/10 bg-[#161616]" : "border-zinc-200 bg-white",
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
                  "py-6",
                  isActive(pathname, item.href) ? "text-brand" : dark ? "hover:text-white" : "hover:text-zinc-950",
                  isActive(pathname, item.href) && "shadow-[inset_0_-2px_0_0_var(--color-brand)]",
                )}
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Search"
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full",
              dark ? "hover:bg-white/10" : "hover:bg-zinc-100",
            )}
          >
            <IconSearch className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="hidden h-9 rounded-full border border-brand px-3 text-xs font-semibold text-brand sm:inline-flex sm:items-center"
          >
            EN
          </button>
          <button
            type="button"
            className="lg:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <IconClose className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {open ? (
        <div
          className={cn(
            "border-t px-4 py-4 lg:hidden",
            dark ? "border-white/10 bg-[#111]" : "border-zinc-200 bg-white",
          )}
        >
          <div className="flex flex-col gap-3 text-sm font-medium">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)}>
                {item.label}
              </Link>
            ))}
            <div className="grid grid-cols-2 gap-2 pt-2">
              {newsCategories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/news/${category.slug}`}
                  className="text-zinc-500"
                  onClick={() => setOpen(false)}
                >
                  {category.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </header>
  );
}
