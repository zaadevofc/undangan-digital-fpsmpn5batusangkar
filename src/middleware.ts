export { default } from "next-auth/middleware";
import { jwt, verify } from "hono/jwt";
import { getToken } from "next-auth/jwt";
import { getSession } from "next-auth/react";
import { NextRequest, NextResponse } from "next/server";

const secure = ["/invite/*"];

export async function middleware(req: NextRequest) {
  const redirect = (uri: any) => NextResponse.redirect(new URL(uri, req.url));
  const session = await req.cookies.get("fpsmpn5batusangkar-passport.session-token")?.value;
  const pathname = req.nextUrl.pathname;
  const tab = req.nextUrl.searchParams.get('tab')

  const isSecure = secure.some((path) =>
    path.endsWith("*")
      ? pathname.startsWith(path.slice(0, -1))
      : path == pathname
  );

  if (session) {
  } else {
    if (tab) return redirect("/");
    if (isSecure) return redirect("/");
  }
}
