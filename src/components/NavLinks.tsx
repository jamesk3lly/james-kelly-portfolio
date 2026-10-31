"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/lib/site";

/**
 * Header navigation. Marks the current section with aria-current (read
 * out by screen readers) and a quiet accent underline.
 */
export function NavLinks() {
  const pathname = usePathname();

  return (
    <ul className="flex items-center gap-5 text-[0.9375rem] sm:gap-8">
      {nav.map((item) => {
        // About is the current page on /about ("page"). Work links to a
        // section of the home page, so on case studies it's marked as the
        // current section ("true") rather than the current page.
        const current =
          item.href === "/about"
            ? pathname === "/about" && "page"
            : pathname.startsWith("/work/") && "true";
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={current || undefined}
              className="decoration-accent decoration-1 underline-offset-[0.35em] transition-colors hover:text-accent [&[aria-current]]:underline"
            >
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
