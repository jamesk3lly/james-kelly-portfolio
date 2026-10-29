/**
 * Sets the theme on <html> before the page is painted, so there's never a
 * flash of the wrong theme. It runs while the browser is still reading the
 * HTML, before React loads.
 *
 * Order of preference: the visitor's saved choice, then their system
 * setting. The toggle (ThemeToggle.tsx) saves choices under the same key.
 */
export const THEME_STORAGE_KEY = "theme";

const script = `(function(){try{var t=localStorage.getItem("${THEME_STORAGE_KEY}");if(t!=="light"&&t!=="dark"){t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;

export function ThemeScript() {
  return (
    <script
      // React warns about rendering <script> on the client. Marking it as
      // plain text there (it has already run) silences that; the server
      // copy stays executable. Pattern from the Next.js docs.
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: script }}
    />
  );
}
