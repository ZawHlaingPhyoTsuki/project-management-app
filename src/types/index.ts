import type {
  Tag,
  TaskCard,
  TaskList,
  User,
} from "../../prisma/generated/client";

export type {
  Board,
  TaskCard,
  TaskList,
  User,
} from "../../prisma/generated/client";

export interface TaskCardWithAssigneeAndTags extends TaskCard {
  assignee: User | null;
  tags: Tag[];
}

export interface TaskListWithCards extends TaskList {
  taskCards: TaskCardWithAssigneeAndTags[];
  _count?: { taskCards: number };
}

export interface ApiResponse<T> {
  data: T[];
  success: boolean;
  //   total?: number;
  //   page?: number;
  //   limit?: number;
}
