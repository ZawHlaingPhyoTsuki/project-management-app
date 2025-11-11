"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useArchivedTaskListsByBoardId,
} from "@/hooks/use-task-list";
import { Archive, List, FileText } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { ArchivedTaskItem } from "./archived-task-item";
import { ArchivedTaskListItem } from "./archived-task-list-item";
import { TagColor } from "../../../../../../../../prisma/generated/enums";
import { useArchivedTasksByBoardId } from "@/hooks/use-task";

interface ArchivedTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  boardId: string;
}

type ArchivedTask = {
  id: string;
  title: string;
  description: string | null;
  archivedAt: Date | null;
  assignees: {
    id: string;
    taskCardId: string;
    userId: string;
    assignedAt: Date;
    user: {
      id: string;
      name: string;
      image: string | null;
      email: string;
    };
  }[];
  tags: {
    id: string;
    name: string;
    color: TagColor;
    description: string | null;
  }[];
  taskList: {
    id: string;
    name: string;
  };
};

// Type for archived task list
type ArchivedTaskList = {
  id: string;
  name: string;
  archivedAt: Date | null;
  _count: {
    taskCards: number;
  };
};

export default function ArchivedTaskDialog({
  open,
  onOpenChange,
  boardId,
}: ArchivedTaskDialogProps) {
  const [activeTab, setActiveTab] = useState("tasks");

  const { data: archivedTasksData, isLoading: tasksLoading } =
    useArchivedTasksByBoardId(boardId);
  const { data: archivedListsData, isLoading: listsLoading } =
    useArchivedTaskListsByBoardId(boardId);

  const archivedTasks: ArchivedTask[] = archivedTasksData?.data || [];
  const archivedLists: ArchivedTaskList[] = archivedListsData?.data || [];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Archive className="w-5 h-5" />
            Archived Items
          </DialogTitle>
          <DialogDescription>
            View and manage your archived task lists and tasks
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 overflow-hidden"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Tasks ({archivedTasks.length})
            </TabsTrigger>
            <TabsTrigger value="lists" className="flex items-center gap-2">
              <List className="w-4 h-4" />
              Task Lists ({archivedLists.length})
            </TabsTrigger>
          </TabsList>

          <div className="mt-4 overflow-y-auto max-h-[60vh] pr-1">
            {/* Tasks Content */}
            <TabsContent value="tasks" className="space-y-4 m-1">
              {tasksLoading ? (
                <div className="flex justify-center py-8">
                  <Spinner className="w-6 h-6" />
                </div>
              ) : archivedTasks.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Archive className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No archived tasks</p>
                </div>
              ) : (
                archivedTasks.map((task) => (
                  <ArchivedTaskItem key={task.id} task={task} />
                ))
              )}
            </TabsContent>

            {/* Task Lists Content */}
            <TabsContent value="lists" className="space-y-4 m-1">
              {listsLoading ? (
                <div className="flex justify-center py-8">
                  <Spinner className="w-6 h-6" />
                </div>
              ) : archivedLists.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <List className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No archived task lists</p>
                </div>
              ) : (
                archivedLists.map((list) => (
                  <ArchivedTaskListItem key={list.id} list={list} />
                ))
              )}
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
