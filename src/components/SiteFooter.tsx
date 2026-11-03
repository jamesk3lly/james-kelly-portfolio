import { site } from "@/lib/site";
import { Container } from "./Container";
import { ExternalLink } from "./ExternalLink";
import { LocalTime } from "./LocalTime";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-rule">
      <Container className="flex flex-col gap-6 py-10 text-[0.9375rem] text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          {site.name} · {site.location}
          <LocalTime />
        </p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          <li>
            <a
              href={`mailto:${site.email}`}
              className="link-underline underline-offset-4 hover:text-accent"
            >
              Email
            </a>
          </li>
          <li>
            <ExternalLink
              href={site.linkedin}
              className="link-underline underline-offset-4 hover:text-accent"
            >
              LinkedIn
            </ExternalLink>
          </li>
          <li>
            <ExternalLink
              href={site.cv}
              className="link-underline underline-offset-4 hover:text-accent"
            >
              CV<span className="sr-only"> (PDF)</span>
            </ExternalLink>
          </li>
        </ul>
      </Container>
    </footer>
  );
}
