import { Container } from "@/components/Container";
import { ExternalLink } from "@/components/ExternalLink";
import { HeroHeadline } from "@/components/HeroHeadline";
import { WorkIndex } from "@/components/WorkIndex";
import { closing, facts, hero } from "@/content/home";
import { site } from "@/lib/site";
import { getAllWork } from "@/lib/work";

export default async function Home() {
  const work = await getAllWork();

  return (
    <>
      {/* Hero */}
      <Container className="relative pt-12 pb-16 sm:pt-20 sm:pb-20 lg:pt-24">
        {/* Hero artwork: turned off for now (too distracting). To bring the
            generative line art back, import HeroPattern from
            "@/components/HeroPattern" and add:
            <HeroPattern className="hero-fade pointer-events-none absolute top-0 right-0 h-[22rem] w-full opacity-60 sm:h-[30rem] sm:opacity-100 md:w-[70%] lg:h-[36rem] lg:w-[58%]" /> */}

        <div className="relative">
          <div className="max-w-6xl">
            <HeroHeadline text={hero.statement} />
            <p className="hero-fade mt-6 max-w-2xl text-lede text-muted sm:mt-7">
              {hero.supporting}
            </p>
          </div>
        </div>

        <dl className="hero-fade relative mt-10 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-rule pt-8 sm:mt-14 sm:grid-cols-3">
          {facts.map((fact) => (
            <div key={fact.label}>
              <dt className="text-label text-muted uppercase">{fact.label}</dt>
              <dd className="mt-2 text-[0.9375rem] leading-snug">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </Container>

      {/* Selected work */}
      <section aria-labelledby="work" className="pb-24 sm:pb-32">
        <Container>
          <h2
            id="work"
            className="flex scroll-mt-8 items-center gap-[0.35em] font-display text-heading"
          >
            Selected work
            {/* A quiet pointer to the list below, like the Work menu's. */}
            <svg
              aria-hidden="true"
              viewBox="0 0 12 12"
              className="size-[0.42em] translate-y-[0.08em] text-muted"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M2.5 4.5 6 8l3.5-3.5" />
            </svg>
          </h2>

          <div className="mt-10 sm:mt-14">
            <WorkIndex work={work} />
          </div>
        </Container>
      </section>

      {/* Closing call to action */}
      <section
        aria-labelledby="contact"
        className="border-t border-rule py-24 sm:py-32"
      >
        <Container>
          <h2
            id="contact"
            className="max-w-4xl font-display text-title text-balance"
          >
            {closing.heading}
          </h2>
          <p className="mt-6 max-w-2xl text-lede text-muted">{closing.text}</p>
          <p className="mt-10">
            <a
              href={`mailto:${site.email}`}
              className="prose-link font-display text-heading break-all"
            >
              {site.email}
            </a>
          </p>
          <ul className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
            <li>
              <ExternalLink href={site.linkedin} className="prose-link">
                LinkedIn
              </ExternalLink>
            </li>
            <li>
              <ExternalLink href={site.cv} className="prose-link">
                View CV<span className="sr-only"> (PDF)</span>
              </ExternalLink>
            </li>
          </ul>
        </Container>
      </section>
    </>
  );
}
