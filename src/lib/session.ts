import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { SessionPayload } from "./definitions";
import { cookies } from "next/headers";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    return payload;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    console.log("Failed to verify session");
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function createSession(token: any, user: any) {
  console.log("createSession: ", user);

  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const id = user.id;
  const role = user.role;
  const name = user.name;
  const email = user.email;

  const session = await encrypt({ id, role, name, email, token });
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: false, // TODO
    secure: false,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function updateSession() {
  const session = (await cookies()).get("session")?.value;
  const payload = await decrypt(session);

  if (!session || !payload) {
    return null;
  }

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: "lax",
    path: "/",
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
