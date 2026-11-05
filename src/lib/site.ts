// Site-wide details in one place. Replace the placeholders with real values.
export const site = {
  name: "James Kelly",
  role: "Product design leader",
  url: "https://jameskelly.ie",
  email: "hello@jameskelly.ie",
  linkedin: "https://www.linkedin.com/in/james-kelly-ux/",
  // Full profile links. Leave one empty ("") to hide it from the contact
  // page, e.g. twitter: "https://x.com/yourhandle".
  twitter: "https://x.com/jameskeIIy",
  // The Irish Typography project account on X.
  twitterIrishType: "https://x.com/irishtypography",
  instagram: "https://instagram.com/irishtype",
  // Contact page photo: put the file in /public and give its path, e.g.
  // "/james-kelly.jpg". Shown as a 4:5 portrait. Empty hides it.
  photo: "",
  photoAlt: "James Kelly",
  // To update the CV, replace public/james-kelly-cv.pdf (same filename).
  cv: "/james-kelly-cv.pdf",
  location: "Ireland",
  // Default description for search results and link previews.
  description:
    "James Kelly is a product design leader with 20+ years in the craft, leading design teams and shaping how AI shows up in products. Based in Ireland.",
} as const;

export const nav = [
  { href: "/#work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const;
