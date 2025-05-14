// components/AppSidebarContainer.tsx
import { cookies } from "next/headers";
import { decrypt } from "../lib/session"; // wherever your decrypt lives
import { AppSidebar } from "./app-sidebar";

export default async function AppSidebarContainer() {
  const cookieStore = cookies();
  const raw = cookieStore.get("session")?.value;
  const session = raw ? await decrypt(raw) : null;

  return <AppSidebar session={session} />;
}
