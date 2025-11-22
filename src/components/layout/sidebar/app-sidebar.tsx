"use client";

import {
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReport,
  IconSettings,
} from "@tabler/icons-react";
import type { User } from "better-auth";
import { BarChart3, Calendar, KanbanSquare, Layout } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type * as React from "react";
import { NavMain } from "@/components/layout/sidebar/nav-main";
import { NavSecondary } from "@/components/layout/sidebar/nav-secondary";
import { NavUser } from "@/components/layout/sidebar/nav-user";
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

/**
 * Render the application's sidebar containing primary and secondary navigation, a workspaces section, and the user area.
 *
 * The sidebar highlights the current path-derived item and passes through additional Sidebar props. The provided `user` is used to populate the user area; the user's `image` is used as the avatar.
 *
 * @param user - The current signed-in user whose information is displayed in the sidebar
 * @returns The `JSX.Element` representing the application sidebar
 */
export function AppSidebar({ user, ...props }: AppSideBarProps) {
  const pathname = usePathname();

  const data = {
    navMain: [
      {
        title: "Workspaces",
        url: "/dashboard/workspaces",
        icon: Layout,
      },
      {
        title: "Boards",
        url: "/dashboard/boards",
        icon: KanbanSquare,
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
    ],
    navSecondary: [
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
        <NavWorkspace title="Workspaces & Boards" />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{ ...user, avatar: user.image }} />
      </SidebarFooter>
    </Sidebar>
  );
}