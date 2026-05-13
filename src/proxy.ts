import { NextResponse, type NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const lowerPathname = pathname.toLowerCase();

  if (pathname !== lowerPathname) {
    const url = request.nextUrl.clone();
    url.pathname = lowerPathname;
    return NextResponse.redirect(url, 308);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api/|_next/|.*\\..*).*)"],
};
