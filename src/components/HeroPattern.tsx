"use client";

import { useEffect, useRef } from "react";

/*
 * Generative line art for the home page hero: lines and dots.
 *
 * Two meshes are layered over each other. Each is a honeycomb grid of
 * points, with a dot travelling round its own small (invisible) circle.
 * Each dot runs a little behind its neighbour, so a ripple of rotation
 * spreads through the grid, and lines join every dot to its neighbours, so
 * the mesh folds as the dots move out of step.
 *
 * The first mesh ripples outwards in rings. The second is finer, turned to
 * a different angle, and ripples the other way in spiral arms, so where
 * the two cross they make shifting moiré patterns. Lines are stronger the
 * more they're stretched and fainter when bunched up, which gives the
 * mesh depth. Every dot makes a whole number of turns per loop, so the end
 * of the loop meets its start.
 *
 * The cursor pushes nearby dots away, so the mesh bulges around it like a
 * lens, then settles back when the cursor leaves.
 *
 * Tuning (per layer, in LAYERS):
 * - spacing: distance between grid points (px).
 * - orbit: radius of each dot's circle, as a share of spacing.
 * - ripple: how far behind each ring of dots runs (higher = tighter rings).
 * - arms: number of spiral arms (0 = plain rings). Whole numbers only.
 * - turns: turns per loop; negative runs the other way. Whole numbers only.
 * - angle: rotation of the grid (radians).
 * - dot: dot radius (px). weight: overall strength of the layer (0 to 1).
 * And: LOOP_MS, the length of one loop; PUSH and REACH, how far the cursor
 * pushes dots (px) and over what radius.
 */
type Layer = {
  spacing: number;
  orbit: number;
  ripple: number;
  arms: number;
  turns: number;
  angle: number;
  dot: number;
  weight: number;
};

const LAYERS: Layer[] = [
  {
    spacing: 56,
    orbit: 0.58,
    ripple: 0.75,
    arms: 0,
    turns: 1,
    angle: 0,
    dot: 2.5,
    weight: 1,
  },
  {
    spacing: 40,
    orbit: 0.55,
    ripple: 0.4,
    arms: 3,
    turns: -1,
    angle: Math.PI / 7,
    dot: 1.5,
    weight: 0.65,
  },
];
const LOOP_MS = 14_000;
const PUSH = 30;
const REACH = 130;

// Line strength by how stretched the line is (length ÷ spacing).
const STRETCH = [
  { below: 0.75, alpha: 0.35 },
  { below: 1.15, alpha: 0.7 },
  { below: Infinity, alpha: 1 },
];

type Colours = { line: string; dot: string };

// Reads the theme colours from CSS, so the pattern follows light and dark.
function readColours(el: Element): Colours {
  const cs = getComputedStyle(el);
  return {
    line: cs.getPropertyValue("--hero-pattern-line").trim(),
    dot: cs.getPropertyValue("--hero-pattern-dot").trim(),
  };
}

