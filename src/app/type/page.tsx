// TEMPORARY review page for type and accent colour. Deleted in the polish step.
import type { Metadata } from "next";
import { Container } from "@/components/Container";

export const metadata: Metadata = {
  title: "Type specimen",
  robots: { index: false },
};

const scale = [
  {
    name: "Display",
    cls: "font-display text-display",
    sample: "Design leadership for products that think.",
  },
  {
    name: "Title",
    cls: "font-display text-title",
    sample: "Cut onboarding time in half for 40,000 users",
  },
  { name: "Heading", cls: "font-display text-heading", sample: "The problem" },
  {
    name: "Subheading",
    cls: "font-display text-subheading",
    sample: "Rebuilt the design system at eir",
  },
  {
    name: "Lede",
    cls: "text-lede",
    sample:
      "Twenty years in product design, the last five leading teams. I help organisations decide where AI belongs in the product.",
  },
  {
    name: "Body",
    cls: "",
    sample:
      "The team had shipped three AI features in a year, each with its own pattern for confidence, correction and consent. Customers couldn't predict what the product would do, so they stopped trusting it. We started by mapping every place a model made a decision on someone's behalf.",
  },
  { name: "Label", cls: "text-label uppercase", sample: "2024 · Case study" },
];

// Kept in sync with globals.css by hand; this page is temporary.
const paper = { light: "#f5f1e8", dark: "#151311" };
const accents = [
  { id: "red", name: "Signwriter red", light: "#b23a1e", dark: "#f08466" },
  { id: "green", name: "Bottle green", light: "#1f5c40", dark: "#7cc39e" },
  { id: "blue", name: "Ink blue", light: "#24438f", dark: "#94b0ee" },
] as const;

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return ((hi + 0.05) / (lo + 0.05)).toFixed(1);
}

export default function TypeSpecimen() {
  return (
    <Container className="py-16 sm:py-24">
      <p className="text-label text-muted uppercase">Temporary review page</p>
      <h1 className="mt-3 font-display text-title">Type and colour</h1>
      <p className="mt-4 max-w-2xl text-lede text-muted">
        Inter for text, Newsreader as a stand-in display serif. Use the toggle
        in the header to see the scale in both themes.
      </p>

      <section aria-labelledby="scale" className="mt-20">
        <h2 id="scale" className="text-label text-muted uppercase">
          Type scale
        </h2>
        <dl className="mt-6 divide-y divide-rule border-y border-rule">
          {scale.map((s) => (
            <div
              key={s.name}
              className="grid gap-3 py-8 md:grid-cols-[10rem_1fr]"
            >
              <dt className="text-label text-muted uppercase">{s.name}</dt>
              <dd className={`max-w-4xl ${s.cls}`}>{s.sample}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="accents" className="mt-24">
        <h2 id="accents" className="text-label text-muted uppercase">
          Accent options, light and dark
        </h2>
        <div className="mt-6 grid gap-6">
          {accents.map((a) => (
            <div key={a.id} className="grid gap-6 md:grid-cols-2">
              {(["light", "dark"] as const).map((mode) => (
                <div
                  key={mode}
                  data-theme={mode}
                  data-accent={a.id}
                  className="rounded-sm border border-rule bg-bg p-7 text-text sm:p-9"
                >
                  <p className="text-label text-accent uppercase">
                    2024 · Case study
                  </p>
                  <p className="mt-3 font-display text-subheading">
                    {a.name}: shaped where AI shows up in{" "}
                    <em className="text-accent">Workday</em>
                  </p>
                  <p className="mt-3 text-muted">
                    Supporting text with a{" "}
                    <a href="#accents" className="prose-link text-text">
                      link in running text
                    </a>
                    .
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-4 text-sm">
                    <span className="rounded-sm px-2 py-1 outline-2 outline-offset-3 outline-accent outline-solid">
                      Focus ring
                    </span>
                    <span className="text-muted">
                      {mode === "light" ? "Light" : "Dark"} · contrast{" "}
                      {contrast(a[mode], paper[mode])}:1
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>
    </Container>
  );
}
