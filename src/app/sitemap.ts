import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { getAllWork } from "@/lib/work";

// Lists every page for search engines, including each case study.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const work = await getAllWork();
  return [
    { url: site.url, priority: 1 },
    { url: `${site.url}/about`, priority: 0.8 },
    ...work.map((w) => ({ url: `${site.url}/work/${w.slug}`, priority: 0.7 })),
  ];
}
