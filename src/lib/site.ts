// Site-wide details in one place. Replace the placeholders with real values.
export const site = {
  name: "James Kelly",
  role: "Product design leader",
  url: "https://jameskelly.ie",
  email: "hello@jameskelly.ie",
  linkedin: "https://www.linkedin.com/in/james-kelly-ux/",
  // To update the CV, replace public/james-kelly-cv.pdf (same filename).
  cv: "/james-kelly-cv.pdf",
  location: "Co. Carlow, Ireland",
  // Default description for search results and link previews.
  description:
    "James Kelly is a product design leader with 20+ years in the craft, leading design teams and shaping how AI shows up in products. Based in Co. Carlow, Ireland.",
} as const;

export const nav = [
  { href: "/#work", label: "Work" },
  { href: "/about", label: "About" },
] as const;
