import Link from "next/link";
import { Logo } from "@/components/logo";
import { socialIcons } from "@/components/icons";
import { SITE, socialLinks } from "@/lib/data";
import type { ChromeTheme } from "@/lib/types";
import { cn } from "@/lib/utils";

const broadcast = [
  { href: "/live", label: "Live TV" },
  { href: "/radio", label: "Radio Gambia" },
  { href: "/programmes", label: "Programmes" },
  { href: "/live#guide", label: "Schedules" },
];

const company = [
  { href: "/about", label: "About Us" },
  { href: "/news", label: "News & Press" },
  { href: "/about#careers", label: "Careers" },
  { href: "/about#contact", label: "Contact" },
];

export function SiteFooter({ theme }: { theme: ChromeTheme }) {
  const dark = theme === "dark";

  return (
    <footer
      className={cn(
        "mt-auto border-t",
        dark ? "border-white/10 bg-[#111] text-zinc-300" : "border-zinc-200 bg-zinc-100 text-zinc-600",
      )}
    >
      <div className="mx-auto grid max-w-[1240px] gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo className={dark ? "text-white" : "text-zinc-900"} />
          <p className="mt-4 max-w-xs text-sm leading-6">{SITE.tagline}</p>
        </div>
        <div>
          <h3 className="text-xs font-bold tracking-[0.14em] text-brand">BROADCAST</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {broadcast.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "hover:text-brand",
                    item.label === "Programmes" && (dark ? "font-semibold text-white" : "font-semibold text-zinc-900"),
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xs font-bold tracking-[0.14em] text-brand">COMPANY</h3>
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
          <h3 className="text-xs font-bold tracking-[0.14em] text-brand">FOLLOW US</h3>
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
          <p className="mt-6 text-xs font-medium">Download our apps from</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <StoreBadge store="apple" />
            <StoreBadge store="google" />
          </div>
        </div>
      </div>
      <div
        className={cn(
          "border-t",
          dark ? "border-white/10 text-zinc-500" : "border-zinc-200 text-zinc-500",
        )}
      >
        <div className="mx-auto flex max-w-[1240px] flex-col gap-2 px-4 py-4 text-xs sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>© 2026 GRTS Gambia. All rights reserved.</p>
          <p>A service of the Government of The Gambia</p>
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
