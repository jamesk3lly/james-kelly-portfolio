"use client";

import { useEffect, useRef } from "react";

/*
 * Generative line art for the home page hero: lines and dots.
 *
 * A honeycomb grid of points, each with a dot travelling round its own
 * small (invisible) circle. Each dot is a little behind the one nearer the centre, so a
 * ripple of rotation spreads outwards. Lines join every dot to its
 * neighbours, and as the dots move out of step the mesh folds into
 * rippling, interlocking shapes. Every dot makes exactly one turn per loop,
 * so the end of the loop meets its start.
 *
 * The cursor pushes nearby dots away, so the mesh bulges around it like a
 * lens, then settles back when the cursor leaves.
 *
 * Tuning:
 * - SPACING: distance between grid points (px).
 * - ORBIT: radius of each dot's circle, as a share of SPACING.
 * - RIPPLE: how far behind each ring of dots runs (higher = tighter rings).
 * - LOOP_MS: length of one loop.
 * - PUSH, REACH: how far the cursor pushes dots (px), and over what radius.
 */
const SPACING = 56;
const ORBIT = 0.58;
const RIPPLE = 0.75;
const LOOP_MS = 9_000;
const PUSH = 30;
const REACH = 130;

type Colours = { line: string; dot: string };

// Reads the theme colours from CSS, so the pattern follows light and dark.
function readColours(el: Element): Colours {
  const cs = getComputedStyle(el);
  return {
    line: cs.getPropertyValue("--hero-pattern-line").trim(),
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
    // The cursor, eased: its position in the canvas and how strongly it
    // pushes (0 when it's away, easing up to 1 when it's over the pattern).
    const pointer = { x: 0, y: 0, tx: 0, ty: 0, push: 0, target: 0 };

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

      pointer.x += (pointer.tx - pointer.x) * 0.12;
      pointer.y += (pointer.ty - pointer.y) * 0.12;
      pointer.push += (pointer.target - pointer.push) * 0.06;
      const pushing = !reduce.matches && pointer.push > 0.001;

      const dx = new Float32Array(points.length);
      const dy = new Float32Array(points.length);
      points.forEach((p, i) => {
        const a = turn - p.d * RIPPLE;
        let x = p.x + Math.cos(a) * r;
        let y = p.y + Math.sin(a) * r;
        if (pushing) {
          // Push away from the cursor, strongest close to it.
          const ox = x - pointer.x;
          const oy = y - pointer.y;
          const dist = Math.hypot(ox, oy) || 1;
          const f = pointer.push * PUSH * Math.exp(-((dist / REACH) ** 2));
          x += (ox / dist) * f;
          y += (oy / dist) * f;
        }
        dx[i] = x;
        dy[i] = y;
      });

      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1;

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

    // Follow the mouse (not touch, so scrolling a phone doesn't bulge it).
    // The pattern ignores pointer events, so this listens on the window.
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const inside = x > 0 && y > 0 && x < rect.width && y < rect.height;
      if (inside && pointer.target === 0) {
        // Start the push where the cursor enters, not where it last left.
        pointer.x = x;
        pointer.y = y;
      }
      pointer.tx = x;
      pointer.ty = y;
      pointer.target = inside ? 1 : 0;
    };
    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
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
