"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  FileStack,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  user: {
    name: "Maab Chaoui",
    email: "maab.chaoui@ensia.edu.dz",
    avatar: "/globe.svg",
  },
  teams: [
    {
      name: "Ensia",
      logo: GalleryVerticalEnd,
      plan: "Higher School",
    },
    {
      name: "Natus Vincere",
      logo: AudioWaveform,
      plan: "Team",
    },
  ],
  navMain: [
    {
      title: "Admin Dashboard",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Users",
          url: "/dashboard/users",
        },
        {
          title: "Departments",
          url: "/dashboard/departments",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Documents",
      url: "#",
      icon: FileStack,
      isActive: true,
      items: [
        {
          title: "List Documents",
          url: "/dashboard/documents",
        },
        {
          title: "Categories",
          url: "/dashboard/categories",
        },
      ],
    },
    {
      title: "More",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "Contact HR",
          url: "#",
        },
        {
          title: "Reset your password",
          url: "#",
        },
        {
          title: "About",
          url: "#",
        },
        {
          title: "Corporate Policy",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
};

export function AppSidebar({
  session,
  ...props
}: { session: { role?: string } | null } & React.ComponentProps<
  typeof Sidebar
>) {
  const isAdmin = session?.role.toLowerCase() === "admin";

  // slice off “Admin Dashboard” if not admin
  const navMain = React.useMemo(() => {
    return data.navMain.filter((item) => {
      if (item.title === "Admin Dashboard" && !isAdmin) return false;
      return true;
    });
  }, [isAdmin]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
