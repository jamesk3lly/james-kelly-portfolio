import fs from "node:fs";
import path from "node:path";
import type { StaticImageData } from "next/image";
import type { ComponentType } from "react";

/**
 * Projects live in /content/work/<slug>/index.mdx, one folder each, with
 * their images alongside. Each MDX file exports a `meta` object (see the
 * example case study) which drives the home page cards and the case study
 * header. The folder name becomes the URL: /work/<slug>.
 */
export type WorkMeta = {
  /** Outcome headline: what changed, not the project name. */
  title: string;
  /** Short project name, used in next/previous links and page titles. */
  project: string;
  /** e.g. "2024" or "2019–2021". */
  year: string;
  role: string;
  team: string;
  /** One sentence for the card and the top of the case study. */
  summary: string;
  cover: StaticImageData;
  coverAlt: string;
  /** "case-study" = full write-up, "note" = short page. */
  type: "case-study" | "note";
  /** Lower numbers appear first on the home page. */
  order: number;
  /** Drafts are left out of the site entirely. */
  draft?: boolean;
};

export type Work = WorkMeta & { slug: string };

type WorkModule = { default: ComponentType; meta: WorkMeta };

const WORK_DIR = path.join(process.cwd(), "content", "work");

// Folder names are read synchronously so Next can include the result in
// the static build (see "Predictable values" in the caching docs).
function listSlugs(): string[] {
  return fs
    .readdirSync(WORK_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory() && !d.name.startsWith("_"))
    .filter((d) => fs.existsSync(path.join(WORK_DIR, d.name, "index.mdx")))
    .map((d) => d.name);
}

/** Loads one project's MDX module (its content and meta). */
export async function loadWork(slug: string): Promise<WorkModule> {
  return import(`../../content/work/${slug}/index.mdx`);
}

/** All published projects, in home page order. */
export async function getAllWork(): Promise<Work[]> {
  const items = await Promise.all(
    listSlugs().map(async (slug) => ({
      slug,
      ...(await loadWork(slug)).meta,
    })),
  );
  return items.filter((w) => !w.draft).sort((a, b) => a.order - b.order);
}
