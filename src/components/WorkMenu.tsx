"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";

export type WorkMenuItem = {
  slug: string;
  project: string;
  number: string;
  year: string;
  tint?: string;
};

/**
 * The Work item in the header: a dropdown listing every case study, on a
 * translucent panel that blurs the page behind it (styles: .nav-panel in
 * globals.css).
 *
 * - Mouse and trackpad: opens on hover, with a short grace period on the
 *   way out so the pointer can cross the gap to the panel.
 * - Click, tap, Enter or Space: toggles it.
 * - Escape, clicking elsewhere, or tabbing away: closes it.
 *
 * The panel is positioned against the header (SiteHeader's Container is
 * `relative`), so it lines up with the page's right edge and never runs
 * off a phone screen.
 */
export function WorkMenu({
  items,
  current,
}: {
  items: WorkMenuItem[];
  current: boolean;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const id = useId();
  const root = useRef<HTMLLIElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef(0);

  // Close after moving to another page.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      button.current?.focus();
    };
    const onDown = (e: PointerEvent) => {
      if (!root.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const hoverOpen = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  const hoverClose = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse") return;
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), 180);
  };

  return (
    <li
      ref={root}
      onPointerEnter={hoverOpen}
      onPointerLeave={hoverClose}
      onBlur={(e) => {
        if (!root.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
    >
      <button
        ref={button}
        type="button"
        aria-expanded={open}
        aria-controls={id}
        data-current={current || undefined}
        onClick={() => setOpen((o) => !o)}
        className="link-underline inline-flex items-center gap-1.5 underline-offset-[0.35em] hover:text-accent aria-expanded:text-accent data-current:decoration-accent"
      >
        Work
        <svg
          aria-hidden="true"
          viewBox="0 0 12 12"
          className={`size-2.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M2.5 4.5 6 8l3.5-3.5" />
        </svg>
      </button>

      <div
        id={id}
        data-open={open || undefined}
        inert={!open}
        className="nav-panel absolute top-full right-5 z-50 -mt-2 w-[min(24rem,calc(100vw-2.5rem))] rounded-[20px] p-2 sm:right-8 sm:-mt-3 lg:right-12"
      >
        <p className="px-4 pt-3 pb-2 text-label text-muted uppercase">
          Selected work
        </p>
        <ul>
          {items.map((item, i) => {
            const here = pathname === `/work/${item.slug}`;
            return (
              <li
                key={item.slug}
                className="nav-panel-item"
                style={{ "--i": i } as CSSProperties}
              >
                <Link
                  href={`/work/${item.slug}`}
                  // Case studies are password protected; see WorkIndex.
                  prefetch={false}
                  aria-current={here ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className="group/item grid grid-cols-[1.75rem_1fr_auto] items-baseline gap-3 rounded-xl px-4 py-3 transition-colors hover:bg-text/5 aria-[current]:bg-text/5"
                >
                  <span
                    aria-hidden="true"
                    className="font-display text-muted [font-variant-numeric:oldstyle-nums] transition-colors group-hover/item:text-accent"
                  >
                    {item.number}
                  </span>
                  <span className="flex items-center gap-2.5 font-display text-[1.0625rem] leading-snug">
                    {item.tint && (
                      <span
                        aria-hidden="true"
                        className="nav-swatch size-2 shrink-0 translate-y-[-1px] rounded-full"
                        style={{ "--tint": item.tint } as CSSProperties}
                      />
                    )}
                    {item.project}
                  </span>
                  <span className="text-label text-muted uppercase">
                    {item.year}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <div
          className="nav-panel-item mt-1 border-t border-rule/70 px-4 pt-3 pb-2"
          style={{ "--i": items.length } as CSSProperties}
        >
          <Link
            href="/#work"
            onClick={() => setOpen(false)}
            className="link-underline text-[0.9375rem] text-muted hover:text-accent"
          >
            All work on the home page <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </li>
  );
}
