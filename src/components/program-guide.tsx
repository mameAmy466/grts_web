"use client";

import { useEffect, useState } from "react";
import { IconCalendar } from "@/components/icons";
import { todayGuide, tomorrowGuide, yesterdayGuide } from "@/lib/data";
import type { ProgramSlot } from "@/lib/types";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "yesterday", label: "Yesterday", slots: yesterdayGuide },
  { id: "today", label: "Today", slots: todayGuide },
  { id: "tomorrow", label: "Tomorrow", slots: tomorrowGuide },
] as const;

function minutesFromClock(value: string) {
  const match = value.trim().match(/^(\d{1,2}):(\d{2})/);
  if (!match) return null;
  return Number(match[1]) * 60 + Number(match[2]);
}

function liveTitleForNow(slots: ProgramSlot[]) {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  let current = "";
  for (const slot of slots) {
    const start = minutesFromClock(slot.time);
    if (start == null || start > minutes) continue;
    current = slot.title;
  }
  return current;
}

export function ProgramGuide({ todaySlots }: { todaySlots?: ProgramSlot[] }) {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("today");
  const [liveTitle, setLiveTitle] = useState("");
  const today = todaySlots?.length ? todaySlots : todayGuide;
  const slots =
    tab === "today" ? today : tabs.find((item) => item.id === tab)?.slots ?? today;

  useEffect(() => {
    if (tab !== "today") {
      setLiveTitle("");
      return;
    }
    setLiveTitle(liveTitleForNow(slots));
  }, [tab, slots]);

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
          <GuideRow key={`${slot.time}-${slot.title}`} slot={slot} live={tab === "today" && slot.title === liveTitle} />
        ))}
      </ul>
    </aside>
  );
}

function GuideRow({ slot, live }: { slot: ProgramSlot; live: boolean }) {
  return (
    <li
      className={cn(
        "relative flex items-start gap-3 rounded-lg border px-3 py-2.5",
        live ? "border-brand bg-transparent" : "border-transparent",
      )}
    >
      {live ? (
        <span className="absolute -top-2 right-3 rounded bg-brand px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-white">
          Now live
        </span>
      ) : null}
      <p className="w-12 shrink-0 text-sm font-bold text-white">{slot.time}</p>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-white">{slot.title}</p>
        {slot.category ? <p className="mt-0.5 text-[11px] text-zinc-500">{slot.category}</p> : null}
      </div>
    </li>
  );
}
