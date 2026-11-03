"use client";

import { useEffect, useRef } from "react";

/*
 * Generative ASCII art for the home page hero: a field of lines and dots
 * that forms interlocking rosettes, drifting in a seamless loop.
 *
 * How it works: WAVES plane waves at evenly spaced angles are added
 * together (a "quasicrystal" pattern). Each character cell samples that
 * field. Where the field crosses one of a few levels, the cell draws a line character
 * following the contour (- / | \); near the peaks it draws dots (. : o).
 * Every wave's phase moves one full turn per loop, so the end of the loop
 * meets its start exactly.
 *
 * Tuning: WAVES changes the symmetry (5 gives tenfold rosettes, 3 gives
 * hexagons), SCALE the size of the shapes, LOOP_MS the speed.
 */
const WAVES = 5;
const SCALE = 0.28; // wave frequency per character cell (smaller = bigger shapes)
const LOOP_MS = 12_000;
const FPS = 24;

const ANGLES = Array.from({ length: WAVES }, (_, i) => (i * Math.PI) / WAVES);
const COS = ANGLES.map(Math.cos);
const SIN = ANGLES.map(Math.sin);

// Contour direction → line character. Screen y points down, so a line
// rising to the right is "/".
const LINES = ["-", "\\", "|", "/"];

// Contour levels drawn as lines (the field runs from -WAVES to WAVES),
// and the level above which peaks are drawn as dots.
const LEVELS = [0];
const PEAK = 3.4;

/** Builds one frame as two strings: lines and dots, drawn in two colours. */
function frame(cols: number, rows: number, aspect: number, t: number) {
  let lines = "";
  let dots = "";
  const phase = t * Math.PI * 2;
  const cx = cols / 2;
  const cy = rows / 2;

  for (let r = 0; r < rows; r++) {
    // Cells are taller than wide, so y is stretched to keep shapes round.
    const y = (r - cy) * aspect * SCALE;
    for (let c = 0; c < cols; c++) {
      const x = (c - cx) * SCALE;
      let v = 0;
      let gx = 0;
      let gy = 0;
      for (let i = 0; i < WAVES; i++) {
        // Alternate waves drift in opposite directions, so the rosettes
        // turn and breathe rather than slide across.
        const a = x * COS[i] + y * SIN[i] + (i % 2 ? phase : -phase);
        v += Math.cos(a);
        const s = Math.sin(a);
        gx -= s * COS[i];
        gy -= s * SIN[i];
      }
      // Distance (in cells) from this cell to the nearest contour level,
      // so every line is drawn exactly one character wide.
      // (Distances are in character widths; a cell is `aspect` widths tall.)
      const g = Math.hypot(gx, gy) || 1e-6;
      const half = (0.5 * (Math.abs(gx) + Math.abs(gy) * aspect)) / g;
      let line = " ";
      let dot = " ";
      const level = LEVELS.find((l) => Math.abs(v - l) / (g * SCALE) < half);
      if (level !== undefined) {
        // The contour runs at right angles to the gradient.
        const angle = Math.atan2(gy, gx) + Math.PI / 2;
        const k =
          Math.round(
            (((angle % Math.PI) + Math.PI) % Math.PI) / (Math.PI / 4),
          ) % 4;
        line = LINES[k];
      } else if (v > PEAK) {
        dot = "o";
      } else if (v > PEAK - 1.1) {
        dot = ".";
      }
      lines += line;
      dots += dot;
    }
    lines += "\n";
    dots += "\n";
  }
  return { lines, dots };
}

export function AsciiField({ className = "" }: { className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const linesEl = useRef<HTMLPreElement>(null);
  const dotsEl = useRef<HTMLPreElement>(null);
  const probe = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = box.current;
    const lineLayer = linesEl.current;
    const dotLayer = dotsEl.current;
    const cell = probe.current;
    if (!el || !lineLayer || !dotLayer || !cell) return;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    let cols = 0;
    let rows = 0;
    let aspect = 2;
    let raf = 0;
    let last = 0;
    let visible = true;
    const start = performance.now();

    const draw = (now: number) => {
      // With reduced motion, hold one still frame.
      const t = reduce.matches ? 0.15 : ((now - start) % LOOP_MS) / LOOP_MS;
      const { lines, dots } = frame(cols, rows, aspect, t);
      lineLayer.textContent = lines;
      dotLayer.textContent = dots;
    };

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < 1000 / FPS) return;
      last = now;
      draw(now);
    };

    const play = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      if (!cols || !rows) return;
      if (reduce.matches || !visible) {
        draw(performance.now());
        return;
      }
      raf = requestAnimationFrame(loop);
    };

    // Fit the grid to the box, using the real size of one character.
    const measure = () => {
      const r = cell.getBoundingClientRect();
      if (!r.width || !r.height) return;
      aspect = r.height / r.width;
      cols = Math.floor(el.clientWidth / r.width);
      rows = Math.floor(el.clientHeight / r.height);
      play();
    };

    const resize = new ResizeObserver(measure);
    resize.observe(el);
    // Only animate while it's on screen.
    const seen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      play();
    });
    seen.observe(el);
    reduce.addEventListener("change", play);

    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      seen.disconnect();
      reduce.removeEventListener("change", play);
    };
  }, []);

  return (
    <div ref={box} aria-hidden="true" className={`ascii-field ${className}`}>
      <span ref={probe} className="ascii-field-probe">
        M
      </span>
      <pre ref={linesEl} className="ascii-field-lines" />
      <pre ref={dotsEl} className="ascii-field-dots" />
    </div>
  );
}
