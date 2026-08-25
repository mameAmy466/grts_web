"use client";

import { useState } from "react";
import { IconCalendar } from "@/components/icons";
import { todayGuide, tomorrowGuide, yesterdayGuide } from "@/lib/data";
import type { ProgramSlot } from "@/lib/types";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "yesterday", label: "Yesterday", slots: yesterdayGuide },
  { id: "today", label: "Today", slots: todayGuide },
  { id: "tomorrow", label: "Tomorrow", slots: tomorrowGuide },
] as const;

export function ProgramGuide({ todaySlots }: { todaySlots?: ProgramSlot[] }) {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("today");
  const today = todaySlots?.length ? todaySlots : todayGuide;
  const slots =
    tab === "today" ? today : tabs.find((item) => item.id === tab)?.slots ?? today;

  return (
    <aside id="guide" className="rounded-xl border border-white/10 bg-[#141414] p-4 md:p-5">
      <div className="mb-4 flex items-center gap-2">
        <IconCalendar className="h-5 w-5 text-brand" />
        <h2 className="text-lg font-bold text-white">Program Guide</h2>
      </div>
      <div className="mb-4 grid grid-cols-3 rounded-full bg-black/40 p-1 text-xs font-semibold">
        {tabs.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            className={cn(
              "rounded-full px-2 py-2",
              tab === item.id ? "bg-brand text-white" : "text-zinc-400 hover:text-white",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
      <ul className="space-y-2">
        {slots.map((slot) => (
          <GuideRow key={`${slot.time}-${slot.title}`} slot={slot} />
        ))}
      </ul>
    </aside>
  );
}

function GuideRow({ slot }: { slot: ProgramSlot }) {
  return (
    <li
      className={cn(
        "relative rounded-lg border px-3 py-2.5",
        slot.live ? "border-brand bg-brand/10" : "border-white/5 bg-white/5",
      )}
    >
      {slot.live ? (
        <span className="absolute right-2 top-2 rounded bg-brand px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
          Now live
        </span>
      ) : null}
      <p className="text-xs font-semibold text-zinc-400">{slot.time}</p>
      <p className="mt-0.5 text-sm font-semibold text-white">
        {slot.live ? <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-brand" /> : null}
        {slot.title}
      </p>
      {slot.category ? <p className="text-[11px] text-zinc-500">{slot.category}</p> : null}
    </li>
  );
}