// One mesh's grid: rest positions, the phase offset of each point, and the
// pairs of points joined by lines.
type Mesh = {
  layer: Layer;
  x: Float32Array;
  y: Float32Array;
  phase: Float32Array;
  links: Uint32Array;
};

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

    let meshes: Mesh[] = [];

    // Lay out each mesh's grid, rotated about the centre, covering the box.
    const build = () => {
      const cx = width / 2;
      const cy = height / 2;
      meshes = LAYERS.map((layer) => {
        const { spacing } = layer;
        const rowH = spacing * (Math.sqrt(3) / 2);
        // Big enough to cover the box at any rotation.
        const reach = Math.hypot(width, height) / 2 + spacing * 2;
        const cols = Math.ceil((reach * 2) / spacing) + 1;
        const rows = Math.ceil((reach * 2) / rowH) + 1;
        const cos = Math.cos(layer.angle);
        const sin = Math.sin(layer.angle);
        const margin = spacing * 2;
        const xs: number[] = [];
        const ys: number[] = [];
        const phases: number[] = [];
        const links: number[] = [];
        const index = new Int32Array(rows * cols).fill(-1);

        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const gx = (c + (r % 2 ? 0.5 : 0)) * spacing - reach;
            const gy = r * rowH - reach;
            const x = cx + gx * cos - gy * sin;
            const y = cy + gx * sin + gy * cos;
            // Skip points well outside the box.
            if (
              x < -margin ||
              y < -margin ||
              x > width + margin ||
              y > height + margin
            )
              continue;
            const d = Math.hypot(gx, gy) / spacing;
            const around = Math.atan2(gy, gx);
            index[r * cols + c] = xs.length;
            xs.push(x);
            ys.push(y);
            phases.push(d * layer.ripple - around * layer.arms);
          }
        }
        // Lines run along the grid's two diagonals (not across), so they
        // read as woven threads rather than a net. Offset rows shift by half
        // a step, so the neighbours below depend on the row.
        for (let r = 0; r + 1 < rows; r++) {
          const shift = r % 2 ? 1 : -1;
          for (let c = 0; c < cols; c++) {
            const i = index[r * cols + c];
            if (i < 0) continue;
            const a = index[(r + 1) * cols + c];
            if (a >= 0) links.push(i, a);
            const cc = c + shift;
            if (cc >= 0 && cc < cols) {
              const b = index[(r + 1) * cols + cc];
              if (b >= 0) links.push(i, b);
            }
          }
        }
        return {
          layer,
          x: Float32Array.from(xs),
          y: Float32Array.from(ys),
          phase: Float32Array.from(phases),
          links: Uint32Array.from(links),
        };
      });
    };

    const draw = (now: number) => {
      // With reduced motion, hold one still frame.
      const t = reduce.matches ? 0.2 : ((now - start) % LOOP_MS) / LOOP_MS;
      const turn = t * Math.PI * 2;

      pointer.x += (pointer.tx - pointer.x) * 0.12;
      pointer.y += (pointer.ty - pointer.y) * 0.12;
      pointer.push += (pointer.target - pointer.push) * 0.06;
      const pushing = !reduce.matches && pointer.push > 0.001;

      ctx.clearRect(0, 0, width, height);
      ctx.lineWidth = 1;

      for (const mesh of meshes) {
        const { layer } = mesh;
        const n = mesh.x.length;
        const r = layer.spacing * layer.orbit;
        const dx = new Float32Array(n);
        const dy = new Float32Array(n);
        for (let i = 0; i < n; i++) {
          const a = turn * layer.turns - mesh.phase[i];
          let x = mesh.x[i] + Math.cos(a) * r;
          let y = mesh.y[i] + Math.sin(a) * r;
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
        }

        // Lines, grouped by how stretched they are, faint to strong.
        ctx.strokeStyle = colours.line;
        for (let s = 0; s < STRETCH.length; s++) {
          const lo = s ? STRETCH[s - 1].below : 0;
          const hi = STRETCH[s].below;
          ctx.beginPath();
          for (let k = 0; k < mesh.links.length; k += 2) {
            const a = mesh.links[k];
            const b = mesh.links[k + 1];
            const len =
              Math.hypot(dx[a] - dx[b], dy[a] - dy[b]) / layer.spacing;
            if (len < lo || len >= hi) continue;
            ctx.moveTo(dx[a], dy[a]);
            ctx.lineTo(dx[b], dy[b]);
          }
          ctx.globalAlpha = STRETCH[s].alpha * layer.weight;
          ctx.stroke();
        }

        // Dots.
        ctx.beginPath();
        for (let i = 0; i < n; i++) {
          ctx.moveTo(dx[i] + layer.dot, dy[i]);
          ctx.arc(dx[i], dy[i], layer.dot, 0, Math.PI * 2);
        }
        ctx.globalAlpha = layer.weight;
        ctx.fillStyle = colours.dot;
        ctx.fill();
      }
      ctx.globalAlpha = 1;
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
