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
- `src/app/fonts.ts` — the fonts (change the display serif here)
- `src/app/globals.css` — colours for light and dark mode

## Publishing

Every push to `main` on GitHub deploys to Vercel automatically. Other branches get a preview URL.
