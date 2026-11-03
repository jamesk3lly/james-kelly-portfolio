"use client";

import { useSyncExternalStore } from "react";

const format = new Intl.DateTimeFormat("en-IE", {
  timeZone: "Europe/Dublin",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

// Ticks once a minute, lined up with the start of each minute.
function subscribe(onChange: () => void) {
  let timer: ReturnType<typeof setTimeout>;
  const tick = () => {
    onChange();
    timer = setTimeout(tick, 60_000 - (Date.now() % 60_000));
  };
  timer = setTimeout(tick, 60_000 - (Date.now() % 60_000));
  return () => clearTimeout(timer);
}

const getTime = () => format.format(new Date());

/**
 * The current time in Ireland, shown after the name in the footer as
 * " · (clock) 14:05". Pages are prerendered, so the server renders nothing
 * and the time appears once the page loads in the browser. It sits at the
 * end of the line, so nothing else moves when it appears.
 */
export function LocalTime() {
  const time = useSyncExternalStore(subscribe, getTime, () => null);
  if (!time) return null;

  return (
    <>
      <span aria-hidden="true"> · </span>
      <span
        className="inline-flex items-baseline gap-1.5"
        title="Local time in Ireland"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 16 16"
          className="size-[0.85em] translate-y-[0.1em] self-center"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        >
          <circle cx="8" cy="8" r="6.25" />
          <path d="M8 4.75V8l2.25 1.5" />
        </svg>
        <span className="sr-only">Local time in Ireland: </span>
        <time className="tabular-nums">{time}</time>
      </span>
    </>
  );
}
