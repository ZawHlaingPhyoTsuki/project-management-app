"use client";

import TaskList from "../task/task-list";
import EmptySection from "@/components/shared/empty-section";
import { ListChecks } from "lucide-react";
import { useTaskListStore } from "@/stores/tasklist";
import { cn } from "@/lib/utils";
import TaskCard from "../task/task-card";
import { Spinner } from "@/components/ui/spinner";
import { useTaskListsByBoardId } from "@/data/task-lists/queries";
import CreateTaskListDialog from "./dialog/create-tasklist-dialog";

interface BoardViewProps {
  boardId: string;
  workspaceId: string;
}

export default function BoardView({ boardId, workspaceId }: BoardViewProps) {
  const { data, isLoading } = useTaskListsByBoardId(boardId);
  const taskLists = data?.data || [];
  const { setIsTaskListModalOpen } = useTaskListStore();

  if (isLoading) {
    return (
      <div className="flex w-full h-full min-h-[400px] items-center justify-center">
        <Spinner className="w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="flex min-w-max gap-4 lg:gap-6 items-start">
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
                <TaskCard
                  key={task.id}
                  task={task}
                  boardId={boardId}
                  workspaceId={workspaceId}
                />
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
        <CreateTaskListDialog boardId={boardId} workspaceId={workspaceId} />
      </div>
    </div>
  );
}
