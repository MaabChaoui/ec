import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session"; // same helper you used before

// Your Spring Boot base URL
const BACKEND = process.env.BACKEND_URL ?? "http://localhost:8081";

export async function GET(req: NextRequest) {
  // 1) Grab & decrypt the session cookie
  const c = await cookies();
  const raw = c.get("session")?.value;
  if (!raw) {
    return NextResponse.json({ message: "not authenticated" }, { status: 401 });
  }

  const session = await decrypt(raw); // { token: '…' } or { role, jwt, … }
  const token = session.token;

  // 2) Forward the query params (page, perPage, search, …) to Spring Boot
  const url = new URL("/api/users", BACKEND);
  req.nextUrl.searchParams.forEach((v, k) => url.searchParams.append(k, v));
  // console.log("BACKEND url:", url.href, "\n\n\n", token);

  // 3) Call the backend with Authorization header
  const backendRes = await fetch(url.href, {
    headers: { Authorization: `Bearer ${token}` },
    // forward other headers if you need (Accept-Language, etc.)
  });
  // console.log("/api/users: backendRes:", backendRes);

  if (!backendRes.ok) {
    // bubble up status & text so thunk can pick it up
    const text = await backendRes.text();
    return NextResponse.json({ message: text }, { status: backendRes.status });
  }

  const data = await backendRes.json();
  // console.log("/api/users: data:", data);
  return NextResponse.json(data); // same shape your React expects
}
