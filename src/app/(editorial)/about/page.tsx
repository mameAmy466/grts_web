import type { Metadata } from "next";
import { SITE } from "@/lib/data";
import { SiteWrap } from "@/components/media-image";

export const metadata: Metadata = {
  title: "About",
};

export const revalidate = 3600; // REVALIDATE_STATIC

export default function AboutPage() {
  return (
    <div className="pb-16">
      <SiteWrap className="max-w-3xl py-14">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-brand">
          Gambia Radio & Television Service
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-fg">About GRTS</h1>
        <p className="mt-5 text-lg leading-8 text-fg-muted">{SITE.tagline}</p>
        <p className="mt-4 text-sm leading-7 text-fg-muted">
          GRTS is the national broadcaster of The Gambia. From studios in Kanifing
          and transmitters across the country, we deliver television, radio, and
          digital news that informs, educates, and entertains.
        </p>

        <section id="contact" className="mt-12 rounded-xl border border-line bg-subtle p-6">
          <h2 className="text-xl font-bold text-fg">Contact</h2>
          <p className="mt-3 text-sm text-fg-muted">
            Phone:{" "}
            <a className="font-medium text-fg" href={`tel:${SITE.phone.replace(/\s/g, "")}`}>
              {SITE.phone}
            </a>
          </p>
          <p className="mt-1 text-sm text-fg-muted">
            Email:{" "}
            <a className="font-medium text-fg" href={`mailto:${SITE.email}`}>
              {SITE.email}
            </a>
          </p>
        </section>

        <section id="careers" className="mt-10">
          <h2 className="text-xl font-bold text-fg">Careers</h2>
          <p className="mt-3 text-sm leading-7 text-fg-muted">
            We regularly look for journalists, producers, engineers, and digital
            producers. Send a CV and a short note to {SITE.email}.
          </p>
        </section>
      </SiteWrap>
    </div>
  );
}
