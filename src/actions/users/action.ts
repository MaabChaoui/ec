"use server";

import { cookies } from "next/headers";
import { decrypt } from "../../lib/session";
import { User } from "../../lib/definitions";

export async function createUserAction(
  prevState: any[],
  formData: FormData,
): Promise<any[]> {
  // pull values out of the form
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const departmentIds = [1]; // TODO

  // POST to your SpringBoot users endpoint
  console.log(
    "json body: ",
    JSON.stringify({ name, email, password, departmentIds }),
  );

  const backendUrl = process.env.BACKEND_URL;
  console.log("backendUrl:", backendUrl);
  if (!backendUrl) {
    throw new Error("BACKEND_URL is not defined in environment variables.");
  }

  //   const res = await fetch(`${process.env.BACKEND_URL}/auth/signup`, {
  const res = await fetch(`${backendUrl}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password, departmentIds, name }),
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

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:8081";

export async function updateUserAction(
  prevUsers: User[],
  formData: FormData,
): Promise<User[]> {
  // 1) Pull data out of FormData
  const id = formData.get("id")?.toString();
  const name = formData.get("name")?.toString();
  const email = formData.get("email")?.toString();
  const status = formData.get("status")?.toString();
  const role = formData.get("role")?.toString();
  const password = formData.get("password")?.toString();

  if (!id) throw new Error("Missing user ID");

  // 2) Grab your JWT from the cookie
  const raw = (await cookies()).get("session")?.value;
  if (!raw) throw new Error("Not authenticated");
  const session = await decrypt(raw);
  const token = session?.token;
  if (!token) throw new Error("No token in session");

  // 3) Build the JSON body—only send fields that exist
  const body: any = {};
  if (name) body.name = name;
  if (email) body.email = email;
  if (status) body.status = status;
  if (role) body.role = role;
  if (password) body.password = password;

  console.log("PUT body:", body);
  // 4) Call your backend
  console.log("Making PUT request to backend...");
  const res = await fetch(`${BACKEND}/api/users/${encodeURIComponent(id)}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to update user: ${res.status} ${text}`);
  }
  console.log("YES BABYY");
  const updatedUser: User = await res.json();

  // 5) Replace the user in your list
  return prevUsers.map((u) => (u.id === updatedUser.id ? updatedUser : u));
}
