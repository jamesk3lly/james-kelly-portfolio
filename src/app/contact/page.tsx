import type { Metadata } from "next";
import Image from "next/image";
import { Container } from "@/components/Container";
import { closing } from "@/content/home";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${site.name}: email, LinkedIn and CV.`,
};

// The last part of a profile link, e.g. "james-kelly-ux".
const handle = (url: string) => url.replace(/\/+$/, "").split("/").pop() ?? url;

/**
 * Contact: email first (large), then every other way to reach James. Profiles
 * left empty in src/lib/site.ts (twitter, instagram) are hidden, and so is
 * the photo until `photo` is set there.
 */
export default function ContactPage() {
  const channels = [
    { label: "LinkedIn", value: handle(site.linkedin), href: site.linkedin },
    {
      label: "X (Twitter)",
      value: `@${handle(site.twitter)}`,
      href: site.twitter,
    },
    {
      label: "X (Irish Type)",
      value: `@${handle(site.twitterIrishType)}`,
      href: site.twitterIrishType,
    },
    {
      label: "Instagram",
      value: `@${handle(site.instagram)}`,
      href: site.instagram,
    },
    { label: "CV", value: "Download (PDF)", href: site.cv },
  ].filter((c) => c.href);

  return (
    <Container className="pt-12 pb-24 sm:pt-20 sm:pb-32 lg:pt-24">
      <div
        className={`grid gap-12 ${site.photo ? "md:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] md:gap-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-24" : ""}`}
      >
        <div>
          <p className="text-label text-muted uppercase">Contact</p>
          <h1 className="mt-4 max-w-4xl font-display text-title text-balance">
            {closing.heading}
          </h1>
          <p className="mt-6 max-w-2xl text-lede text-muted">{closing.text}</p>
          <p className="mt-10">
            <a
              href={`mailto:${site.email}`}
              className="prose-link font-display text-heading break-all"
            >
              {site.email}
            </a>
          </p>

          <ul className="mt-14 max-w-2xl divide-y divide-rule border-y border-rule sm:mt-20">
            {/* Each opens in a new tab. */}
            {channels.map((c) => (
              <li key={c.label}>
                <a
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid grid-cols-[7rem_minmax(0,1fr)_auto] items-baseline gap-4 py-5 sm:grid-cols-[10rem_minmax(0,1fr)_auto]"
                >
                  <span className="text-label text-muted uppercase">
                    {c.label}
                  </span>
                  <span className="link-underline truncate">{c.value}</span>
                  <span
                    aria-hidden="true"
                    className="text-muted transition-[color,translate] group-hover:translate-x-0.5 group-hover:text-accent"
                  >
                    ↗
                  </span>
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        {site.photo && (
          <div className="relative aspect-[4/5] w-full max-w-sm overflow-hidden rounded-[20px] bg-surface md:max-w-none md:self-start">
            <Image
              src={site.photo}
              alt={site.photoAlt}
              fill
              priority
              sizes="(min-width: 1024px) 26rem, (min-width: 768px) 22rem, 24rem"
              className="object-cover"
            />
          </div>
        )}
      </div>
    </Container>
  );
}
