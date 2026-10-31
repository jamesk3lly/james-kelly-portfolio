# James Kelly — portfolio

Personal portfolio built with Next.js (App Router), TypeScript, Tailwind CSS, MDX and Motion. Deployed on Vercel.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

## Useful commands

| Command          | What it does                                  |
| ---------------- | --------------------------------------------- |
| `npm run dev`    | Local preview that updates as you edit        |
| `npm run build`  | Production build (the same thing Vercel runs) |
| `npm run lint`   | Checks the code for common mistakes           |
| `npm run format` | Tidies code formatting                        |

## Where things live

- `content/work/<project>/index.mdx` — one folder per case study, with its images beside it
- `src/app/` — pages (home, case study, about, 404)
- `src/components/` — shared building blocks
- `src/content/home.ts` — home page copy
- `src/content/about/` — About page copy and lettering photos
- `src/lib/site.ts` — name, email, LinkedIn, CV link, site description
- `src/app/fonts.ts` — the fonts (change the display serif here)
- `src/app/globals.css` — colours for light and dark mode (including the accent)
- `src/components/LetteringSlot.tsx` — where your lettering mark goes in the hero

## Adding a case study

Copy `content/work/example-case-study`, rename the folder (it becomes the URL) and follow the notes at the top of its `index.mdx`. Set `draft: true` to hide a project while you work on it.

## Placeholders to replace

- [ ] Hero statement and supporting line (`src/content/home.ts`)
- [ ] Email, LinkedIn URL (`src/lib/site.ts`)
- [ ] CV: replace `public/cv-placeholder.pdf` (or rename and update `src/lib/site.ts`)
- [ ] Projects in `content/work/` (copy, years, images, alt text)
- [ ] About page copy, dates and photos (`src/content/about/`)
- [ ] Irish Type project link (`src/content/about/index.ts`)
- [ ] Lettering mark SVG (`src/components/LetteringSlot.tsx`)
- [ ] Final display serif (`src/app/fonts.ts`), then update `src/lib/og-fonts.ts` so the share image and icons match
- [ ] Optional: replace the "JK" monogram icon (`src/lib/monogram.tsx`)

## Changing the display serif

1. In `src/app/fonts.ts`, swap `Newsreader` for another Google font, loading only the weights you use (each extra weight or style slows the first paint).
2. Install its `@fontsource/<name>` package and point `src/lib/og-fonts.ts` at its `.woff` file, so the share image and icons use it too.

## Known quirks

- Unknown `/work/...` URLs show the 404 page; in development they return status 200, in production 404.
- In development, the share image at `/opengraph-image` can error. The production build generates it correctly.

## Publishing

Every push to `main` on GitHub deploys to Vercel automatically. Other branches get a preview URL.

## Switching jameskelly.ie over (when ready)

1. In Vercel: Project → Settings → Domains, add `jameskelly.ie` and `www.jameskelly.ie`.
2. Vercel shows the DNS records to set. Update them at your domain registrar.
3. Once DNS updates (minutes to a few hours), the new site is live and WordPress stops being served on the domain. Keep the WordPress hosting until you've confirmed everything works.
