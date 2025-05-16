// middleware.ts
import { NextResponse, NextRequest } from "next/server";
import { decrypt } from "./lib/session";
import { cookies } from "next/headers";

// NextJs official documentation

// 1. Specify protected and public routes
const protectedRoutes = ["/dashboard", "/dashboard/admin", "/dashboard/users"];
const publicRoutes = ["/login", "/signup", "/"];

export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.includes(path);
  const isPublicRoute = publicRoutes.includes(path);

  // 3. Decrypt the session from the cookie
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);
  console.log("session: ", session);

  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !session?.id) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }
  console.log(path);
  console.log(path.includes("admin"));

  if (
    isProtectedRoute &&
    session?.role.toLowerCase() !== "admin" &&
    path.includes("admin")
  ) {
    console.log("middlewaring...");

    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (
    isProtectedRoute &&
    session?.role.toLowerCase() !== "admin" &&
    path.includes("users")
  ) {
    console.log("middlewaring...");

    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 5. Redirect to /dashboard if the user is authenticated
  if (
    isPublicRoute &&
    session?.userId &&
    !req.nextUrl.pathname.startsWith("/dashboard")
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
