// app/api/departments/route.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:8081";

export async function GET(req: NextRequest) {
  // 1. Grab & decrypt session cookie
  const raw = (await cookies()).get("session")?.value;
  if (!raw) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }
  const session = await decrypt(raw);
  const token = session?.token;
  if (!token) {
    return NextResponse.json(
      { message: "No token in session" },
      { status: 401 },
    );
  }

  // 2. Forward to your Spring Boot
  const res = await fetch(`${BACKEND}/api/departments`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // 3. Bubble up errors
  if (!res.ok) {
    const text = await res.text();
    return NextResponse.json({ message: text }, { status: res.status });
  }

  // 4. Return JSON array of departments
  const departments = await res.json();
  return NextResponse.json(departments);
}
