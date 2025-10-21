import { axiosInstance } from "@/lib/axios";
import type { ApiResponse, TaskListWithCards } from "@/types";

const boardId = "05541385-ec1f-48ce-a7ba-84d69535c464";

export async function getTaskList(): Promise<ApiResponse<TaskListWithCards>> {
  const response = await axiosInstance.get<ApiResponse<TaskListWithCards>>(
    `/api/v1/lists?boardId=${boardId}`,
  );
  return response.data;
}

// export async function getTaskList() {
//   const response = await axiosInstance.get(
//     "/api/v1/lists?boardId=0283ca18-2816-41b1-a9fd-b983a63c487e"
//   );
//   return response.data;
// }
