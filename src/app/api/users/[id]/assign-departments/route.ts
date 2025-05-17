// example: assign
import { cookies } from "next/headers";
import { decrypt } from "@/lib/session";
import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL ?? "http://localhost:8081";

export async function PUT(_: NextRequest, { params }) {
  //   console.log("params", params);
  const raw = (await cookies()).get("session")?.value;
  console.log("raaaaaw: ", raw);
  if (!raw) return NextResponse.json({ msg: "unauth" }, { status: 401 });
  const token = (await decrypt(raw))?.token;
  //   const token = raw;

  const body = await _.json(); // expects  [1,4,7]
  console.log("Request body: _ ", body);
  console.log("token: ", token);

  const res = await fetch(
    // `${BACKEND}/api/users/9/assign-departments`,
    `${BACKEND}/api/users/${(await params).id}/assign-departments`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    },
  );
  console.log("Springboot res: ", res);

  const out = await res.json();
  return NextResponse.json(out, { status: res.status });
}
