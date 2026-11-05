"use client";

import { useSearchParams } from "next/navigation";
import { useActionState, useEffect } from "react";
import { unlock, type UnlockState } from "./actions";

/** The password field. A wrong password shows a message under it. */
export function UnlockForm() {
  const next = useSearchParams().get("next") ?? "";
  const [state, action, pending] = useActionState<UnlockState, FormData>(
    unlock,
    { error: false },
  );

  // Unlocked: load the case study as a fresh page. A soft navigation could
  // reuse links the home page loaded in the background while the site was
  // locked, which would show this page again. `replace` keeps the
  // password page out of the back button's history.
  useEffect(() => {
    if (state.next) window.location.replace(state.next);
  }, [state.next]);

  return (
    <form action={action} className="mt-10 max-w-md">
      <input type="hidden" name="next" value={next} />
      <label htmlFor="password" className="text-label text-muted uppercase">
        Password
      </label>
      <div className="mt-3 flex gap-3">
        <input
          id="password"
          name="password"
          type="password"
          required
          autoFocus
          autoComplete="current-password"
          aria-invalid={state.error || undefined}
          aria-describedby={state.error ? "password-error" : undefined}
          className="min-w-0 flex-1 rounded-full border border-rule bg-surface px-5 py-3 text-text transition-colors focus:border-accent aria-[invalid]:border-accent"
        />
        <button
          type="submit"
          disabled={pending || Boolean(state.next)}
          className="rounded-full bg-text px-6 py-3 font-normal text-bg transition-colors hover:bg-accent disabled:opacity-60"
        >
          {state.next ? "Opening…" : pending ? "Checking…" : "Unlock"}
        </button>
      </div>
      <p
        id="password-error"
        aria-live="polite"
        className="mt-3 min-h-[1.65em] text-accent"
      >
        {state.error ? "That password isn’t right. Please try again." : ""}
      </p>
    </form>
  );
}
