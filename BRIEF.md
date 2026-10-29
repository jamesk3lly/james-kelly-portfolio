# Portfolio site brief — James Kelly

Read this whole brief before writing any code. Ask me questions if anything is unclear, then propose a plan before building.

## Goal

A personal portfolio that gets me interviews for senior/principal product design roles and design leadership roles with an AI focus. It should read as a confident pitch, not an archive. It will replace my current WordPress site at jameskelly.ie, which must stay live and untouched until I switch the domain over.

## Who I am (for tone and copy)

- Product design leader with 20+ years in product design: 17 as an IC, the last 5 as a design manager.
- Currently UX/Product Design Manager at Workday, leading a team of designers across several product areas.
- Built a design system from scratch at eir; key contributor to design systems at Diligent and Workday.
- Helped shape where AI is used in Workday's products.
- Long-running practice in Irish typography and lettering (Irish Type project documenting shopfront lettering).
- Based in Co. Carlow, Ireland.

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- Case studies as MDX files in `/content/work/`, one folder per project with its images alongside
- Motion (motion.dev, formerly Framer Motion) for a small number of deliberate animations only
- Optimised images via `next/image`
- Deployed on Vercel from a GitHub repo
- No CMS, no database, no analytics for now

## Pages

1. **Home**
   - Hero: one strong positioning statement (placeholder until I write it), short supporting line, and a compact facts row (Currently / Previously / Experience / Based).
   - Selected work: 5–7 projects as large cards. Each card has the year, a one-line **outcome headline** (what changed, not the project name), a one-sentence summary, a cover image, and a label: "Case study" (links to a full page) or "Note" (short, no page or a brief one).
   - Short closing call to action with my email.
2. **Case study page** (template driven by MDX)
   - Title (outcome headline), year, role, team, and a summary block at the top.
   - Sections: Context, The problem, What I did, Outcome. Support full-width images, side-by-side images, captions, and pull quotes.
   - Next/previous project links at the bottom.
3. **About**
   - Longer bio, how I work as a design leader, a career timeline, and a section on the Irish typography practice with a few images.
4. **404 page** in the same style.

## Visual direction

- Editorial and typographic. Large, confident type does the work; lots of whitespace; restrained colour (near-black on warm off-white, one accent colour).
- Typography is the signature. I'm a lettering person, so the hero and section headings should use a distinctive display face paired with a clean, highly readable text face. Propose 2–3 font pairings (Google Fonts or other free licences) before choosing.
- Leave a slot in the hero for a custom lettering mark or SVG I'll supply later.
- Animation: subtle fade/rise on scroll for cards, and one signature motion moment in the hero. Respect `prefers-reduced-motion`.
- Fully responsive; mobile is as considered as desktop.
- Light and dark modes, with colours defined as CSS variables for each. Design both properly, not just inverted: the dark mode should feel as considered as the light one.
- A light/dark toggle sits in the top right of the site header on every page.
  - On first visit, follow the visitor's system preference.
  - Remember the visitor's choice across pages and visits.
  - No flash of the wrong theme on page load.
  - Accessible: a real button with a clear label, keyboard operable, and the icon or label reflects the current mode.
  - The theme change itself can have a subtle transition, but respect `prefers-reduced-motion`.

## Quality bar

- Accessible: semantic HTML, skip link, visible focus states, alt text on every image, WCAG AA contrast.
- Fast: Lighthouse 95+ on performance and accessibility.
- Proper metadata: page titles, descriptions, Open Graph image, favicon.
- Clean, readable code I can maintain myself. Comment anything non-obvious.

## Content

Use clearly marked placeholder content for now. Create one complete example case study in MDX with every supported component so I can copy it for real projects. I'll write the real copy myself.

## Working style

- Build in small steps and show me each one: scaffold → layout and type → home page → case study template → about → polish.
- Commit after each step with a clear message.
- Tell me exactly what I need to do myself (GitHub, Vercel, domain) and when.
