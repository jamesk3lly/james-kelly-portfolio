"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY } from "./ThemeScript";

type Theme = "light" | "dark";

const systemQuery = "(prefers-color-scheme: dark)";

function readStored(): Theme | null {
  try {
    const t = localStorage.getItem(THEME_STORAGE_KEY);
    return t === "light" || t === "dark" ? t : null;
  } catch {
    return null; // storage blocked (private mode, strict settings)
  }
}

function resolveTheme(): Theme {
  return readStored() ?? (matchMedia(systemQuery).matches ? "dark" : "light");
}

function applyTheme(theme: Theme, animate: boolean) {
  const root = document.documentElement;
  if (animate) {
    // Briefly enables the colour transition in globals.css.
    root.classList.add("theme-transition");
    window.setTimeout(() => root.classList.remove("theme-transition"), 350);
  }
  root.setAttribute("data-theme", theme);
}

// The current theme lives on <html data-theme>. Watching that attribute
// keeps this button in sync however the theme changes.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });

  // Follow system changes until the visitor makes their own choice.
  const media = matchMedia(systemQuery);
  const onSystemChange = () => {
    if (!readStored()) applyTheme(media.matches ? "dark" : "light", true);
  };
  media.addEventListener("change", onSystemChange);

  return () => {
    observer.disconnect();
    media.removeEventListener("change", onSystemChange);
  };
}

const getSnapshot = () =>
  (document.documentElement.getAttribute("data-theme") as Theme) ?? "light";
// The server can't know the theme. React swaps in the real value straight
// after hydration; the icon is driven by CSS so it's right from first paint.
const getServerSnapshot = (): Theme => "light";

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const next: Theme = theme === "dark" ? "light" : "dark";

  // In development React re-mounts <html> and clears data-theme; put it
  // back before paint. Does nothing in production.
  useLayoutEffect(() => {
    applyTheme(resolveTheme(), false);
  }, []);

  function toggle() {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Not saved, but the switch still works for this page view.
    }
    applyTheme(next, true);
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      className="group -m-2 inline-flex size-11 items-center justify-center rounded-full text-text transition-colors hover:bg-surface"
    >
      {/* Shows the CURRENT mode: sun in light, moon in dark. */}
      <SunIcon className="size-5 in-data-[theme=dark]:hidden" />
      <MoonIcon className="hidden size-5 in-data-[theme=dark]:block" />
    </button>
  );
}

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
      className={className}
    >
      <circle cx="12" cy="12" r="4.25" />
      <path d="M12 2.75v2M12 19.25v2M2.75 12h2M19.25 12h2M5.46 5.46l1.41 1.41M17.13 17.13l1.41 1.41M5.46 18.54l1.41-1.41M17.13 6.87l1.41-1.41" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M20.25 14.5A8.25 8.25 0 0 1 9.5 3.75a8.25 8.25 0 1 0 10.75 10.75Z" />
    </svg>
  );
}
