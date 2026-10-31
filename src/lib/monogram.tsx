import { ImageResponse } from "next/og";
import { loadOgFonts, ogColors as c } from "./og-fonts";

/**
 * The "JK" monogram used for the favicon and home-screen icon: paper
 * lettering on an ink square, set in the display serif. Swap this for
 * your own lettering mark when it's ready.
 */
export function monogram(px: number) {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: c.text,
        color: c.bg,
        fontFamily: "Display",
        fontSize: px * 0.56,
        letterSpacing: "-0.04em",
        // Small icons get a rounded square; the home-screen icon is
        // rounded by the phone itself.
        borderRadius: px <= 64 ? px * 0.18 : 0,
      }}
    >
      JK
    </div>,
    { width: px, height: px, fonts: loadOgFonts() },
  );
}
