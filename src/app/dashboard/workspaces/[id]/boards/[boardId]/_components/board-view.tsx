"use client";

import { useTaskListsByBoardIdAndWorkspaceId } from "@/hooks/use-task-list";
import TaskList from "./task-list";
import AddTaskList from "./create-tasklist-dialog";
import EmptySection from "@/components/empty-section";
import { ListChecks } from "lucide-react";
import { useTaskListStore } from "@/store/use-tasklist-store";
import { cn } from "@/lib/utils";
import TaskCard from "./task-card";

interface BoardViewProps {
  boardId: string;
  workspaceId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialData?: any[];
}

export default function BoardView({
  boardId,
  workspaceId,
  initialData,
}: BoardViewProps) {
  const { data: taskLists = [] } = useTaskListsByBoardIdAndWorkspaceId(
    boardId,
    workspaceId,
    initialData
  );
  const { setIsTaskListModalOpen } = useTaskListStore();

  return (
    <>
      <div className="flex min-w-max gap-4 lg:gap-6">
        {taskLists.length > 0 ? (
          <>
            {taskLists.map((taskList) => (
              <TaskList
                key={taskList.id}
                title={taskList.name}
                taskListId={taskList.id}
                boardId={boardId}
                workspaceId={workspaceId}
              >
                {taskList.taskCards.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </TaskList>
            ))}
          </>
        ) : (
          <EmptySection
            title="No tasks yet"
            description="Create a task list to get started"
            icon={<ListChecks />}
            showButton
            buttonText="Create task list"
            onClick={() => setIsTaskListModalOpen(true)}
          />
        )}
        <div className={cn(taskLists.length > 0 ? "block" : "hidden")}>
          <AddTaskList boardId={boardId} workspaceId={workspaceId} />
        </div>
      </div>
    </>
  );
}
