import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/verify/:path*", "/dashboard/:path*", "/", "/sign-up", "/sign-in"],
};
