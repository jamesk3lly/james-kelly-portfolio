import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/Container";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <Container className="py-20 sm:py-32">
      <p className="text-label text-muted uppercase">404</p>
      <h1 className="mt-4 max-w-4xl font-display text-display text-balance">
        Nothing painted on this wall yet.
      </h1>
      <p className="mt-8 max-w-xl text-lede text-muted">
        The page you’re looking for has moved or never existed.
      </p>
      <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
        <li>
          <Link href="/" className="prose-link">
            Go to the home page
          </Link>
        </li>
        <li>
          <Link href="/#work" className="prose-link">
            See selected work
          </Link>
        </li>
      </ul>
    </Container>
  );
}
