import React from "react";
import type { Metadata } from "next";
import "../globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";
import LocaleSwitcher from "@/components/LocaleSwitcherSelect";
import AppSidebarContainer from "../../components/AppSidebarContainer";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebarContainer />
      <main className="w-full">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <ModeToggle />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <LocaleSwitcher />
          <Separator orientation="vertical" className="mr-2 h-4" />
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
