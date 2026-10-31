"use client";

import { useLayoutEffect } from "react";

/**
 * The hero's signature motion: each line of the headline rises out of a
 * mask, one line after another.
 *
 * How it works: every word sits in its own clipping mask and animates with
 * CSS (see .hero-word in globals.css). Words on the same line share a
 * delay, so the effect reads line by line. Which words share a line depends
 * on screen width, so it's measured in the browser:
 *  - on first load, by an inline script that runs before the first paint
 *    (so the animation doesn't wait for JavaScript to download);
 *  - on later in-app visits, by the layout effect below.
 * Visitors who prefer reduced motion see the headline immediately.
 */

const ID = "hero-headline";

// Groups words by vertical position and stores the line number as --line.
// Must stay self-contained: it's also turned into a string for the inline
// script, so it can't use anything from outside its own body.
function assignLines(id: string) {
  const heading = document.getElementById(id);
  if (!heading) return;
  const tops: number[] = [];
  heading.querySelectorAll<HTMLElement>(".hero-word").forEach((word) => {
    const top = (word.parentElement as HTMLElement).offsetTop;
    let line = tops.indexOf(top);
    if (line < 0) line = tops.push(top) - 1;
    word.style.setProperty("--line", String(line));
  });
}

const inlineScript = `(${assignLines.toString()})(${JSON.stringify(ID)})`;

export function HeroHeadline({ text }: { text: string }) {
  // For client-side navigation, where the inline script doesn't run.
  useLayoutEffect(() => assignLines(ID), []);

  const words = text.split(" ");

  return (
    <>
      <h1 id={ID} className="font-display text-display text-balance">
        {words.map((word, i) => (
          <span key={i}>
            <span className="hero-mask">
              {/* The inline script adds a --line style before hydration. */}
              <span className="hero-word" suppressHydrationWarning>
                {word}
              </span>
            </span>
            {i < words.length - 1 ? " " : null}
          </span>
        ))}
      </h1>
      <script
        // Marked as plain text on the client so React doesn't warn; the
        // server copy runs. Same pattern as ThemeScript.
        type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: inlineScript }}
      />
    </>
  );
}
