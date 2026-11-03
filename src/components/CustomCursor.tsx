"use client";

import { useEffect, useRef } from "react";

// Anything a visitor can click. The cursor grows over these.
const INTERACTIVE = "a[href], button, [role='button'], label, summary, select";

/**
 * A circular cursor that replaces the system pointer on mouse and trackpad
 * devices. A 20px circle eases after the pointer and tints whatever it
 * passes over in the site's purple. Over links and buttons it grows into
 * a larger, soft purple circle instead. Styles are in globals.css.
 *
 * - Touch screens never see it: it only runs where the primary pointer is
 *   fine and can hover.
 * - With reduced motion, it follows the pointer exactly, with no easing.
 * - The system cursor is only hidden once this script is running (see
 *   `.has-custom-cursor`), so the page never ends up without a cursor.
 */
export function CustomCursor() {
  const lens = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layers = [lens.current, ring.current].filter(
      (el): el is HTMLDivElement => el !== null,
    );
    if (layers.length !== 2) return;
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    const root = document.documentElement;
    root.classList.add("has-custom-cursor");

    let x = 0;
    let y = 0;
    let cx = 0;
    let cy = 0;
    let frame = 0;
    let shown = false;

    const set = (key: string, value: string) => {
      for (const el of layers) el.dataset[key] = value;
    };

    const place = () => {
      const t = `translate3d(${cx}px, ${cy}px, 0)`;
      for (const el of layers) el.style.transform = t;
    };

    const loop = () => {
      // Ease towards the pointer; snap when close enough to stop the loop.
      cx += (x - cx) * 0.25;
      cy += (y - cy) * 0.25;
      if (Math.abs(x - cx) < 0.1 && Math.abs(y - cy) < 0.1) {
        cx = x;
        cy = y;
        place();
        frame = 0;
        return;
      }
      place();
      frame = requestAnimationFrame(loop);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      if (!shown || reduce.matches) {
        cx = x;
        cy = y;
        place();
        if (!shown) {
          shown = true;
          set("visible", "true");
        }
        return;
      }
      if (!frame) frame = requestAnimationFrame(loop);
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target as Element | null;
      set("active", String(Boolean(target?.closest(INTERACTIVE))));
    };

    const onDown = () => set("pressed", "true");
    const onUp = () => set("pressed", "false");
    const onLeave = () => {
      shown = false;
      set("visible", "false");
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    root.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <>
      <div
        ref={lens}
        aria-hidden="true"
        className="custom-cursor custom-cursor-lens"
      >
        <div className="custom-cursor-shape" />
      </div>
      <div
        ref={ring}
        aria-hidden="true"
        className="custom-cursor custom-cursor-ring"
      >
        <div className="custom-cursor-shape" />
      </div>
    </>
  );
}
