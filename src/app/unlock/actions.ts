"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
  ACCESS_COOKIE,
  ACCESS_DAYS,
  accessToken,
  isCorrectPassword,
  safeNext,
} from "@/lib/access";

export type UnlockState = { error: boolean };

/** Checks the password; if right, unlocks the case studies and goes on. */
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
  redirect(safeNext(form.get("next")));
}
