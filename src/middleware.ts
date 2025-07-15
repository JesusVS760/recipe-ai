import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const sessionToken = request.cookies.get("session")?.value;
  const { pathname } = request.nextUrl;

  const isAuthPage =
    pathname === "/auth/login" ||
    pathname === "/auth/register" ||
    pathname === "/auth/forgot" ||
    pathname === "/auth/verify" ||
    pathname === "/auth/reset";

  const isProtectedPage =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/recipes") ||
    pathname.startsWith("/meal-plan") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/settings");

  // If user has no session and tries to access protected pages
  if (!sessionToken && isProtectedPage) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // If user has session and tries to access auth pages, redirect to dashboard
  if (sessionToken && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Allow access to public pages regardless of auth status
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
