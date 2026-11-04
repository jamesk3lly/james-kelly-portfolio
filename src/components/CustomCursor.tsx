"use client";

import { useEffect, useRef } from "react";

// Anything a visitor can click.
const INTERACTIVE = "a[href], button, [role='button'], label, summary, select";
// Blocks of text the cursor inverts when it passes over them. List items
// aren't included, since some hold a whole card; one with text of its own
// is still found (see hasOwnText below).
const TEXT =
  "h1, h2, h3, h4, h5, h6, p, dt, dd, figcaption, blockquote, time, td, th";

/**
 * A circular cursor that replaces the system pointer on mouse and trackpad
 * devices: a soft purple circle with a fine purple outline that eases after
 * the pointer. Styles are in globals.css.
 *
 * Over any item (text, a link, a button or an image) the circle fills with
 * solid purple and the part of the item inside it is shown inverted: text
 * in the page background colour, images as a purple duotone. To do that,
 * the item is copied into the circle and kept lined up with the original,
 * so it reads as the same thing in reverse colours. Over empty background
 * it stays a soft circle.
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
    // Line the copy up with the original, and match its size: work card
    // images grow on hover, so the copy has to grow with them.
    const alignCopy = () => {
      if (!source || !copy) return;
      const r = source.getBoundingClientRect();
      copy.style.transform = `translate3d(${r.left - cx}px, ${r.top - cy}px, 0)`;
      copy.style.width = `${r.width}px`;
      copy.style.height = `${r.height}px`;
    };

    // Keep the copy matched while the original animates (an image growing
    // on hover takes 700ms), even if the pointer stays still.
    let follow = 0;
    const followFor = (ms: number) => {
      cancelAnimationFrame(follow);
      const until = performance.now() + ms;
      const step = (now: number) => {
        alignCopy();
        follow = now < until ? requestAnimationFrame(step) : 0;
      };
      follow = requestAnimationFrame(step);
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

    // An image under the pointer. Checked by position, because some images
    // sit beneath a link (the work cards) and never receive the pointer.
    const imageAt = (px: number, py: number) => {
      for (const img of document.images) {
        if (img.closest(".custom-cursor")) continue;
        const r = img.getBoundingClientRect();
        if (px >= r.left && px <= r.right && py >= r.top && py <= r.bottom)
          return img;
      }
      return null;
    };

    // Whether the pointer is over the words of a text block, not just its
    // box (a headline's box runs the full width, well past its last letter).
    const range = document.createRange();
    const overText = (block: Element, px: number, py: number) => {
      range.selectNodeContents(block);
      for (const r of range.getClientRects()) {
        if (
          px >= r.left - 8 &&
          px <= r.right + 8 &&
          py >= r.top &&
          py <= r.bottom
        )
          return true;
      }
      return false;
    };

    const hasOwnText = (e: Element) =>
      [...e.childNodes].some(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim(),
      );

    // What to invert under the pointer: an image, a link or button (its
    // text block), a block of text, or nothing over empty background.
    const findTarget = (hit: Element | null, px: number, py: number) => {
      if (!hit || hit.closest(".custom-cursor")) return null;
      const img = imageAt(px, py);
      if (img) return img;
      // Look through everything stacked under the pointer, top first. A
      // card's link is stretched over the whole card, so the summary, date
      // and number sit underneath it; they still count when the pointer is
      // over their words.
      let underLink: Element | null = null;
      for (const e of document.elementsFromPoint(px, py)) {
        if (e.closest(".custom-cursor")) continue;
        const link = e.closest(INTERACTIVE);
        if (link) {
          if (overText(link, px, py)) return blockFor(link);
          underLink ??= link;
        }
        // The nearest text block, or an element holding text of its own
        // (such as a card's number).
        const block = hasOwnText(e) ? blockFor(e) : e.closest(TEXT);
        if (block && overText(block, px, py)) return block;
      }
      // Elsewhere on a link (a card's padding, an icon button): the solid
      // circle, with nothing to invert inside it.
      return underLink ? blockFor(underLink) : null;
    };

    const setTarget = (next: Element | null) => {
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
      if (
        clone instanceof HTMLImageElement &&
        next instanceof HTMLImageElement
      ) {
        // Load the same file the page shows, straight away.
        clone.removeAttribute("srcset");
        clone.removeAttribute("sizes");
        clone.loading = "eager";
        clone.src = next.currentSrc || next.src;
      }
      // Keep inherited text styles, size and layout identical.
      Object.assign(clone.style, {
        position: "absolute",
        top: "0",
        left: "0",
        margin: "0",
        width: `${r.width}px`,
        // The base styles cap images at their container's width (here, 0).
        maxWidth: "none",
        height: `${r.height}px`,
        boxSizing: "border-box",
        fontFamily: cs.fontFamily,
        fontSize: cs.fontSize,
        fontWeight: cs.fontWeight,
        lineHeight: cs.lineHeight,
        letterSpacing: cs.letterSpacing,
        textTransform: cs.textTransform,
        textAlign: cs.textAlign,
        // A copied list item sits outside its list, so it would get a
        // bullet back.
        listStyle: "none",
      });
      copy = clone;
      layer.appendChild(clone);
      alignCopy();
      followFor(900);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      x = e.clientX;
      y = e.clientY;
      setTarget(findTarget(e.target as Element | null, x, y));
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

    // Scrolling moves the page under a still pointer, so look again.
    const onScroll = () => {
      if (shown) setTarget(findTarget(document.elementFromPoint(x, y), x, y));
      alignCopy();
    };
    const onDown = () => (el.dataset.pressed = "true");
    const onUp = () => (el.dataset.pressed = "false");
    const onLeave = () => {
      shown = false;
      el.dataset.visible = "false";
      setTarget(null);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    root.addEventListener("pointerleave", onLeave);

    return () => {
      cancelAnimationFrame(frame);
      cancelAnimationFrame(follow);
      copy?.remove();
      root.classList.remove("has-custom-cursor");
      window.removeEventListener("pointermove", onMove);
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
