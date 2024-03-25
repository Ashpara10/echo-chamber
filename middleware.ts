import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function middleware(req: Request) {
  const url = req.url;
  const user = cookies().get("user")?.value;
  if (!user && url.includes("/home")) {
    return NextResponse.redirect(new URL("/account/login", url));
  }
  if (user && url.includes("/account")) {
    return NextResponse.redirect(new URL("/home", url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: ["/", "/account/:path*", "/home/:path*"],
};
