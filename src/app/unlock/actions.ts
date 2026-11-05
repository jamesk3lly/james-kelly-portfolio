"use server";

import { cookies } from "next/headers";
import {
  ACCESS_COOKIE,
  ACCESS_DAYS,
  accessToken,
  isCorrectPassword,
  safeNext,
} from "@/lib/access";

// On success, `next` is where to go. The form loads it as a full page, so
// nothing the browser saved while the site was locked is reused.
export type UnlockState = { error: boolean; next?: string };

/** Checks the password; if right, unlocks every case study at once. */
export async function unlock(
  _previous: UnlockState,
  form: FormData,
): Promise<UnlockState> {
  const attempt = String(form.get("password") ?? "");
  if (!(await isCorrectPassword(attempt))) return { error: true };

  (await cookies()).set(ACCESS_COOKIE, await accessToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: ACCESS_DAYS * 24 * 60 * 60,
    path: "/",
  });
  return { error: false, next: safeNext(form.get("next")) };
}
