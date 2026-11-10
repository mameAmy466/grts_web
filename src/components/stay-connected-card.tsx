import { socialIcons } from "@/components/icons";
import { MediaImage } from "@/components/media-image";
import { SITE, socialLinks } from "@/lib/data";
import { unsplash } from "@/lib/utils";

export function StayConnectedCard() {
  return (
    <div className="relative overflow-hidden rounded-xl bg-subtle p-5 text-fg">
      <div className="absolute inset-y-0 right-0 w-1/2">
        <MediaImage
          src={unsplash("photo-1573497019940-1c28c88b4f3e", 500)}
          alt=""
          sizes="200px"
          className="opacity-40"
        />
      </div>
      <p className="relative text-xs font-semibold uppercase tracking-[0.16em] text-brand">
        Stay Connected
      </p>
      <p className="relative mt-2 max-w-[200px] text-lg font-bold leading-snug">
        Get the latest GRTS news on TV, radio, and socials.
      </p>
      <div className="relative mt-4 flex gap-2">
        {socialLinks.map((item) => {
          const Icon = socialIcons[item.name];
          return (
            <a
              key={item.name}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              aria-label={item.name}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-fg/10 hover:bg-brand hover:text-white"
            >
              <Icon className="h-3.5 w-3.5" />
            </a>
          );
        })}
      </div>
      <p className="relative mt-3 text-xs text-fg-muted">{SITE.email}</p>
    </div>
  );
}
