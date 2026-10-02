import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "./app/actions";

export async function proxy(request: NextRequest) {
  const user = await getAuthUser();
  const { pathname, searchParams } = request.nextUrl;
  const searchStr = searchParams.toString();
  const redirectTo = encodeURIComponent(
    pathname + (searchStr ? `?${searchStr}` : ""),
  );

  if (!user) {
    return NextResponse.redirect(
      new URL("/login?redirect=" + redirectTo, request.url),
    );
  }
  if (!user.profile || !user.profile.username) {
    return NextResponse.redirect(
      new URL("/dashboard/welcome?redirect=" + redirectTo, request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
