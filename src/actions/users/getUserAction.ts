// app/actions/users/getUserAction.ts
"use server";

import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { User as UserDTO } from "@/lib/definitions";

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:8081";

export async function getUserAction(email: string): Promise<UserDTO> {
  const raw = (await cookies()).get("session")?.value;
  if (!raw) throw new Error("Not authenticated");
  const { token } = (await decrypt(raw)) as { token?: string };
  if (!token) throw new Error("No token in session");

  const res = await fetch(`${BACKEND}/api/users/${encodeURIComponent(email)}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch user: ${res.status}`);
  }

  return (await res.json()) as UserDTO;
}
