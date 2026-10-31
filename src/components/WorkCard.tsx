import Image from "next/image";
import Link from "next/link";
import type { Work } from "@/lib/work";

const typeLabel = { "case-study": "Case study", note: "Note" } as const;

/**
 * A project on the home page. The whole card is one link; the headline is
 * the link's accessible name, so screen readers hear the outcome first.
 */
export function WorkCard({
  work,
  priority = false,
  sizes,
}: {
  work: Work;
  /** Load the image immediately (for a card that's visible on load). */
  priority?: boolean;
  sizes: string;
}) {
  return (
    <article className="group relative">
      <div className="overflow-hidden rounded-sm bg-surface">
        <Image
          src={work.cover}
          alt={work.coverAlt}
          placeholder="blur"
          sizes={sizes}
          preload={priority}
          className="media-img aspect-[16/10] w-full object-cover transition-transform duration-700 ease-out-quint group-hover:scale-[1.02] motion-reduce:transition-none"
        />
      </div>

      <p className="mt-5 flex gap-3 text-label text-muted uppercase">
        <span>{work.year}</span>
        <span aria-hidden="true">·</span>
        <span>{typeLabel[work.type]}</span>
      </p>

      <h3 className="mt-2 font-display text-subheading text-balance">
        {/* The ::after makes the whole card clickable without nesting
            everything inside the link. */}
        <Link
          href={`/work/${work.slug}`}
          className="decoration-accent decoration-1 underline-offset-[0.18em] group-hover:underline after:absolute after:inset-0"
        >
          {work.title}
        </Link>
      </h3>

      <p className="mt-3 max-w-xl text-muted">{work.summary}</p>
    </article>
  );
}
