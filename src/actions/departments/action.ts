"use server";

import { cookies } from "next/headers";
import { decrypt } from "../../lib/session";
import { User } from "../../lib/definitions";

export async function createDepartmentAction(
  prevState: any[],
  formData: FormData,
): Promise<any[]> {
  // pull values out of the form
  const name = formData.get("name") as string;

  // POST to your SpringBoot users endpoint
  console.log("json body: ", JSON.stringify({ name }));

  const backendUrl = process.env.BACKEND_URL;
  console.log("backendUrl:", backendUrl);
  if (!backendUrl) {
    throw new Error("BACKEND_URL is not defined in environment variables.");
  }

  const raw = (await cookies()).get("session")?.value;
  if (!raw) throw new Error("Not authenticated");
  const session = await decrypt(raw);
  const token = session?.token;
  if (!token) throw new Error("No token in session");

  const res = await fetch(`${backendUrl}/api/departments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });

  console.log("res", res);

  if (!res.ok) {
    const err = await res.text();
    throw new Error("Failed to create user: " + err);
  }

  const newUser = await res.json();
  // merge into your existing list
  return [...prevState, newUser];
}
