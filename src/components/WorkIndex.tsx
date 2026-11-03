import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { Work } from "@/lib/work";
import { Reveal } from "./Reveal";

const typeLabel = { "case-study": "Case study", note: "Note" } as const;

/**
 * Selected work as a numbered typographic index: one row per project, led
 * by its number and outcome headline, with its cover image alongside.
 *
 * Square images sit at 95% of their column and grow to full size when the row is
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
              className="work-card group relative grid gap-x-8 gap-y-6 rounded-[20px] p-6 sm:p-10 md:grid-cols-[3rem_minmax(0,1fr)_minmax(0,0.8fr)] lg:grid-cols-[5rem_minmax(0,1fr)_minmax(0,0.85fr)] lg:gap-x-10 lg:p-12"
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
                <p className="text-label text-muted uppercase">
                  {item.year}
                  <span aria-hidden="true"> · </span>
                  {typeLabel[item.type]}
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

              {/* Square card image (or the cover, cropped square): rests at 95%
                  and grows to 100% on hover (mouse and trackpad only; touch
                  screens show it at full size). Its scale puts it on its own
                  layer above the link, so pointer events pass through to the
                  link: the image stays clickable and the cursor sees a link. */}
              <div className="work-image pointer-events-none overflow-hidden rounded-sm bg-surface md:self-start">
                <Image
                  src={item.card ?? item.cover}
                  alt=""
                  placeholder="blur"
                  sizes="(min-width: 1344px) 520px, (min-width: 768px) 40vw, 100vw"
                  className="media-img aspect-square w-full object-cover"
                />
              </div>
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
