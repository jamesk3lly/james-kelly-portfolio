import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/Container";
import { site } from "@/lib/site";
import { UnlockForm } from "./UnlockForm";

export const metadata: Metadata = {
  title: "Case studies",
  robots: { index: false },
};

/**
 * Where visitors land when they open a case study without the password
 * (see src/proxy.ts and src/lib/access.ts).
 */
export default function UnlockPage() {
  return (
    <Container className="py-20 sm:py-32">
      <p className="text-label text-muted uppercase">Password protected</p>
      <h1 className="mt-4 max-w-4xl font-display text-title text-balance">
        The case studies are password protected.
      </h1>
      <p className="mt-8 max-w-xl text-lede text-muted">
        Enter the password to read them. If you don’t have it, email{" "}
        <a href={`mailto:${site.email}`} className="prose-link">
          {site.email}
        </a>{" "}
        and I’ll send it over.
      </p>
      {/* Reads ?next= (the case study to return to) in the browser. */}
      <Suspense>
        <UnlockForm />
      </Suspense>
    </Container>
  );
}
