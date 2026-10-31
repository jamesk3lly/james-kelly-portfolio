import { readFileSync } from "node:fs";
import path from "node:path";

/**
 * Font files for generated images (share image and app icons), which can't
 * use next/font. They come from the @fontsource packages.
 *
 * If you change the display serif in src/app/fonts.ts, install the matching
 * @fontsource package and point `display` at its .woff file here.
 */
const files = path.join(process.cwd(), "node_modules", "@fontsource");

// Read once when the module loads (synchronously), so Next can generate
// the icons and share image at build time instead of on each request.
const display = readFileSync(
  path.join(files, "newsreader/files/newsreader-latin-400-normal.woff"),
);
const text = readFileSync(
  path.join(files, "inter/files/inter-latin-400-normal.woff"),
);

export function loadOgFonts() {
  return [
    {
      name: "Display",
      data: display,
      weight: 400 as const,
      style: "normal" as const,
    },
    {
      name: "Text",
      data: text,
      weight: 400 as const,
      style: "normal" as const,
    },
  ];
}

// Light theme colours, kept in sync with globals.css by hand.
export const ogColors = {
  bg: "#f5f1e8",
  text: "#1b1915",
  muted: "#5c564c",
  accent: "#543afd",
};
