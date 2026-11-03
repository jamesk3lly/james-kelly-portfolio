"use client";

import { useEffect, useRef } from "react";

// Anything a visitor can click. The cursor inverts these.
const INTERACTIVE = "a[href], button, [role='button'], label, summary, select";

/**
 * A circular cursor that replaces the system pointer on mouse and trackpad
 * devices: a soft purple circle with a fine purple outline that eases after
 * the pointer. Styles are in globals.css.
 *
 * Over a link or button, the circle fills with solid purple and the part of
 * the link inside it is shown inverted, in the page background colour. To
 * do that, the link's text block is copied into the circle and kept lined
 * up with the original, so it reads as the same text in reverse colours.
 *
 * - Touch screens never see it: it only runs where the primary pointer is
 *   fine and can hover.
 * - With reduced motion, it follows the pointer exactly, with no easing.
 * - The system cursor is only hidden once this script is running (see
 *   `.has-custom-cursor`), so the page never ends up without a cursor.
 */
export function CustomCursor() {
  const outer = useRef<HTMLDivElement>(null);
  const inverse = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = outer.current;
    const layer = inverse.current;
    if (!el || !layer) return;
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
    // The element currently copied into the circle, and its copy.
    let source: Element | null = null;
    let copy: HTMLElement | null = null;

    // Line the copy up with the original, relative to the circle's centre.
    const alignCopy = () => {
      if (!source || !copy) return;
      const r = source.getBoundingClientRect();
      copy.style.transform = `translate3d(${r.left - cx}px, ${r.top - cy}px, 0)`;
    };

    const place = () => {
      el.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      alignCopy();
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

    // The block to copy: the link itself if it's a block (a button, say),
    // otherwise the block it sits in, so wrapped lines break the same way.
    const blockFor = (target: Element) =>
      getComputedStyle(target).display === "inline" && target.parentElement
        ? target.parentElement
        : target;

    const setTarget = (target: Element | null) => {
      const next = target ? blockFor(target) : null;
      el.dataset.active = String(Boolean(next));
      if (next === source) return;
      source = next;
      copy?.remove();
      copy = null;
      if (!next) return;

      const r = next.getBoundingClientRect();
      const cs = getComputedStyle(next);
      const clone = next.cloneNode(true) as HTMLElement;
      clone.removeAttribute("id");
      clone.querySelectorAll("[id]").forEach((n) => n.removeAttribute("id"));
      clone.setAttribute("aria-hidden", "true");
      clone.setAttribute("inert", "");
      // Keep inherited text styles, size and layout identical.
      Object.assign(clone.style, {
        position: "absolute",
        top: "0",
        left: "0",
        margin: "0",
        width: `${r.width}px`,
        height: `${r.height}px`,
        boxSizing: "border-box",
        fontFamily: cs.fontFamily,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        lineHeight: cs.lineHeight,
        letterSpacing: cs.letterSpacing,
        textTransform: cs.textTransform,
        textAlign: cs.textAlign,
      });
      copy = clone;
      layer.appendChild(clone);
      alignCopy();
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
      setTarget(target?.closest(INTERACTIVE) ?? null);
    };

    const onScroll = () => alignCopy();
    const onDown = () => (el.dataset.pressed = "true");
    const onUp = () => (el.dataset.pressed = "false");
    const onLeave = () => {
      shown = false;
      el.dataset.visible = "false";
      setTarget(null);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    root.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      copy?.remove();
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("scroll", onScroll);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={outer} aria-hidden="true" className="custom-cursor">
      <div className="custom-cursor-shape">
        <div ref={inverse} className="custom-cursor-inverse" />
      </div>
    </div>
  );
}
