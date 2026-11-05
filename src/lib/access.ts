/**
 * Password protection for the case studies.
 *
 * Every /work/<slug> page needs the password (see src/proxy.ts). Entering
 * it on /unlock stores a cookie that unlocks all case studies for
 * ACCESS_DAYS. The cookie holds a hash of the password, not the password,
 * so changing the password locks everyone out again.
 *
 * To change the password, set CASE_STUDY_PASSWORD in Vercel (Settings →
 * Environment Variables) and redeploy. Without it, the default below is
 * used.
 */
export const ACCESS_COOKIE = "case-study-access";
export const ACCESS_DAYS = 30;

const password = () => process.env.CASE_STUDY_PASSWORD || "jameskelly";

async function hash(value: string) {
  const bytes = new TextEncoder().encode(`case-study-access:${value}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (b) =>
    b.toString(16).padStart(2, "0"),
  ).join("");
}

/** The cookie value that proves the password was entered. */
export const accessToken = () => hash(password());

/** Whether a password someone typed is correct. */
export async function isCorrectPassword(attempt: string) {
  return (await hash(attempt.trim())) === (await accessToken());
}

/** Where to go after unlocking: only a case study, else the work list. */
export function safeNext(next: unknown) {
  return typeof next === "string" && /^\/work\/[a-z0-9-]+$/.test(next)
    ? next
    : "/#work";
}
