import { site } from "@/lib/site";
import { Container } from "./Container";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-rule">
      <Container className="flex flex-col gap-6 py-10 text-[0.9375rem] text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          {site.name} · {site.location}
        </p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          <li>
            <a href={`mailto:${site.email}`} className="hover:text-text">
              Email
            </a>
          </li>
          <li>
            <a href={site.linkedin} className="hover:text-text">
              LinkedIn
            </a>
          </li>
          <li>
            <a href={site.cv} className="hover:text-text">
              CV <span className="sr-only">(PDF)</span>
            </a>
          </li>
        </ul>
      </Container>
    </footer>
  );
}
