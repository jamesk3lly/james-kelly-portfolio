import { Container } from "@/components/Container";
import { HeroHeadline } from "@/components/HeroHeadline";
import { LetteringSlot } from "@/components/LetteringSlot";
import { Reveal } from "@/components/Reveal";
import { WorkCard } from "@/components/WorkCard";
import { closing, facts, hero } from "@/content/home";
import { site } from "@/lib/site";
import { getAllWork } from "@/lib/work";

export default async function Home() {
  const work = await getAllWork();

  return (
    <>
      {/* Hero */}
      <Container className="pt-12 pb-20 sm:pt-20 sm:pb-28 lg:pt-28">
        <div className="flex flex-col-reverse gap-10 lg:flex-row lg:items-start lg:justify-between lg:gap-16">
          <div className="max-w-6xl">
            <HeroHeadline text={hero.statement} />
            <p className="hero-fade mt-8 max-w-2xl text-lede text-muted sm:mt-10">
              {hero.supporting}
            </p>
          </div>
          <LetteringSlot />
        </div>

        <dl className="hero-fade mt-16 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-rule pt-8 sm:mt-24 md:grid-cols-4">
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
          <h2 id="work" className="scroll-mt-8 font-display text-heading">
            Selected work
          </h2>

          <ul className="mt-12 grid gap-x-10 gap-y-16 sm:mt-16 md:grid-cols-2 md:gap-y-24 lg:gap-x-16">
            {work.map((item, i) => (
              // Right-hand cards sit lower for an editorial, staggered rhythm.
              <li key={item.slug} className={i % 2 === 1 ? "md:mt-32" : ""}>
                <Reveal delay={(i % 2) * 0.12}>
                  <WorkCard
                    work={item}
                    priority={i === 0}
                    sizes="(min-width: 1344px) 640px, (min-width: 768px) 50vw, 100vw"
                  />
                </Reveal>
              </li>
            ))}
          </ul>
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
              <a href={site.linkedin} className="prose-link">
                LinkedIn
              </a>
            </li>
            <li>
              <a href={site.cv} className="prose-link">
                Download CV <span className="sr-only">(PDF)</span>
              </a>
            </li>
          </ul>
        </Container>
      </section>
    </>
  );
}
