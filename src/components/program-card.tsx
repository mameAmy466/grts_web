import Link from "next/link";
import { Duration } from "@/components/cards";
import { MediaImage } from "@/components/media-image";
import type { Program } from "@/lib/types";

export function ProgramCard({ program }: { program: Program }) {
  return (
    <Link href={`/programmes/${program.slug}`} className="group block w-full max-w-[209px]">
      <article className="relative aspect-[209/285] w-full overflow-hidden rounded-[12px] border border-white/15 bg-zinc-800">
        <MediaImage
          src={program.image}
          alt={program.title}
          sizes="209px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/10" />
        <span
          className="absolute left-3 top-3 rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white"
          style={{ backgroundColor: program.badgeColor }}
        >
          {program.badge}
        </span>
        <Duration value={program.duration || ""} className="top-3 right-3 bottom-auto" />
        <div className="absolute inset-x-0 bottom-0 p-3">
          <h3 className="text-sm font-bold leading-snug text-white group-hover:text-brand sm:text-base">
            {program.title}
          </h3>
          <p className="mt-1 text-[11px] text-zinc-300">{program.schedule}</p>
        </div>
      </article>
    </Link>
  );
}
