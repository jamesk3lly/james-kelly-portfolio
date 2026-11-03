"use client";

import { useEffect, useRef } from "react";

/*
 * Generative line art for the home page hero: circles, lines and dots.
 *
 * A honeycomb grid of points, each with a dot travelling round its own
 * small circle. Each dot is a little behind the one nearer the centre, so a
 * ripple of rotation spreads outwards. Lines join every dot to its
 * neighbours, and as the dots move out of step the mesh folds into
 * rippling, interlocking shapes. Every dot makes exactly one turn per loop,
 * so the end of the loop meets its start.
 *
 * Tuning:
 * - SPACING: distance between grid points (px).
 * - ORBIT: radius of each dot's circle, as a share of SPACING. Above 0.5
 *   the circles overlap their neighbours and interlock.
 * - RIPPLE: how far behind each ring of dots runs (higher = tighter rings).
 * - LOOP_MS: length of one loop.
 */
const SPACING = 56;
const ORBIT = 0.58;
const RIPPLE = 0.75;
const LOOP_MS = 9_000;

type Colours = { line: string; ring: string; dot: string };

// Reads the theme colours from CSS, so the pattern follows light and dark.
function readColours(el: Element): Colours {
  const cs = getComputedStyle(el);
  return {
    line: cs.getPropertyValue("--hero-pattern-line").trim(),
    ring: cs.getPropertyValue("--hero-pattern-ring").trim(),
    dot: cs.getPropertyValue("--hero-pattern-dot").trim(),
  };
}

export function HeroPattern({ className = "" }: { className?: string }) {
  const box = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = box.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!el || !canvas || !ctx) return;

    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    let width = 0;
    let height = 0;
    let colours = readColours(el);
    let raf = 0;
    let visible = true;
    const start = performance.now();

    // Grid points: position, distance from the centre, and the indexes of
    // the neighbours each one draws lines to (each pair is drawn once).
    let points: { x: number; y: number; d: number }[] = [];
    let links: [number, number][] = [];

    const build = () => {
      points = [];
      links = [];
      const rowH = SPACING * (Math.sqrt(3) / 2);
      const cols = Math.ceil(width / SPACING) + 2;
      const rows = Math.ceil(height / rowH) + 2;
      const cx = width / 2;
      const cy = height / 2;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = (c - 0.5 + (r % 2 ? 0.5 : 0)) * SPACING;
          const y = (r - 0.5) * rowH;
          points.push({ x, y, d: Math.hypot(x - cx, y - cy) / SPACING });
          const i = r * cols + c;
          // Lines run along the two diagonals of the grid (not across), so
          // they read as woven threads rather than a net. Offset rows shift
          // by half a step, so the neighbours below depend on the row.
          if (r + 1 < rows) {
            const below = (r + 1) * cols + c;
            const shift = r % 2 ? 1 : -1;
            links.push([i, below]);
            if (c + shift >= 0 && c + shift < cols)
              links.push([i, below + shift]);
          }
        }
      }
    };

    const draw = (now: number) => {
      // With reduced motion, hold one still frame.
      const t = reduce.matches ? 0.2 : ((now - start) % LOOP_MS) / LOOP_MS;
      const turn = t * Math.PI * 2;
      const r = SPACING * ORBIT;

      const dx = new Float32Array(points.length);
      const dy = new Float32Array(points.length);
      points.forEach((p, i) => {
        const a = turn - p.d * RIPPLE;
        dx[i] = p.x + Math.cos(a) * r;
        dy[i] = p.y + Math.sin(a) * r;
      });

      ctx.clearRect(0, 0, width, height);

      // Circles: the path each dot travels.
      ctx.beginPath();
      for (const p of points) {
        ctx.moveTo(p.x + r, p.y);
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      }
      ctx.strokeStyle = colours.ring;
      ctx.lineWidth = 1;
      ctx.stroke();

      // Lines between neighbouring dots.
      ctx.beginPath();
      for (const [a, b] of links) {
        ctx.moveTo(dx[a], dy[a]);
        ctx.lineTo(dx[b], dy[b]);
      }
      ctx.strokeStyle = colours.line;
      ctx.stroke();

      // Dots.
      ctx.beginPath();
      for (let i = 0; i < points.length; i++) {
        ctx.moveTo(dx[i] + 2.5, dy[i]);
        ctx.arc(dx[i], dy[i], 2.5, 0, Math.PI * 2);
      }
      ctx.fillStyle = colours.dot;
      ctx.fill();
    };

    const loop = (now: number) => {
      draw(now);
      raf = requestAnimationFrame(loop);
    };

    const play = () => {
      cancelAnimationFrame(raf);
      raf = 0;
      if (!width || !height) return;
      if (reduce.matches || !visible) {
        draw(performance.now());
        return;
      }
      raf = requestAnimationFrame(loop);
    };

    // Match the canvas to its box at the screen's pixel density.
    const resize = new ResizeObserver(() => {
      width = el.clientWidth;
      height = el.clientHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
      play();
    });
    resize.observe(el);

    // Only animate while it's on screen.
    const seen = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      play();
    });
    seen.observe(el);

    // Redraw in the new colours when the theme changes.
    const theme = new MutationObserver(() => {
      colours = readColours(el);
      play();
    });
    theme.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    reduce.addEventListener("change", play);

    return () => {
      cancelAnimationFrame(raf);
      resize.disconnect();
      seen.disconnect();
      theme.disconnect();
      reduce.removeEventListener("change", play);
    };
  }, []);

  return (
    <div ref={box} aria-hidden="true" className={`hero-pattern ${className}`}>
      <canvas ref={canvasRef} className="size-full" />
    </div>
  );
}
