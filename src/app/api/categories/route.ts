import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:8081";

export async function GET(_req: NextRequest) {
  /* 1. auth */
  const raw = (await cookies()).get("session")?.value;
  if (!raw) return NextResponse.json({ message: "unauth" }, { status: 401 });

  const { token } = (await decrypt(raw)) as { token?: string };
  if (!token)
    return NextResponse.json({ message: "no token" }, { status: 401 });

  /* 2. forward */
  const res = await fetch(`${BACKEND}/api/categories`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json().catch(() => ({}));
  console.log(`${BACKEND}/api/categories data: `, data);

  return NextResponse.json(data, { status: res.status });
}
