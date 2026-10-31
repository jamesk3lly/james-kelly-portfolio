import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SkipLink } from "@/components/SkipLink";
import { ThemeScript } from "@/components/ThemeScript";
import { site } from "@/lib/site";
import { displayFont, textFont } from "./fonts";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.role}`,
    template: `%s — ${site.name}`,
  },
  description: `Portfolio of ${site.name}, ${site.role.toLowerCase()}.`,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // data-theme="light" is only the server default; ThemeScript replaces it
    // before paint, hence suppressHydrationWarning.
    <html
      lang="en-IE"
      data-theme="light"
      suppressHydrationWarning
      className={`${textFont.variable} ${displayFont.variable} antialiased`}
    >
      <head>
        <ThemeScript />
      </head>
      <body className="flex min-h-dvh flex-col">
        <SkipLink />
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
