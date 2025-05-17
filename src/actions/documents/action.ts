/*  createDocumentAction
    --------------------
    – Takes FormData from the dialog
    – Reads JWT from session cookie
    – Sends multipart/form-data POST to Spring
    – Returns updated list for optimistic UI
*/
"use server";

import { cookies } from "next/headers";
import { decrypt } from "../../lib/session";
import { Document } from "../../lib/definitions";

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:8081";

export async function createDocumentAction(
  prevDocs: Document[],
  formData: FormData,
): Promise<Document[]> {
  console.log("MAKING REQUEST TO BACKEND WITH createDocumentAction");

  /* 1. pull fields */
  const file = formData.get("file") as File | null;
  const title = formData.get("title")?.toString().trim();
  const categoryId = formData.get("categoryId")?.toString();
  const departmentId = formData.get("departmentId")?.toString();

  if (!file || !title || !categoryId || !departmentId) {
    throw new Error("File, title, category and department are all required");
  }

  /* 2. auth */
  const raw = (await cookies()).get("session")?.value;
  if (!raw) throw new Error("Not authenticated");
  const { token } = (await decrypt(raw)) as { token?: string };
  if (!token) throw new Error("No token in session");

  /* 3. make multipart body */
  const body = new FormData();
  body.set("file", file);
  body.set("title", title);
  body.set("categoryId", categoryId);
  body.set("departmentId", departmentId);

  /* 4. POST */
  console.log("MAKING REQUEST TO BACKEND WITH BODY: ", body);
  const res = await fetch(`${BACKEND}/api/documents`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, // *no* content-type header for FormData
    },
    body,
  });

  if (!res.ok) {
    throw new Error(`Upload failed: ${res.status} ${await res.text()}`);
  }

  const newDoc: Document = await res.json();
  console.log("THE BACKEND RETURNED: res", res);
  /* 5. merge + return */
  return [...prevDocs, newDoc];
}
