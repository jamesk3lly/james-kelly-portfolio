import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_COOKIE, accessToken } from "@/lib/access";

/**
 * Runs before every case study page. Without the access cookie (see
 * src/lib/access.ts), the visitor is sent to /unlock, which brings them
 * back here once they've entered the password.
 */
export async function proxy(request: NextRequest) {
  const cookie = request.cookies.get(ACCESS_COOKIE)?.value;
  if (cookie && cookie === (await accessToken())) return NextResponse.next();

  const unlock = new URL("/unlock", request.url);
  unlock.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(unlock);
}

export const config = {
  matcher: "/work/:path*",
};
