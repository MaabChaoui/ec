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
    const backendUrl = process.env.BACKEND_URL;
    console.log("backendUrl:", backendUrl);
    // const backendUrl = "http://localhost:8081";
    if (!backendUrl) {
      throw new Error("BACKEND_URL is not defined in environment variables.");
    }

    const res = await fetch(`${backendUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    console.log("res:", res);
    const data = await res.json();
    console.log("data", data);

    if (!res.ok) {
      return { error: data.message || "Login failed", success: false };
    }
    await createSession(data.access_token, data.user);

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
    // console.log("making logoutAction");
    await deleteSession();

    return { error: null, success: true, token: null, user: null };
  } catch (error) {
    console.error("Error during logout:", error);
    return { error: "Logout failed", success: false };
  }
}
