import type {
  Tag,
  TaskCard,
  TaskList,
  User,
} from "../../prisma/generated/client";

export type {
  Board,
  Tag,
  TaskCard,
  TaskList,
  User,
} from "../../prisma/generated/client";

export {
  ResourceType,
  Role,
} from '../../prisma/generated/enums'

export interface TaskCardWithAssigneeAndTags extends TaskCard {
  assignees: User[];
  tags: Tag[];
}

export interface TaskListWithCards extends TaskList {
  taskCards: TaskCardWithAssigneeAndTags[];
  _count?: { taskCards: number };
}

export interface ApiResponse<T> {
  data: T[];
  success: boolean;
}
