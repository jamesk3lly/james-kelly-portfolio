// About page copy in one place. Anything marked PLACEHOLDER needs real copy.
// Career, education and training are taken from the 2026 CV.

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
  "Placeholder. Today I'm a Product Design Manager at Workday, leading designers across several product areas, and helping shape where AI shows up in the product and how it behaves.",
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

// Career timeline, newest first (from the CV).
export const timeline = [
  {
    years: "2021–now",
    role: "Product Design Manager",
    company: "Workday",
    note: "Leading UX across three product teams (Learning, Help, and Journeys & Onboarding) with seven designers in Europe and San Francisco. Each team has its own AI roadmap, which I support on strategy and leadership.",
  },
  {
    years: "2021",
    role: "Lead Product Designer",
    company: "Diligent",
    note: "Lead designer across two products in the Finance and Org Management spaces, in a UX org of more than 50 people.",
  },
  {
    years: "2020–2021",
    role: "Lead UX Designer",
    company: "eir",
    note: "Led UX, research and usability testing across eir's digital platforms, raised accessibility standards, and used A/B testing to lift transactions and revenue by 14%.",
  },
  {
    years: "2005–2020",
    role: "Design Lead",
    company: "Threesixty",
    note: "Led a team of six designers and developers on web, app and digital product work, from a travel booking system to a data management platform for a multinational.",
  },
];

// Education and training, newest first (from the CV).
export const education = [
  {
    years: "2023–2024",
    title: "Postgraduate Certificate in Leadership & Team Enablement",
    place: "Technological University Dublin",
  },
  {
    years: "2021–2022",
    title: "Postgraduate Certificate in Digital Leadership & Transformation",
    place: "Technological University Dublin",
  },
  {
    years: "2018–2020",
    title: "Higher Diploma in Interaction Design and User Experience",
    place: "Dublin City University",
    note: "Final research project on how digital typography influences emotion and trust.",
  },
  {
    years: "2001–2004",
    title: "Design and Visual Communications",
    place: "Waterford Institute of Technology",
  },
];

export const training = [
  "Leading AI Strategy, Trinity College Dublin",
  "Accessibility for All, Interaction Design Foundation",
  "Google UX Design Certificate",
  "Usability Testing, Interaction Design Foundation",
  "Design Thinking, Interaction Design Foundation",
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
