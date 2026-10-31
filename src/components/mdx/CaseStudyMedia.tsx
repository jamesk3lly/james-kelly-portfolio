import Image, { type StaticImageData } from "next/image";
import type { ReactNode } from "react";

/**
 * Building blocks for case study MDX files. See
 * content/work/example-case-study/index.mdx for each one in use.
 *
 * Images are imported at the top of the MDX file, e.g.
 *   import overview from "./overview.jpg";
 * which gives Next the size and a blurred preview automatically.
 * `alt` is required on every image: describe what it shows and why it
 * matters, not just "screenshot".
 */

type Img = { src: StaticImageData; alt: string };

function Caption({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return (
    <figcaption className="mt-3 max-w-2xl text-sm leading-relaxed text-muted">
      {children}
    </figcaption>
  );
}

const imageClass = "media-img w-full rounded-sm bg-surface";

/** Breaks out of the text column to the full page width. */
export function FullImage({
  src,
  alt,
  caption,
}: Img & { caption?: ReactNode }) {
  return (
    <figure className="bleed my-14 sm:my-20">
      <Image
        src={src}
        alt={alt}
        placeholder="blur"
        sizes="(min-width: 1344px) 1248px, 100vw"
        className={imageClass}
      />
      <Caption>{caption}</Caption>
    </figure>
  );
}

/** Two images side by side (stacked on phones), full page width. */
export function ImagePair({
  images,
  caption,
}: {
  images: [Img, Img];
  caption?: ReactNode;
}) {
  return (
    <figure className="bleed my-14 sm:my-20">
      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6">
        {images.map((img) => (
          <Image
            key={img.src.src}
            src={img.src}
            alt={img.alt}
            placeholder="blur"
            sizes="(min-width: 1344px) 612px, (min-width: 640px) 50vw, 100vw"
            className={imageClass}
          />
        ))}
      </div>
      <Caption>{caption}</Caption>
    </figure>
  );
}

/** An image within the text column, for detail shots. */
export function Figure({ src, alt, caption }: Img & { caption?: ReactNode }) {
  return (
    <figure className="my-12">
      <Image
        src={src}
        alt={alt}
        placeholder="blur"
        sizes="(min-width: 768px) 672px, 100vw"
        className={imageClass}
      />
      <Caption>{caption}</Caption>
    </figure>
  );
}

/** A large quote, wider than the text column. */
export function PullQuote({
  children,
  cite,
}: {
  children: ReactNode;
  /** Who said it, e.g. "Head of Product, Workday". */
  cite?: string;
}) {
  return (
    <figure className="wide my-16 sm:my-24">
      {/* Quote marks are added in CSS (.pull-quote in globals.css) so they
          attach to the text whether MDX wraps it in a paragraph or not. */}
      <blockquote className="pull-quote font-display text-heading text-balance">
        {typeof children === "string" ? <p>{children}</p> : children}
      </blockquote>
      {cite && (
        <figcaption className="mt-5 text-label text-muted uppercase">
          {cite}
        </figcaption>
      )}
    </figure>
  );
}
