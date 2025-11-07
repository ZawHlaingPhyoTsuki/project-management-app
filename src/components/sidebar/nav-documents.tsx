"use client";

import {
  ChevronRight,
  KanbanSquare,
  Layout,
  Settings,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useWorkspaces } from "@/hooks/use-workspace";
import { usePathname } from "next/navigation";

export function NavWorkspace({ title }: { title: string }) {
  const { data, isLoading } = useWorkspaces();
  const pathname = usePathname();
  const reversedWorkspaces = data?.data ? [...data.data].reverse() : [];

  // Define the sub-items for each workspace
  const getWorkspaceSubItems = (workspace: (typeof reversedWorkspaces)[0]) => [
    {
      title: "Boards",
      url: `/dashboard/workspaces/${workspace.id}/boards`,
      icon: KanbanSquare,
      count: workspace._count.boards,
    },
    {
      title: "Members",
      url: `/dashboard/workspaces/${workspace.id}/members`,
      icon: Users,
      count: workspace._count.members,
    },
    {
      title: "Settings",
      url: `/dashboard/workspaces/${workspace.id}/settings`,
      icon: Settings,
    },
  ];

  if (isLoading) {
    return (
      <SidebarGroup>
        <SidebarGroupLabel>{title}</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <span>Loading...</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    );
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {reversedWorkspaces.map((workspace) => {
          const workspacePath = `/dashboard/workspaces/${workspace.id}`;
          const isActive = pathname.startsWith(workspacePath);

          return (
            <Collapsible
              key={workspace.id}
              asChild
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <div className="flex">
                  {/* Link that only shows when not active */}
                  {!isActive && (
                    <Link href={workspacePath} className="flex-1">
                      <SidebarMenuButton tooltip={workspace.name}>
                        <Layout />
                        <span>{workspace.name}</span>
                      </SidebarMenuButton>
                    </Link>
                  )}

                  {/* Collapsible trigger that takes full width when active */}
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={workspace.name}
                      className={isActive ? "w-full" : "w-auto"}
                    >
                      {isActive && (
                        <>
                          <Layout />
                          <span>{workspace.name}</span>
                        </>
                      )}
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                </div>

                <CollapsibleContent>
                  <SidebarMenuSub>
                    {getWorkspaceSubItems(workspace).map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <Link
                            href={subItem.url}
                            className="flex items-center justify-between w-full"
                          >
                            <div className="flex items-center gap-2">
                              {subItem.icon && (
                                <subItem.icon className="h-4 w-4" />
                              )}
                              <span>{subItem.title}</span>
                            </div>
                            {subItem.count !== undefined && (
                              <Badge
                                variant="secondary"
                                className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
                              >
                                {subItem.count}
                              </Badge>
                            )}
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
