// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: any) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/dashboard")) {
    const token = request.cookies.get("auth_token"); // Check if the user has a valid token
    // If no token is found, redirect to login
    if (!token) {
      return Response.redirect(new URL("/login", request.url));
    }
  }
  ///////////////////////////////////////////////////////

  //   const token = request.cookies.get("token");

  //   console.log("token:", token);

  //   const protectedPaths = ["/protected", "/dashboard"];

  //   if (
  //     protectedPaths.some((path) => request.nextUrl.pathname.startsWith(path))
  //   ) {
  //     if (!token) {
  //       return NextResponse.redirect(new URL("/login", request.url));
  //     }
  //   }

  //   return NextResponse.next();
  //
}
