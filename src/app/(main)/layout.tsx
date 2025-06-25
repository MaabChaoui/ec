import React from "react";
import type { Metadata } from "next";
import "../globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import LocaleSwitcher from "@/components/LocaleSwitcherSelect";
import AppSidebarContainer from "../../components/AppSidebarContainer";
import NotificationBell from "@/components/NotificationBell";
import "leaflet/dist/leaflet.css";
import {NavUser} from "@/components/nav-user";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = {
    name: "Nada",
    email: "nada@jardin.hamma",
    avatar: "/dracaena-tree-icon.svg",
  };
  return (
    <SidebarProvider>
      <AppSidebarContainer />
      <main className="w-full bg-[#F5F6FA]">
        <div className="flex min-h-[60px] justify-between bg-white items-center gap-2 px-4">
          <div className="gap-4 flex items-center px-4">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <ModeToggle />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <LocaleSwitcher />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
          <div className="flex items-center gap-6 px-4 mr-5 ">
            <NotificationBell />
            <NavUser user={user} />
          </div>
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
