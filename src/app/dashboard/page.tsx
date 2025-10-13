"use client";

import SecondHeader from "@/components/dashboard/SecondHeader";
import TaskCard from "@/components/dashboard/TaskCard";
import TaskList from "@/components/dashboard/TaskList";
import { SiteHeader } from "@/components/sidebar/site-header";

export default function Page() {
  return (
    <>
      <SiteHeader />
      <SecondHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col">
          {/* Kanban Board Container */}
          <div className="flex-1 px-4 py-4 overflow-x-auto custom-scrollbar-horizontal">
            <div className="flex gap-4 lg:gap-6 min-w-max h-full">
              <TaskList title="To Do">
                <TaskCard />
                <TaskCard />
                <TaskCard />
                <TaskCard />
                <TaskCard />
                <TaskCard />
              </TaskList>
              <TaskList title="In Progress">
                <TaskCard />
                <TaskCard />
                <TaskCard />
              </TaskList>
              <TaskList title="Review">
                <TaskCard />
                <TaskCard />
                <TaskCard />
                <TaskCard />
              </TaskList>
              <TaskList title="Done">
                <TaskCard />
                <TaskCard />
                <TaskCard />
                <TaskCard />
                <TaskCard />
              </TaskList>
              <TaskList title="Backlog">
                <TaskCard />
                <TaskCard />
                <TaskCard />
                <TaskCard />
                <TaskCard />
                <TaskCard />
                <TaskCard />
              </TaskList>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
