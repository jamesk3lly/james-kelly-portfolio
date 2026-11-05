"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/lib/site";
import { WorkMenu, type WorkMenuItem } from "./WorkMenu";

/**
 * Header navigation. Work opens a dropdown of the case studies (see
 * WorkMenu); About is a plain link. The current section gets a steady
 * accent underline (and aria-current on About, read out by screen
 * readers); other links get the same underline fading in on hover.
 */
export function NavLinks({ work }: { work: WorkMenuItem[] }) {
  const pathname = usePathname();

  return (
    <ul className="flex items-center gap-5 text-[0.9375rem] sm:gap-8">
      {nav.map((item) => {
        // Work is "current" on case studies; the dropdown marks the page.
        if (item.href === "/#work")
          return (
            <WorkMenu
              key={item.href}
              items={work}
              current={pathname.startsWith("/work/")}
            />
          );
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={pathname === item.href ? "page" : undefined}
              className="link-underline underline-offset-[0.35em] hover:text-accent [&[aria-current]]:decoration-accent"
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
