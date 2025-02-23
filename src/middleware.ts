import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    cookieName: "authjs.session-token",
  });

  const pathname = req.nextUrl.pathname;

  if (token && pathname !== "/dashboard") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (
    !token &&
    pathname !== "/" &&
    pathname !== "/sign-in" &&
    pathname !== "/sign-up" &&
    pathname !== "/forgot-password" &&
    pathname !== "/verify-forgot-password" &&
    pathname !== "/verify"
  ) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
