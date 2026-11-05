import Link from "next/link";
import { site } from "@/lib/site";
import { getAllWork } from "@/lib/work";
import { Container } from "./Container";
import { NavLinks } from "./NavLinks";
import { ThemeToggle } from "./ThemeToggle";

export async function SiteHeader() {
  // For the Work dropdown: just what it lists.
  const work = (await getAllWork()).map(
    ({ slug, project, number, year, tint }) => ({
      slug,
      project,
      number,
      year,
      tint,
    }),
  );

  return (
    <header>
      <Container className="relative flex items-center justify-between gap-3 pt-[30px] pb-5 sm:gap-6 sm:pt-[38px] sm:pb-7">
        <Link
          href="/"
          className="font-display text-lg tracking-tight whitespace-nowrap transition-colors hover:text-accent min-[400px]:text-xl sm:text-2xl"
        >
          {site.name}
        </Link>

        <div className="flex items-center gap-3 sm:gap-8">
          <nav aria-label="Main">
            <NavLinks work={work} />
          </nav>
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}
