import { axiosInstance } from "@/lib/axios";
import type { ApiResponse } from "@/types";

interface CreateWorkspaceData {
  name: string;
  description?: string;
}

export const workspaceService = {
  getAllWorkspaces: async () => {
    const response = await axiosInstance.get("/api/v1/workspaces");
    return response.data;
  },

  createWorkspace: async (data: CreateWorkspaceData) => {
    const response = await axiosInstance.post("/api/v1/workspaces", data);
    return response.data;
  },
};
