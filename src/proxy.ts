import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_COOKIE, accessToken, safeNext } from "@/lib/access";

/**
 * Runs before every case study page. Without the access cookie (see
 * src/lib/access.ts), the visitor is sent to /unlock, which brings them
 * back here once they've entered the password. The password is only
 * needed once: the cookie unlocks every case study.
 *
 * Someone already unlocked who reaches /unlock (the back button, an old
 * link) goes straight on to the case study instead.
 */
export async function proxy(request: NextRequest) {
  const cookie = request.cookies.get(ACCESS_COOKIE)?.value;
  const unlocked = Boolean(cookie) && cookie === (await accessToken());

  if (request.nextUrl.pathname === "/unlock") {
    if (!unlocked) return NextResponse.next();
    const next = safeNext(request.nextUrl.searchParams.get("next"));
    return NextResponse.redirect(new URL(next, request.url));
  }
  if (unlocked) return NextResponse.next();

  const unlock = new URL("/unlock", request.url);
  unlock.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(unlock);
}

export const config = {
  matcher: ["/work/:path*", "/unlock"],
};
