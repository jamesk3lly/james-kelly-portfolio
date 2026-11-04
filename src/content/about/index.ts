// About page copy in one place. Written from the 2026 CV, the old Workday
// page and the case studies; edit freely in your own voice.
// Career, education and training are taken from the 2026 CV.

import irishType1 from "./irish-type-1.jpg";
import irishType2 from "./irish-type-2.jpg";
import irishType3 from "./irish-type-3.jpg";

export const intro = {
  // One line on who you are.
  heading: "I lead design teams through the shift to AI-shaped products.",
};

// The longer bio. Each string is a paragraph; the first is set larger as an
// introduction.
export const bio = [
  "I've worked in product design for more than twenty years: seventeen as a designer, and the last five leading teams.",
  "Today I'm a Product Design Manager at Workday, leading UX across Learning, Help, and Journeys & Onboarding, with seven product designers in Europe and San Francisco. Each of those teams has its own AI roadmap, and I support them on strategy and leadership: where AI genuinely helps people, and how it should behave when it does.",
  "Before Workday I was a lead designer at Diligent and at eir, and before that I spent fifteen years at Threesixty, leading a team of designers and developers on websites, apps and digital products. Along the way I've built and scaled design systems and SaaS platforms across HR, finance, learning and organisational management.",
  "I lead in a people-first way. I want designers to have the clarity and room to do their best work, and I care as much about measurable outcomes as about craft. I'm based in Ireland, and outside work I'm usually looking at type, especially the hand-painted lettering on Irish shopfronts.",
];

// How you work as a design leader.
export const principles = [
  {
    title: "Make the problem smaller",
    text: "Big problems stall teams, so I break them into pieces small enough to test and learn from early. At eir that meant shipping in small increments and validating each one with A/B testing, which lifted transactions by 14%.",
  },
  {
    title: "Give designers room and a clear brief",
    text: "I'd rather set a clear goal and get out of the way than prescribe the answer. Regular 1:1s, honest feedback and weekly critiques keep the bar high, and a psychologically safe team takes the creative risks that make the work better.",
  },
  {
    title: "Systems before screens",
    text: "Consistent products come from shared foundations, not one-off screens. On eir.ie, a simple type scale, palette and set of card components stopped every new promotion looking different from the last.",
  },
  {
    title: "Decide where AI belongs, then how it behaves",
    text: "AI should earn its place in a product. With each team's AI roadmap, we start with where it genuinely helps people, then design how it behaves, so it supports the people using it rather than getting in their way.",
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
  // Hidden until the copy, link and photos are ready: set to true to show
  // the Lettering section on the About page.
  show: false,
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
