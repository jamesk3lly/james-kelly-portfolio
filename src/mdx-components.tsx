import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import type { ComponentProps } from "react";
import {
  Figure,
  FullImage,
  ImagePair,
  PullQuote,
} from "@/components/mdx/CaseStudyMedia";

/**
 * How Markdown in case studies is styled, plus the custom components
 * available in every MDX file (no import needed).
 * Required by @next/mdx.
 */

// Internal links use Next's <Link> for instant navigation.
function A({ href = "", ...props }: ComponentProps<"a">) {
  if (href.startsWith("/")) {
    return <Link href={href} className="prose-link" {...props} />;
  }
  return <a href={href} className="prose-link" {...props} />;
}

const components: MDXComponents = {
  // "## Context", "## The problem" and so on: the case study sections.
  h2: (props) => (
    <h2
      className="mt-20 mb-6 font-display text-heading first:mt-0 sm:mt-24"
      {...props}
    />
  ),
  h3: (props) => (
    <h3 className="mt-12 mb-4 font-display text-subheading" {...props} />
  ),
  p: (props) => <p className="mt-5 first:mt-0" {...props} />,
  ul: (props) => (
    <ul
      className="mt-5 list-disc space-y-2 pl-5 marker:text-muted"
      {...props}
    />
  ),
  ol: (props) => (
    <ol
      className="mt-5 list-decimal space-y-2 pl-5 marker:text-muted"
      {...props}
    />
  ),
  a: A,
  strong: (props) => <strong className="font-semibold" {...props} />,
  hr: () => <hr className="my-16 border-rule" />,
  // Plain "> quote" Markdown; use <PullQuote> for the big version.
  blockquote: (props) => (
    <blockquote
      className="mt-8 border-l border-text pl-6 text-lede italic"
      {...props}
    />
  ),
  FullImage,
  ImagePair,
  Figure,
  PullQuote,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
