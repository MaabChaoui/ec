/* app/actions/categories/action.ts */
"use server";

import { cookies } from "next/headers";
import { decrypt } from "../../lib/session"; // adjust path if needed
import { Category } from "../../lib/definitions";

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:8081";

export async function createCategoryAction(
  prevCategories: Category[],
  formData: FormData,
): Promise<Category[]> {
  /* 1. Read & validate name ------------------------------------ */
  const name = formData.get("name")?.toString().trim();
  if (!name) throw new Error("Category name is required");

  /* 2. Auth: pull JWT from cookie ------------------------------ */
  const raw = (await cookies()).get("session")?.value;
  if (!raw) throw new Error("Not authenticated");
  const { token } = (await decrypt(raw)) as { token?: string };
  if (!token) throw new Error("No token in session");

  /* 3. Call backend ------------------------------------------- */
  const res = await fetch(`${BACKEND}/api/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to create category: ${res.status} ${text}`);
  }

  const newCategory: Category = await res.json();

  /* 4. Return merged list ------------------------------------- */
  return [...prevCategories, newCategory];
}
