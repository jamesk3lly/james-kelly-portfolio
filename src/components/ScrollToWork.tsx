"use client";

import type { MouseEvent } from "react";

const DURATION = 1200;
// Gentle in and out, so the scroll starts and lands softly.
const ease = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/**
 * The small down arrow beside "Selected work". Clicking it scrolls slowly
 * until the heading sits at the top of the screen (allowing for its
 * scroll margin). With reduced motion it jumps straight there. Without
 * JavaScript it's a plain link to #work.
 */
export function ScrollToWork({ target }: { target: string }) {
  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    const el = document.getElementById(target);
    if (!el) return;
    e.preventDefault();

    const margin = parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
    const end = Math.max(
      0,
      Math.min(
        el.getBoundingClientRect().top + window.scrollY - margin,
        document.documentElement.scrollHeight - window.innerHeight,
      ),
    );
    history.replaceState(null, "", `#${target}`);

    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.scrollTo(0, end);
      return;
    }

    const start = window.scrollY;
    const t0 = performance.now();
    // Stop if the visitor scrolls themselves part-way.
    let cancelled = false;
    const cancel = () => (cancelled = true);
    const opts = { passive: true, once: true } as const;
    window.addEventListener("wheel", cancel, opts);
    window.addEventListener("touchstart", cancel, opts);
    window.addEventListener("keydown", cancel, opts);

    const step = (now: number) => {
      const t = Math.min(1, (now - t0) / DURATION);
      if (cancelled) return;
      window.scrollTo(0, start + (end - start) * ease(t));
      if (t < 1) requestAnimationFrame(step);
      else {
        window.removeEventListener("wheel", cancel);
        window.removeEventListener("touchstart", cancel);
        window.removeEventListener("keydown", cancel);
      }
    };
    requestAnimationFrame(step);
  };

  return (
    <a
      href={`#${target}`}
      onClick={onClick}
      aria-label="Scroll to selected work"
      className="-m-2 inline-flex p-2 text-muted transition-colors hover:text-accent"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 12 12"
        className="size-[0.42em] translate-y-[0.08em]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2.5 4.5 6 8l3.5-3.5" />
      </svg>
    </a>
  );
}
