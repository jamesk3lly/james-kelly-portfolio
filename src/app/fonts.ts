import { Inter, Newsreader } from "next/font/google";

/**
 * The two site typefaces. Fonts are downloaded at build time and served
 * from this site, so there are no requests to Google and no layout shift.
 *
 * To change the display serif: swap `Newsreader` for another Google font
 * (or `next/font/local` for a font file in /src/fonts), keep
 * `variable: "--font-display-face"`, and everything else follows.
 */

// Text face: body copy, navigation, labels, captions.
export const textFont = Inter({
  subsets: ["latin"],
  variable: "--font-text-face",
  display: "swap",
});

// Display face: hero, page titles, section headings, card headlines.
// TEMPORARY stand-in until James chooses the final serif.
//
// Performance: only the one weight the site uses (400, upright) is loaded.
// The headline is the largest thing on each page, so its font file size
// directly affects the Lighthouse score. Loading italics or extra variable
// axes here roughly quadrupled the download. Keep the final serif lean too.
export const displayFont = Newsreader({
  subsets: ["latin"],
  weight: "400",
  style: "normal",
  variable: "--font-display-face",
  display: "swap",
});
