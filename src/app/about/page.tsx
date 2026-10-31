import type { Metadata } from "next";
import Image from "next/image";
import type { ReactNode } from "react";
import { Container } from "@/components/Container";
import { ExternalLink } from "@/components/ExternalLink";
import {
  bio,
  education,
  intro,
  irishType,
  principles,
  timeline,
  training,
} from "@/content/about";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `${site.name}: product design leader with 20+ years in the craft, based in ${site.location}.`,
};

/**
 * An editorial row: a small label on the left, content on the right.
 * Stacks on phones. Each section's heading is its label.
 */
function Section({
  id,
  label,
  children,
}: {
  id: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby={id}
      className="grid gap-6 border-t border-rule py-14 sm:py-20 md:grid-cols-12 md:gap-10"
    >
      <h2
        id={id}
        className="text-label text-muted uppercase md:col-span-3 md:pt-2"
      >
        {label}
      </h2>
      <div className="md:col-span-9 lg:col-span-8">{children}</div>
    </section>
  );
}

export default function AboutPage() {
  const [lede, ...rest] = bio;

  return (
    <Container className="pt-12 pb-16 sm:pt-20 lg:pt-24">
      <p className="text-label text-muted uppercase">About</p>
      <h1 className="mt-4 max-w-5xl font-display text-title text-balance">
        {intro.heading}
      </h1>

      <div className="mt-14 sm:mt-20">
        <Section id="bio" label="Bio">
          <p className="font-display text-subheading text-balance">{lede}</p>
          <div className="mt-8 max-w-2xl space-y-5 text-[1.125rem] leading-relaxed">
            {rest.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </Section>

        <Section id="how-i-lead" label="How I lead">
          <ol className="grid gap-x-10 gap-y-10 sm:grid-cols-2">
            {principles.map((p, i) => (
              <li key={p.title}>
                <span
                  aria-hidden="true"
                  className="text-label text-muted tabular-nums"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-2 font-display text-subheading text-balance">
                  {p.title}
                </h3>
                <p className="mt-3 text-muted">{p.text}</p>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="career" label="Career">
          <ol className="divide-y divide-rule border-y border-rule">
            {timeline.map((t) => (
              <li
                key={`${t.company}-${t.years}`}
                className="grid gap-2 py-6 sm:grid-cols-[9rem_1fr] sm:gap-8"
              >
                <p className="text-[0.9375rem] text-muted tabular-nums">
                  {t.years}
                </p>
                <div>
                  <h3 className="font-display text-subheading">{t.company}</h3>
                  <p className="mt-1">{t.role}</p>
                  <p className="mt-2 max-w-xl text-[0.9375rem] text-muted">
                    {t.note}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Section>

        <Section id="education" label="Education">
          <ol className="divide-y divide-rule border-y border-rule">
            {education.map((e) => (
              <li
                key={e.title}
                className="grid gap-2 py-6 sm:grid-cols-[9rem_1fr] sm:gap-8"
              >
                <p className="text-[0.9375rem] text-muted tabular-nums">
                  {e.years}
                </p>
                <div>
                  <h3 className="font-display text-subheading text-balance">
                    {e.title}
                  </h3>
                  <p className="mt-1">{e.place}</p>
                  {e.note && (
                    <p className="mt-2 max-w-xl text-[0.9375rem] text-muted">
                      {e.note}
                    </p>
                  )}
                </div>
              </li>
            ))}
          </ol>

          <h3 className="mt-12 text-label text-muted uppercase">Training</h3>
          <ul className="mt-4 grid gap-x-10 gap-y-2 sm:grid-cols-2">
            {training.map((t) => (
              <li key={t} className="text-[0.9375rem]">
                {t}
              </li>
            ))}
          </ul>
        </Section>

        <Section id="irish-type" label="Lettering">
          <h3 className="font-display text-heading">{irishType.heading}</h3>
          <div className="mt-6 max-w-2xl space-y-5 text-[1.125rem] leading-relaxed">
            {irishType.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <p className="mt-6">
            <ExternalLink href={irishType.link.href} className="prose-link">
              {irishType.link.label}
            </ExternalLink>
          </p>
        </Section>
      </div>

      {/* Lettering photos run full width, below the section text. */}
      <figure className="mt-2">
        <ul className="grid gap-4 sm:grid-cols-3 sm:gap-6">
          {irishType.images.map((img) => (
            <li key={img.src.src}>
              <Image
                src={img.src}
                alt={img.alt}
                placeholder="blur"
                sizes="(min-width: 1344px) 400px, (min-width: 640px) 33vw, 100vw"
                className="media-img aspect-[4/5] w-full rounded-sm bg-surface object-cover"
              />
            </li>
          ))}
        </ul>
        <figcaption className="mt-3 text-sm text-muted">
          {irishType.caption}
        </figcaption>
      </figure>
    </Container>
  );
}
