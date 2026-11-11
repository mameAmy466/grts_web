import { SiteWrap } from "@/components/media-image";

/**
 * Shown instantly when switching category (e.g. from the News dropdown)
 * while the category page waits for the TVE API.
 */
export default function Loading() {
  return (
    <div className="pb-16" aria-busy="true" aria-label="Loading">
      <SiteWrap className="grid animate-pulse gap-8 py-8 md:grid-cols-12 md:gap-10">
        <div className="min-w-0 md:col-span-7 lg:col-span-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="aspect-[16/11] rounded-xl bg-skeleton" />
            <div className="flex flex-col justify-center">
              <div className="h-3 w-24 rounded bg-skeleton" />
              <div className="mt-3 h-7 w-full rounded bg-skeleton" />
              <div className="mt-2 h-7 w-4/5 rounded bg-skeleton" />
              <div className="mt-4 h-4 w-full rounded bg-skeleton" />
              <div className="mt-2 h-4 w-2/3 rounded bg-skeleton" />
            </div>
          </div>
          <div className="mt-10 grid gap-7 sm:grid-cols-2">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index}>
                <div className="aspect-[16/10] rounded-lg bg-skeleton" />
                <div className="mt-3 h-3 w-28 rounded bg-skeleton" />
                <div className="mt-2 h-4 w-full rounded bg-skeleton" />
                <div className="mt-2 h-4 w-3/4 rounded bg-skeleton" />
              </div>
            ))}
          </div>
        </div>
        <div className="hidden md:col-span-5 md:block lg:col-span-4">
          <div className="h-5 w-32 rounded bg-skeleton" />
          {Array.from({ length: 6 }, (_, index) => (
            <div key={index} className="mt-4 h-4 w-full rounded bg-skeleton" />
          ))}
        </div>
      </SiteWrap>
    </div>
  );
}
