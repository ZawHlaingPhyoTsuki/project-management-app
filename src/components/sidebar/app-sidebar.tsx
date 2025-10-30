"use client";

import {
  IconDashboard,
  IconFileWord,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconPlus,
  IconReport,
  IconSettings,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
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

// Mock data - replace with actual API calls
const mockWorkspaces = [
  {
    id: "1",
    name: "Product Development",
    description: "Main product workspace",
    boards: [
      { id: "1", name: "Sprint Board", url: "/dashboard/boards/1" },
      { id: "2", name: "Backlog", url: "/dashboard/boards/2" },
      { id: "3", name: "Bug Tracking", url: "/dashboard/boards/3" },
    ],
  },
  {
    id: "2",
    name: "Marketing",
    description: "Marketing campaigns",
    boards: [
      { id: "4", name: "Content Calendar", url: "/dashboard/boards/4" },
      { id: "5", name: "Campaign Planning", url: "/dashboard/boards/5" },
    ],
  },
];

interface AppSideBarProps extends React.ComponentProps<typeof Sidebar> {
  user: User;
}

export function AppSidebar({ user, ...props }: AppSideBarProps) {
  const pathname = usePathname();

  // Fetch workspaces and boards (replace with your actual API calls)
  const { data: workspaces = [] } = useQuery({
    queryKey: ["workspaces"],
    queryFn: async () => {
      // Replace with your actual API call
      // const response = await fetch("/api/workspaces");
      // return response.json();
      return mockWorkspaces;
    },
  });

  const data = {
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
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
    workspace: workspaces.map((workspace) => ({
      title: workspace.name,
      url: `/dashboard/workspaces/${workspace.id}`,
      icon: FolderKanban,
      isActive: pathname.includes(`/workspaces/${workspace.id}`),
      items: [
        ...workspace.boards.map((board) => ({
          title: board.name,
          url: board.url,
        })),
        {
          title: "Create New Board",
          url: `/dashboard/workspaces/${workspace.id}/create-board`,
          icon: IconPlus,
          isCreate: true,
        },
      ],
    })),
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
