import { axiosInstance } from "@/lib/axios";
import type { ApiResponse } from "@/types";

export const workspaceService = {
  getAllWorkspaces: async () => {
    const response = await axiosInstance.get("/api/v1/workspaces");
    return response.data;
  },
};
