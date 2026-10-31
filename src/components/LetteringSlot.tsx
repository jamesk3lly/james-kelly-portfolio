import type { ReactNode } from "react";

/**
 * Space in the hero for James's custom lettering mark.
 *
 * To add it: pass the SVG as children, e.g.
 *   <LetteringSlot><MyMark className="h-full w-full" /></LetteringSlot>
 * Use fill="currentColor" in the SVG so it follows light and dark mode.
 * Until then it shows a quiet dashed placeholder.
 */
export function LetteringSlot({ children }: { children?: ReactNode }) {
  return (
    <div className="hero-fade size-24 shrink-0 sm:size-32 lg:size-44">
      {children ?? (
        <div
          aria-hidden="true"
          className="flex size-full items-center justify-center rounded-full border border-dashed border-rule text-center text-label text-muted uppercase"
        >
          Lettering
          <br />
          mark
        </div>
      )}
    </div>
  );
}
