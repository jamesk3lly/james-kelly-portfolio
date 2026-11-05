import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { Work } from "@/lib/work";
import { Reveal } from "./Reveal";

const typeLabel = { "case-study": "Case study", note: "Note" } as const;

// A small padlock, sized to the label text.
function LockIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 16 16"
      className="size-[1.1em] -translate-y-px"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    >
      <rect x="3" y="7" width="10" height="7" rx="1.5" />
      <path d="M5.5 7V5a2.5 2.5 0 0 1 5 0v2" />
    </svg>
  );
}

/**
 * Selected work as a numbered typographic index: one row per project, led
 * by its number and outcome headline, with its cover image alongside.
 *
 * Images sit at 95% of their column and grow to full size when the row is
 * hovered (the whole framed image grows, not a zoom inside it). Hovering
 * also fades in the headline underline and colours the number. Visitors
 * who prefer reduced motion, and touch screens (which can't hover), see
 * images at full size.
 *
 * The image repeats the headline visually, so it has empty alt text; the
 * link text carries the meaning for screen readers.
 */
export function WorkIndex({ work }: { work: Work[] }) {
  return (
    <ol className="grid gap-[26px] sm:gap-[34px]">
      {work.map((item) => (
        <li key={item.slug}>
          <Reveal>
            {/* Each card is a pale tint of the project's brand colour (see
                .work-card in globals.css and `tint` in each project's meta). */}
            <div
              className="work-card group relative grid gap-x-8 gap-y-6 rounded-[20px] p-6 sm:p-10 md:grid-cols-[3rem_minmax(0,1fr)_minmax(0,1fr)] lg:grid-cols-[5rem_minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-x-10 lg:p-12"
              data-tint={item.tint ? "" : undefined}
              style={
                item.tint
                  ? ({ "--tint": item.tint } as CSSProperties)
                  : undefined
              }
            >
              {/* Number: serif, old-style figures, quiet until hover. */}
              <span
                aria-hidden="true"
                className="font-display text-subheading text-muted [font-variant-numeric:oldstyle-nums] transition-colors group-hover:text-accent md:pt-1"
              >
                {item.number}
              </span>

              <div className="min-w-0">
                <p className="flex items-center gap-x-[0.4em] text-label text-muted uppercase">
                  <span>{item.year}</span>
                  <span aria-hidden="true">·</span>
                  <span>{typeLabel[item.type]}</span>
                  {/* Case studies need a password (see src/lib/access.ts). */}
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1">
                    <LockIcon />
                    Password
                  </span>
                </p>
                <h3 className="mt-3 max-w-2xl font-display text-[clamp(1.375rem,1.05rem+1vw,2rem)] leading-[1.22] tracking-[-0.01em] text-balance">
                  <Link
                    href={`/work/${item.slug}`}
                    className="link-underline after:absolute after:inset-0"
                  >
                    <span className="sr-only">{item.number}. </span>
                    {item.title}
                  </Link>
                </h3>
                {/* Capped at two lines; keep summaries to about 100 characters. */}
                <p className="mt-3 line-clamp-2 max-w-2xl text-muted">
                  {item.summary}
                </p>
              </div>

              {/* Card image (or the cover), cropped to 16:10: rests at 95%
                  and grows to 100% on hover (mouse and trackpad only; touch
                  screens show it at full size). Its scale puts it on its own
                  layer above the link, so pointer events pass through to the
                  link: the image stays clickable and the cursor sees a link. */}
              <div className="work-image pointer-events-none overflow-hidden rounded-sm bg-surface md:self-start">
                <Image
                  src={item.card ?? item.cover}
                  alt=""
                  placeholder="blur"
                  sizes="(min-width: 1344px) 600px, (min-width: 768px) 45vw, 100vw"
                  className="media-img aspect-[16/10] w-full object-cover"
                />
              </div>
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
