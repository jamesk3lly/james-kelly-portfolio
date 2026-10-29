import type { ReactNode } from "react";

/**
 * Page width and side margins, shared by every section so edges line up.
 * Side padding grows from 20px on phones to 48px on wide screens.
 */
export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mx-auto w-full max-w-[84rem] px-5 sm:px-8 lg:px-12 ${className}`}
    >
      {children}
    </div>
  );
}
