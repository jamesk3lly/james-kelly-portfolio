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
      <Container className="relative flex items-center justify-between gap-6 pt-[30px] pb-5 sm:pt-[38px] sm:pb-7">
        <Link
          href="/"
          className="font-display text-xl tracking-tight transition-colors hover:text-accent sm:text-2xl"
        >
          {site.name}
        </Link>

        <div className="flex items-center gap-5 sm:gap-8">
          <nav aria-label="Main">
            <NavLinks work={work} />
          </nav>
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}
