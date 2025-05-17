// app/actions/users/action.ts
"use server";

import { cookies } from "next/headers";
import { decrypt } from "../../lib/session";
import { User } from "../../lib/definitions";

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:8081";

/* ------------------------------------------------------------------ */
/*  CREATE  */
/* ------------------------------------------------------------------ */
export async function createUserAction(
  prevState: User[],
  formData: FormData,
): Promise<User[]> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const deptsRaw = formData.get("departments") as string | null;

  const departmentIds: number[] = deptsRaw ? JSON.parse(deptsRaw) : [];
  console.log("createUserAction: ", { departmentIds });

  const res = await fetch(`${BACKEND}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, departmentIds }),
  });
  console.log("RES:", res);

  if (!res.ok) {
    throw new Error("Failed to create user: " + (await res.text()));
  }

  const newUser: User = await res.json();
  return [...prevState, newUser];
}

/* ------------------------------------------------------------------ */
/*  UPDATE  +  ASSIGN DEPARTMENTS  */
/* ------------------------------------------------------------------ */
export async function updateUserAction(
  prevUsers: User[] | null,
  formData: FormData,
): Promise<User[] | null> {
  console.log("UPDATING USER ", formData.get("name"));
  /* ------------ 0. common auth ------------- */
  const raw = (await cookies()).get("session")?.value;
  if (!raw) throw new Error("Not authenticated");
  const token = (await decrypt(raw))?.token;
  if (!token) throw new Error("No token in session");

  /* ------------ 1. parse form  ------------- */
  const id = formData.get("id")?.toString();
  if (!id) throw new Error("Missing user ID");

  const name = formData.get("name") as string | null;
  const email = formData.get("email") as string | null;
  const status = formData.get("status") as string | null;
  const role = formData.get("role") as string | null;
  const password = formData.get("password") as string | null;
  const deptsRaw = formData.get("departments") as string | null;

  const departmentIds: number[] =
    deptsRaw && deptsRaw.length ? JSON.parse(deptsRaw) : [];

  /* ------------ 2. update user core fields ------------- */
  const body: Record<string, unknown> = {};
  if (name) body.name = name;
  if (email) body.email = email;
  if (status) body.status = status;
  if (role) body.role = role;
  if (password) body.password = password;

  let updatedUser: User;
  console.log("BODY:", body);

  if (Object.keys(body).length) {
    const res = await fetch(`${BACKEND}/api/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error(
        `Failed to update user: ${res.status} ${await res.text()}`,
      );
    }
    updatedUser = await res.json();
  } else {
    // nothing changed
    updatedUser = prevUsers.find((u) => u.id === Number(id)) as User;
  }

  /* ------------ 3. assign (replace) departments ------------- */
  console.log("ID: ", id);
  const res = await fetch(`${BACKEND}/api/users/${id}/assign-departments`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(departmentIds),
  });
  console.log("RES:", res);
  if (!res.ok) {
    throw new Error(
      `Failed to assign departments: ${res.status} ${await res.text()}`,
    );
  }
  updatedUser = await res.json(); // bao  ckend returns UserResponse
  console.log("UPDATED USER:", updatedUser);
  /* ------------ 4. merge into list ------------- */
  return (
    prevUsers?.map((u) => (u.id === updatedUser.id ? updatedUser : u)) ?? null
  );
}
