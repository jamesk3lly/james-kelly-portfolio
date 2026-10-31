import type { ComponentProps } from "react";

/**
 * A link that opens in a new tab (LinkedIn, the CV, other sites).
 *
 * - `noopener noreferrer` stops the new page controlling this one.
 * - The small ↗ tells sighted visitors it opens elsewhere; screen readers
 *   hear "opens in a new tab" instead, since an unexpected new tab is
 *   disorienting if you can't see it happen.
 */
export function ExternalLink({
  children,
  ...props
}: Omit<ComponentProps<"a">, "target" | "rel">) {
  return (
    <a {...props} target="_blank" rel="noopener noreferrer">
      {children}
      <span aria-hidden="true" className="ml-[0.2em] inline-block text-[0.8em]">
        ↗
      </span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}
