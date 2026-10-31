import Link from "next/link";
import { nav, site } from "@/lib/site";
import { Container } from "./Container";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader() {
  return (
    <header>
      <Container className="flex items-center justify-between gap-6 py-5 sm:py-7">
        <Link
          href="/"
          className="font-display text-xl tracking-tight hover:underline hover:decoration-1 hover:underline-offset-4 sm:text-2xl"
        >
          {site.name}
        </Link>

        <div className="flex items-center gap-5 sm:gap-8">
          <nav aria-label="Main">
            <ul className="flex items-center gap-5 text-[0.9375rem] sm:gap-8">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:underline hover:decoration-1 hover:underline-offset-4"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <ThemeToggle />
        </div>
      </Container>
    </header>
  );
}
