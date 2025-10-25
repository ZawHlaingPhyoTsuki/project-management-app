"use client";

import { useQuery } from "@tanstack/react-query";
import AddTaskList from "@/app/dashboard/_components/AddTaskList";
import TaskCard from "@/app/dashboard/_components/TaskCard";
import TaskList from "@/app/dashboard/_components/TaskList";
import SecondHeader from "@/components/dashboard/SecondHeader";
import { SiteHeader } from "@/components/sidebar/site-header";
import { dummyTaskLists } from "@/constants/dummyData";
import { getTaskList } from "@/services/taskListService";

export default function Page() {
  function useTaskList() {
    return useQuery({
      queryKey: ["taskList"],
      queryFn: getTaskList,
    });
  }

  // biome-ignore lint/correctness/noUnusedVariables: <no problem>
  const { data } = useTaskList();
  // console.log(data?.data);

  //  const taskLists = data?.data || dummyTaskLists;
  const taskLists = dummyTaskLists;

  return (
    <>
      <SiteHeader />
      <SecondHeader />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col">
          {/* Kanban Board Container */}
          <div className="custom-scrollbar-horizontal flex-1 overflow-x-auto px-4 py-4">
            <div className="flex h-full min-w-max gap-4 lg:gap-6">
              {taskLists
                .sort((a, b) => a.position - b.position)
                .map((taskList) => (
                  <TaskList key={taskList.id} title={taskList.name}>
                    {taskList.taskCards.map((task) => (
                      <TaskCard key={task.id} task={task} />
                    ))}
                  </TaskList>
                ))}
              <AddTaskList />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
