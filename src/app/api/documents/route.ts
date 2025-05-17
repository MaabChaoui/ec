/**
 * Proxies GET /api/documents from the browser
 * → grabs JWT from the session cookie
 * → forwards the request to Spring Boot /api/document
 * → bubbles status / JSON back to the client
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:8081";

export async function GET(req: NextRequest) {
  /* ---------- 1. auth: pull JWT from session cookie ---------- */
  const raw = (await cookies()).get("session")?.value;
  if (!raw) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  const { token } = (await decrypt(raw)) as { token?: string };
  if (!token) {
    return NextResponse.json(
      { message: "No token in session" },
      { status: 401 },
    );
  }
  console.log(token);
  /* ---------- 2. forward to Spring Boot ---------- */
  const backendRes = await fetch(`${BACKEND}/api/documents`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(`${BACKEND}/api/documents `, backendRes);
  /* ---------- 3. pass response through ---------- */
  //   const data = await backendRes.json().catch(() => ({}));

  const data = await backendRes.json();
  console.log("data: ", data);

  return NextResponse.json(data, { status: backendRes.status });
}
