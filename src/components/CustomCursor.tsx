"use client";

import { useEffect, useRef } from "react";

// Anything a visitor can click. The cursor grows over these.
const INTERACTIVE = "a[href], button, [role='button'], label, summary, select";

/**
 * A circular cursor that replaces the system pointer on mouse and trackpad
 * devices. It's a small dot in the text colour that eases after the
 * pointer, and grows into a soft purple circle (the site accent) over links
 * and buttons.
 *
 * - Touch screens never see it: it only runs where the primary pointer is
 *   fine and can hover.
 * - With reduced motion, it follows the pointer exactly, with no easing.
 * - The system cursor comes back if the pointer leaves the window, and is
 *   only hidden once this script is running (see `.has-custom-cursor` in
 *   globals.css), so the page never ends up without a cursor.
 */
export function CustomCursor() {
  const outer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = outer.current;
    if (!el) return;
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

    const place = () => {
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
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
          el.dataset.visible = "true";
        }
        return;
      }
      if (!frame) frame = requestAnimationFrame(loop);
    };

    const onOver = (e: PointerEvent) => {
      const target = e.target as Element | null;
      el.dataset.active = String(Boolean(target?.closest(INTERACTIVE)));
    };

    const onDown = () => (el.dataset.pressed = "true");
    const onUp = () => (el.dataset.pressed = "false");
    const onLeave = () => {
      shown = false;
      el.dataset.visible = "false";
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={outer} aria-hidden="true" className="custom-cursor">
      <div className="custom-cursor-dot" />
    </div>
  );
}
