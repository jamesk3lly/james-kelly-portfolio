import type { MDXComponents } from "mdx/types";

// Required by @next/mdx. Custom case study components (images, pull
// quotes, captions) are registered here in the case study step.
const components: MDXComponents = {};

export function useMDXComponents(): MDXComponents {
  return components;
}
