// About page copy in one place. Anything marked PLACEHOLDER needs real copy.
// Facts taken from the brief are filled in; dates are "20XX" until known.

import irishType1 from "./irish-type-1.jpg";
import irishType2 from "./irish-type-2.jpg";
import irishType3 from "./irish-type-3.jpg";

export const intro = {
  // PLACEHOLDER: one line on who you are.
  heading: "I lead design teams through the shift to AI-shaped products.",
};

// PLACEHOLDER: the longer bio. Each string is a paragraph; the first is
// set larger as an introduction.
export const bio = [
  "I've worked in product design for more than twenty years: seventeen as a designer, and the last five leading teams.",
  "Placeholder. Today I'm a UX/Product Design Manager at Workday, leading designers across several product areas, and helping shape where AI shows up in the product and how it behaves.",
  "Placeholder. Before that I built a design system from scratch at eir, and was a key contributor to the design systems at Diligent and Workday. Systems thinking runs through everything I do.",
  "Placeholder. I live in Co. Carlow, Ireland. Outside work I document Irish shopfront lettering.",
];

// PLACEHOLDER: how you work as a design leader. Three or four is plenty.
export const principles = [
  {
    title: "Make the problem smaller",
    text: "Placeholder. A sentence or two on how this shows up in practice, ideally with a concrete example.",
  },
  {
    title: "Give designers room and a clear brief",
    text: "Placeholder. A sentence or two on how this shows up in practice, ideally with a concrete example.",
  },
  {
    title: "Systems before screens",
    text: "Placeholder. A sentence or two on how this shows up in practice, ideally with a concrete example.",
  },
  {
    title: "Decide where AI belongs, then how it behaves",
    text: "Placeholder. A sentence or two on how this shows up in practice, ideally with a concrete example.",
  },
];

// Career timeline, newest first. PLACEHOLDER: dates, titles and notes.
export const timeline = [
  {
    years: "20XX–now",
    role: "UX/Product Design Manager",
    company: "Workday",
    note: "Leading a team of designers across several product areas; shaping where AI is used in the product.",
  },
  {
    years: "20XX–20XX",
    role: "Placeholder role",
    company: "Diligent",
    note: "Key contributor to the design system.",
  },
  {
    years: "20XX–20XX",
    role: "Placeholder role",
    company: "eir",
    note: "Built the design system from scratch.",
  },
  {
    years: "20XX–20XX",
    role: "Placeholder role",
    company: "Placeholder company",
    note: "Placeholder. Earlier roles can be grouped into one line if you prefer.",
  },
];

export const irishType = {
  heading: "Irish Type",
  // PLACEHOLDER
  paragraphs: [
    "Placeholder. A long-running project photographing and documenting Ireland's hand-painted shopfront lettering, much of it disappearing as shops close or modernise.",
    "Placeholder. A sentence on why it matters to you, and how lettering informs your design work.",
  ],
  link: {
    label: "Visit the Irish Type project",
    href: "https://example.com", // PLACEHOLDER
  },
  // PLACEHOLDER images: replace the files, keep the alt text descriptive.
  images: [
    {
      src: irishType1,
      alt: "Placeholder: a green shopfront fascia with hand-painted cream lettering.",
    },
    {
      src: irishType2,
      alt: "Placeholder: an oxblood shopfront fascia with hand-painted lettering.",
    },
    {
      src: irishType3,
      alt: "Placeholder: a navy shopfront fascia with hand-painted lettering.",
    },
  ],
  caption: "Placeholder caption: where and when these were photographed.",
};
