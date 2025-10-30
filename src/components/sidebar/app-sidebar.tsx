"use client";

import {
  IconDashboard,
  IconFileWord,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSettings,
} from "@tabler/icons-react";
import type { User } from "better-auth";
import { BarChart3, Calendar, FolderKanban, Users } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type * as React from "react";
import { NavMain } from "@/components/sidebar/nav-main";
import { NavSecondary } from "@/components/sidebar/nav-secondary";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavWorkspace } from "./nav-documents";

interface AppSideBarProps extends React.ComponentProps<typeof Sidebar> {
  user: User;
}

export function AppSidebar({ user, ...props }: AppSideBarProps) {
  const pathname = usePathname();

  const data = {
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard?view=board",
        icon: IconDashboard,
      },
      {
        title: "My Tasks",
        url: "/dashboard/tasks",
        icon: IconListDetails,
      },
      {
        title: "Calendar",
        url: "/dashboard/calendar",
        icon: Calendar,
      },
      {
        title: "Analytics",
        url: "/dashboard/analytics",
        icon: BarChart3,
      },
      {
        title: "Workspaces",
        url: "/dashboard/workspaces",
        icon: Users,
      },
    ],
    navSecondary: [
      {
        title: "Templates",
        url: "/dashboard/templates",
        icon: IconFileWord,
      },
      {
        title: "Reports",
        url: "/dashboard/reports",
        icon: IconReport,
      },
      {
        title: "Settings",
        url: "/dashboard/settings",
        icon: IconSettings,
      },
      {
        title: "Help & Support",
        url: "/dashboard/help",
        icon: IconHelp,
      },
    ],
    workspace: [
      {
        title: "Workspaces",
        url: "/dashboard/workspaces",
        icon: FolderKanban,
        isActive: true,
        items: [
          {
            title: "Boards",
            url: "/dashboard/boards/cmhd8gfwr0005jxw6bv6a26h3",
          },
          {
            title: "Marketing",
            url: "/dashboard/workspaces/2",
          },
        ],
      },
      {
        title: "Boards",
        url: "/dashboard/boards",
        icon: FolderKanban,
        items: [
          {
            title: "Sprint Board",
            url: "/dashboard/boards/1",
          },
          {
            title: "Backlog",
            url: "/dashboard/boards/2",
          },
          {
            title: "Bug Tracking",
            url: "/dashboard/boards/3",
          },
        ],
      },
    ],
  };

  return (
    <Sidebar collapsible="offcanvas" {...props} className="no-scrollbar">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <IconInnerShadowTop className="!size-5" />
                <span className="font-semibold text-base">Acme Inc.</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="no-scrollbar">
        <NavMain items={data.navMain} pathname={pathname} />
        <NavWorkspace
          items={data.workspace}
          title="Workspaces & Boards"
          emptyMessage="No workspaces yet. Create your first workspace!"
        />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{ ...user, avatar: user.image }} />
      </SidebarFooter>
    </Sidebar>
  );
}
