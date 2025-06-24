"use client";

import * as React from "react";
import {
  BarChart3,
  Package,
  Heart,
  MessageCircle,
  List,
  Package2,
  DollarSign,
  Calendar,
  CheckSquare,
  Users,
  Receipt,
  Layers,
  User,
  Table,
} from "lucide-react";

import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: BarChart3,
      isActive: true,
    },
    {
      title: "Products",
      url: "/dashboard/products",
      icon: Package,
    },
    {
      title: "Favorites",
      url: "/dashboard/favorites",
      icon: Heart,
    },
    {
      title: "Chatbot",
      url: "/dashboard/chatbot",
      icon: MessageCircle,
    },
    {
      title: "Especes",
      url: "/dashboard/especes",
      icon: List,
    },
    {
      title: "Product Stock",
      url: "/dashboard/stock",
      icon: Package2,
    },
  ],
  pages: [
    {
      title: "Pricing",
      url: "/dashboard/pricing",
      icon: DollarSign,
    },
    {
      title: "Calendar",
      url: "/dashboard/calendar",
      icon: Calendar,
    },
    {
      title: "To-Do",
      url: "/dashboard/todo",
      icon: CheckSquare,
    },
    {
      title: "Contact",
      url: "/dashboard/contact",
      icon: Users,
    },
    {
      title: "Invoice",
      url: "/dashboard/invoice",
      icon: Receipt,
    },
    {
      title: "UI Elements",
      url: "/dashboard/ui-elements",
      icon: Layers,
    },
    {
      title: "Team",
      url: "/dashboard/team",
      icon: User,
    },
    {
      title: "Table",
      url: "/dashboard/table",
      icon: Table,
    },
  ],
};

// Logo component
function DashStackLogo() {
  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center">
        <BarChart3 className="h-5 w-5 text-white" />
      </div>
      <span className="text-lg font-semibold">
        <span className="text-blue-600">Dash</span>
        <span className="text-gray-900">Stack</span>
      </span>
    </div>
  );
}

// Navigation component for simple links
function NavLinks({ items }: { items: typeof data.navMain }) {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild isActive={item.isActive}>
                <Link href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

export function AppSidebar({
  session,
  ...props
}: {
  session: { name?: string; email?: string; role?: string } | null;
} & React.ComponentProps<typeof Sidebar>) {
  const user = {
    name: session?.name ?? "User",
    email: session?.email ?? "email",
    avatar: "/globe.svg",
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <DashStackLogo />
      </SidebarHeader>
      <SidebarContent className="space-y-2">
        <NavLinks items={data.navMain} />
        <SidebarGroup>
          <div className="px-2 py-1">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              PAGES
            </h3>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.pages.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}