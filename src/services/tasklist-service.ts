import { axiosInstance } from "@/lib/axios";
import type { ApiResponse, TaskListWithCards } from "@/types";

interface CreateTaskListData {
  name: string;
  boardId: string;
  position?: number;
}

export const taskListService = {
  getTaskLists: async (boardId: string) => {
    const response = await fetch(`/api/v1/lists?boardId=${boardId}`);
    if (!response.ok) {
      throw new Error("Failed to fetch task lists");
    }
    return response.json();
  },

  createTaskList: async (data: CreateTaskListData) => {
    const response = await fetch("/api/v1/lists", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to create task list");
    }

    return response.json();
  },
};
