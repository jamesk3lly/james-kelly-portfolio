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
export const displayFont = Newsreader({
  subsets: ["latin"],
  style: ["normal", "italic"],
  // Optical size lets large headlines use shapes drawn for display sizes.
  axes: ["opsz"],
  variable: "--font-display-face",
  display: "swap",
});
