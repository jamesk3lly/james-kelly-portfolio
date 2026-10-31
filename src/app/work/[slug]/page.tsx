import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Container } from "@/components/Container";
import { getAdjacentWork, getAllWork, loadWork, type Work } from "@/lib/work";

const typeLabel = { "case-study": "Case study", note: "Note" } as const;

// Build every published project as a static page.
export async function generateStaticParams() {
  const work = await getAllWork();
  return work.map((w) => ({ slug: w.slug }));
}

async function getPublished(slug: string) {
  const mod = await loadWork(slug);
  // Unknown folders and drafts show the 404 page. (Cache Components doesn't
  // allow `dynamicParams = false`, so this check does that job.) Production
  // returns a 404 status; the dev server may report 200.
  if (!mod || mod.meta.draft) notFound();
  return mod;
}

export async function generateMetadata(
  props: PageProps<"/work/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const { meta } = await getPublished(slug);
  return {
    title: meta.project,
    description: meta.summary,
    // Replaces the site-wide openGraph defaults, so they're repeated here.
    openGraph: {
      type: "article",
      siteName: "James Kelly",
      locale: "en_IE",
      title: meta.title,
      description: meta.summary,
      images: [{ url: meta.cover.src, alt: meta.coverAlt }],
    },
  };
}

export default function CaseStudyPage(props: PageProps<"/work/[slug]">) {
  // Reading the URL happens inside <Suspense>, so navigation can show the
  // site header instantly while the (pre-built) case study streams in.
  // The empty fallback holds the space so the footer doesn't jump.
  return (
    <Suspense fallback={<div className="min-h-dvh" />}>
      <CaseStudy params={props.params} />
    </Suspense>
  );
}

async function CaseStudy({
  params,
}: {
  params: PageProps<"/work/[slug]">["params"];
}) {
  const { slug } = await params;
  const { default: Content, meta } = await getPublished(slug);
  const { current, previous, next } = await getAdjacentWork(slug);

  const details = [
    { label: "Role", value: meta.role },
    { label: "Team", value: meta.team },
    { label: "Year", value: meta.year },
  ];

  return (
    <article>
      {/* Header */}
      <Container className="pt-12 sm:pt-20 lg:pt-24">
        <p className="flex flex-wrap gap-x-3 gap-y-1 text-label whitespace-nowrap text-muted uppercase">
          {current && (
            <>
              <span>No. {current.number}</span>
              <span aria-hidden="true">·</span>
            </>
          )}
          <span>{meta.project}</span>
          <span aria-hidden="true">·</span>
          <span>{typeLabel[meta.type]}</span>
        </p>
        <h1 className="mt-4 max-w-5xl font-display text-title text-balance">
          {meta.title}
        </h1>

        {/* The call: optional. The one decision that shaped the project,
            shown before the context. Remove `decision` from a project's
            meta to leave it out. */}
        {meta.decision && (
          <section
            aria-label="The call"
            className="mt-12 grid gap-3 border-l-2 border-accent pl-6 sm:mt-16 md:grid-cols-12 md:gap-10 md:border-l-0 md:pl-0"
          >
            <h2 className="text-label text-accent uppercase md:col-span-2 md:pt-2">
              The call
            </h2>
            <p className="font-display text-heading text-balance md:col-span-10 lg:col-span-9">
              {meta.decision}
            </p>
          </section>
        )}

        {/* Summary block */}
        <div className="mt-12 grid gap-10 border-t border-rule pt-8 sm:mt-16 md:grid-cols-12">
          <p className="text-lede md:col-span-7">{meta.summary}</p>
          <dl className="grid grid-cols-3 gap-6 md:col-span-4 md:col-start-9 md:grid-cols-1 md:gap-5">
            {details.map((d) => (
              <div key={d.label}>
                <dt className="text-label text-muted uppercase">{d.label}</dt>
                <dd className="mt-1 text-[0.9375rem] leading-snug">
                  {d.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>

      {/* Cover */}
      <Container className="mt-14 sm:mt-20">
        <div className="overflow-hidden rounded-sm bg-surface">
          <Image
            src={meta.cover}
            alt={meta.coverAlt}
            placeholder="blur"
            preload
            sizes="(min-width: 1344px) 1248px, 100vw"
            className="media-img w-full"
          />
        </div>
      </Container>

      {/* Body: written in MDX, styled by src/mdx-components.tsx */}
      <Container className="case-body py-16 sm:py-24">
        <Content />
      </Container>

      {previous && next && <MoreWork previous={previous} next={next} />}
    </article>
  );
}

function MoreWork({ previous, next }: { previous: Work; next: Work }) {
  const links = [
    { work: previous, label: "Previous", align: "" },
    { work: next, label: "Next", align: "sm:text-right" },
  ];
  return (
    <nav aria-label="More work" className="border-t border-rule">
      <Container className="grid gap-px sm:grid-cols-2">
        {links.map(({ work, label, align }) => (
          <Link
            key={label}
            href={`/work/${work.slug}`}
            className={`group py-10 sm:py-14 ${align}`}
          >
            <span className="text-label text-muted uppercase">
              {label === "Previous" && <span aria-hidden="true">← </span>}
              {label}
              {label === "Next" && <span aria-hidden="true"> →</span>}
            </span>
            <span className="mt-3 block font-display text-subheading text-balance decoration-accent decoration-1 underline-offset-[0.18em] group-hover:underline">
              {work.title}
            </span>
          </Link>
        ))}
      </Container>
    </nav>
  );
}
