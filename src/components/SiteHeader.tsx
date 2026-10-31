import Link from "next/link";
import { site } from "@/lib/site";
import { Container } from "./Container";
import { NavLinks } from "./NavLinks";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader() {
  return (
    <header>
      <Container className="flex items-center justify-between gap-6 py-5 sm:py-7">
        <Link
          href="/"
          className="font-display text-xl tracking-tight transition-colors hover:text-accent sm:text-2xl"
        >
          {site.name}
        </Link>

        <div className="flex items-center gap-5 sm:gap-8">
          <nav aria-label="Main">
            <NavLinks />
          </nav>
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}
