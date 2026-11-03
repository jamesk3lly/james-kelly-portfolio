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
 * " · 14:05". Pages are prerendered, so the server renders nothing and the
 * time appears once the page loads in the browser. It sits at the end of
 * the line, so nothing else moves when it appears.
 */
export function LocalTime() {
  const time = useSyncExternalStore(subscribe, getTime, () => null);
  if (!time) return null;

  return (
    <>
      <span aria-hidden="true"> · </span>
      <span className="sr-only">Local time in Ireland: </span>
      <time className="tabular-nums">{time}</time>
    </>
  );
}
