// Server action: loginAction.ts
"use server";
import { cookies } from "next/headers";
import { createSession, deleteSession } from "../../lib/session";

// login
export async function loginAction(prevState: any, formData: FormData) {
  console.log("making loginAction");
  try {
    // Convert form data values to strings
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    // Validate inputs
    if (!email || !password) {
      return { error: "Email and Password are required", success: false };
    }

    // Use the BACKEND_URL from environment variables
    // const backendUrl = process.env.BACKEND_URL;
    const backendUrl = "http://localhost:5001";
    if (!backendUrl) {
      // throw new Error("BACKEND_URL is not defined in environment variables.");
    }

    const res = await fetch(`${backendUrl}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok) {
      return { error: data.message || "Login failed", success: false };
    }

    console.log("creating session...");
    await createSession(data.user);
    console.log("created session!");

    if (data.access_token) {
      const c = await cookies();
      c.set({
        name: "auth_token",
        value: data.access_token,
        httpOnly: true, // prevents client-side JavaScript from reading the cookie
        secure: process.env.NODE_ENV === "production", // send cookie over HTTPS only in production
        sameSite: "strict",
        path: "/",
      });
    }

    return {
      error: null,
      success: true,
      token: data.access_token,
      user: data.user,
    };
  } catch (error) {
    console.error("Error during login:", error);
    return { error: "Login failed", success: false };
  }
}
// logout
export async function logoutAction(prevState: any) {
  try {
    console.log("making logoutAction");
    // Use the BACKEND_URL from environment variables
    // const backendUrl = process.env.BACKEND_URL;
    const backendUrl = "http://localhost:5001";
    if (!backendUrl) {
      // throw new Error("BACKEND_URL is not defined in environment variables.");
    }
    const c = await cookies();

    const res = await fetch(`${backendUrl}/api/auth/logout`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });
    const r = await res.json();
    console.log(r);
    const token = c.get("auth_token");
    console.log("retrieved token ", token);

    c.delete("auth_token");

    deleteSession();
    // const data = await res.json();

    return { error: null, success: true, token: null, user: null };
  } catch (error) {
    console.error("Error during logout:", error);
    return { error: "Logout failed", success: false };
  }
}
