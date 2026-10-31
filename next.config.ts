import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
};

// Case studies live in /content/work/<slug>/index.mdx and are imported
// by the case study route, so .mdx doesn't need to be a page extension.
const withMDX = createMDX({});

export default withMDX(nextConfig);
