import { Inter, Merriweather } from "next/font/google";

/**
 * The two site typefaces. Fonts are downloaded at build time and served
 * from this site, so there are no requests to Google and no layout shift.
 *
 * To change the display serif: swap `Merriweather` for another Google font
 * (or `next/font/local` for a font file in /src/fonts), keep
 * `variable: "--font-display-face"`, and everything else follows.
 */

// Text face: body copy, navigation, labels, captions.
export const textFont = Inter({
  subsets: ["latin"],
  variable: "--font-text-face",
  display: "swap",
});

// Display face (Merriweather): hero, page titles, section headings, card
// headlines, numbers and pull quotes.
//
// Loaded as a variable font (weight axis only, upright), so the hero can
// sit a touch lighter (360) than other headings (400).
//
// Performance: the headline is the largest thing on each page, so its font
// file size directly affects the Lighthouse score. Loading italics or extra
// variable axes here roughly quadrupled the download. Keep the serif lean.
export const displayFont = Merriweather({
  subsets: ["latin"],
  style: "normal",
  variable: "--font-display-face",
  display: "swap",
});
