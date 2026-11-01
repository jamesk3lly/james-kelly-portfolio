import Image from "next/image";
import Link from "next/link";
import type { Work } from "@/lib/work";
import { Reveal } from "./Reveal";

const typeLabel = { "case-study": "Case study", note: "Note" } as const;

/**
 * Selected work as a numbered typographic index: one row per project, led
 * by its number and outcome headline, with its cover image alongside.
 *
 * Hovering a row fades in the headline underline, colours the number and
 * gently enlarges the image inside its frame. Visitors who prefer reduced
 * motion get the colour changes but no scaling.
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
            <div className="group relative grid gap-x-8 gap-y-5 py-8 sm:py-10 md:grid-cols-[4rem_1fr_16rem] lg:grid-cols-[6rem_1fr_20rem] lg:gap-x-10">
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
                <h3 className="mt-3 max-w-2xl font-display text-heading text-balance">
                  <Link
                    href={`/work/${item.slug}`}
                    className="link-underline after:absolute after:inset-0"
                  >
                    <span className="sr-only">{item.number}. </span>
                    {item.title}
                  </Link>
                </h3>
                <p className="mt-3 max-w-2xl text-muted">{item.summary}</p>
              </div>

              {/* Cover image: the frame stays put, the image scales inside. */}
              <div className="overflow-hidden rounded-sm bg-surface md:self-start">
                <Image
                  src={item.cover}
                  alt=""
                  placeholder="blur"
                  sizes="(min-width: 1024px) 320px, (min-width: 768px) 256px, 100vw"
                  className="media-img aspect-[16/10] w-full object-cover transition-transform duration-700 ease-out-quint motion-safe:group-hover:scale-[1.04]"
                />
              </div>
            </div>
          </Reveal>
        </li>
      ))}
    </ol>
  );
}
