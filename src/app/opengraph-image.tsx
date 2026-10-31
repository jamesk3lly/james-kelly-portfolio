import { ImageResponse } from "next/og";
import { hero } from "@/content/home";
import { site } from "@/lib/site";
import { loadOgFonts, ogColors as c } from "@/lib/og-fonts";

// The image shown when the site is shared on LinkedIn, Slack and so on.
// It's generated at build time from the hero statement, so it updates
// when the copy does.
export const alt = `${site.name}: ${hero.statement}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: c.bg,
        color: c.text,
        fontFamily: "Text",
      }}
    >
      <div style={{ fontFamily: "Display", fontSize: 40 }}>{site.name}</div>
      <div
        style={{
          fontFamily: "Display",
          fontSize: 92,
          lineHeight: 1,
          letterSpacing: "-0.02em",
          maxWidth: 980,
        }}
      >
        {hero.statement}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ width: 48, height: 3, background: c.accent }} />
        <div style={{ fontSize: 26, color: c.muted }}>
          {`${site.role} · ${site.location}`}
        </div>
      </div>
    </div>,
    { ...size, fonts: loadOgFonts() },
  );
}
