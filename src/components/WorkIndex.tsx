"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import type { Work } from "@/lib/work";
import { Reveal } from "./Reveal";

const typeLabel = { "case-study": "Case study", note: "Note" } as const;

/**
 * Selected work as a numbered typographic index: one row per project, led
 * by its number and outcome headline.
 *
 * On wide screens, hovering a row shows its cover image at the right-hand
 * edge of the list, following the cursor up and down (never over the
 * headline). On touch screens and narrower windows each row has a small
 * thumbnail instead. Both images repeat the headline visually, so they use empty
 * alt text; the link text carries the meaning for screen readers.
 */
export function WorkIndex({ work }: { work: Work[] }) {
  const [active, setActive] = useState<number | null>(null);
  const list = useRef<HTMLDivElement>(null);
  const preview = useRef<HTMLDivElement>(null);

  // Moves the preview with the pointer without re-rendering React. It's
  // pinned to the list's right edge and only follows vertically.
  function follow(e: React.PointerEvent) {
    const el = preview.current;
    if (!el || !list.current) return;
    const x = list.current.getBoundingClientRect().right - el.offsetWidth;
    const y = e.clientY - el.offsetHeight / 2;
    el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }

  return (
    <div
      ref={list}
      onPointerMove={follow}
      onPointerLeave={() => setActive(null)}
    >
      <ol className="border-t border-rule">
        {work.map((item, i) => (
          <li key={item.slug} className="border-b border-rule">
            <Reveal>
              <div
                className="group relative grid grid-cols-[1fr_auto] gap-x-5 gap-y-3 py-8 sm:py-10 lg:grid-cols-[6rem_1fr_11rem] lg:gap-x-10"
                onPointerEnter={() => setActive(i)}
              >
                {/* Number: serif, old-style figures, quiet until hover. */}
                <span
                  aria-hidden="true"
                  className="font-display text-subheading text-muted [font-variant-numeric:oldstyle-nums] transition-colors group-hover:text-accent lg:pt-1"
                >
                  {item.number}
                </span>

                <p className="col-start-2 row-start-1 text-right text-label text-muted uppercase lg:col-start-3 lg:pt-3">
                  {item.year}
                  <span aria-hidden="true"> · </span>
                  <br className="hidden lg:block" />
                  {typeLabel[item.type]}
                </p>

                <div className="col-span-2 flex gap-5 lg:col-span-1 lg:col-start-2 lg:row-start-1">
                  <div className="min-w-0 flex-1">
                    <h3 className="max-w-2xl font-display text-heading text-balance">
                      <Link
                        href={`/work/${item.slug}`}
                        className="decoration-accent decoration-1 underline-offset-[0.14em] group-hover:underline after:absolute after:inset-0"
                      >
                        <span className="sr-only">{item.number}. </span>
                        {item.title}
                      </Link>
                    </h3>
                    <p className="mt-3 max-w-2xl text-muted">{item.summary}</p>
                  </div>

                  {/* Thumbnail for touch screens and narrower windows. */}
                  <div className="w-24 shrink-0 self-start overflow-hidden rounded-sm bg-surface sm:w-32 xl:hidden">
                    <Image
                      src={item.cover}
                      alt=""
                      placeholder="blur"
                      sizes="128px"
                      className="media-img aspect-[4/3] w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </Reveal>
          </li>
        ))}
      </ol>

      {/* Hover preview for wide screens. Hidden (and not downloaded) on
          touch screens and narrower windows, where thumbnails show instead. */}
      <div
        ref={preview}
        aria-hidden="true"
        className={`pointer-events-none fixed top-0 left-0 z-20 hidden w-[20rem] transition-[opacity,transform] duration-200 ease-out motion-reduce:transition-none xl:block [@media(hover:none)]:hidden ${
          active === null ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="relative aspect-[16/10] overflow-hidden rounded-sm bg-surface shadow-[0_24px_48px_-24px_rgb(0_0_0/0.35)]">
          {work.map((item, i) => (
            <Image
              key={item.slug}
              src={item.cover}
              alt=""
              sizes="320px"
              className={`media-img absolute inset-0 size-full object-cover transition-opacity duration-200 ${
                active === i ? "opacity-100" : "opacity-0"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
