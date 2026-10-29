// First thing keyboard users reach: jumps past the header to the content.
// Hidden until focused.
export function SkipLink() {
  return (
    <a
      href="#main"
      className="fixed top-3 left-3 z-50 -translate-y-24 rounded bg-text px-4 py-2 text-bg focus:translate-y-0"
    >
      Skip to content
    </a>
  );
}
