import Image from "next/image";
import Link from "next/link";
import type { Work } from "@/lib/work";
import { Reveal } from "./Reveal";

const typeLabel = { "case-study": "Case study", note: "Note" } as const;

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
    <ol className="border-t border-rule">
      {work.map((item) => (
        <li key={item.slug} className="border-b border-rule">
          <Reveal>
            <div className="group relative grid gap-x-8 gap-y-6 py-10 sm:py-14 md:grid-cols-[3rem_minmax(0,1fr)_minmax(0,1fr)] lg:grid-cols-[5rem_minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-x-10">
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

              {/* Cover image: rests at 95% and grows to 100% on hover (mouse and
                  trackpad only; touch screens show it at full size). */}
              <div className="work-image overflow-hidden rounded-sm bg-surface md:self-start">
                <Image
                  src={item.cover}
                  alt=""
                  placeholder="blur"
                  sizes="(min-width: 1344px) 600px, (min-width: 1024px) 45vw, (min-width: 768px) 45vw, 100vw"
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
