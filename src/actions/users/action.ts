// app/dashboard/users/actions.ts
"use server";
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

  //   const backendUrl = "http://localhost:8081";
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
