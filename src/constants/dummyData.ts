import { Tag, TaskCard, TaskList, User } from "@/types";

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


// Dummy Users
export const dummyUsers: User[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john@example.com",
    emailVerified: true,
    image:
      "https://pbs.twimg.com/profile_images/1593304942210478080/TUYae5z7_400x400.jpg",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "user-2",
    name: "Jane Smith",
    email: "jane@example.com",
    emailVerified: true,
    image:
      "https://pbs.twimg.com/profile_images/1677042510839857154/Kq4tpySA_400x400.jpg",
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-16"),
  },
  {
    id: "user-3",
    name: "Bob Johnson",
    email: "bob@example.com",
    emailVerified: true,
    image: null,
    createdAt: new Date("2024-01-17"),
    updatedAt: new Date("2024-01-17"),
  },
];

// Dummy Tags
export const dummyTags: Tag[] = [
  {
    id: "tag-1",
    name: "Frontend",
    color: "BLUE",
    description: "Frontend development tasks",
    workspaceId: "workspace-1",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "tag-2",
    name: "Backend",
    color: "GREEN",
    description: "Backend development tasks",
    workspaceId: "workspace-1",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "tag-3",
    name: "Bug",
    color: "RED",
    description: "Bug fixes",
    workspaceId: "workspace-1",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "tag-4",
    name: "Feature",
    color: "PURPLE",
    description: "New features",
    workspaceId: "workspace-1",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "tag-5",
    name: "Urgent",
    color: "YELLOW",
    description: "Urgent tasks",
    workspaceId: "workspace-1",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: "tag-6",
    name: "Documentation",
    color: "PINK",
    description: "Documentation work",
    workspaceId: "workspace-1",
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
];

// Dummy Task Cards
const dummyTaskCards: TaskCardWithAssigneeAndTags[] = [
  // To Do Column
  {
    id: "task-1",
    title: "Create landing page designnnn nnnnnnnnnnn",
    description:
      "Design a modern landing page with hero section and CTA buttons",
    dueDate: new Date("2024-02-15"),
    position: 0,
    isArchived: false,
    archivedAt: null,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
    taskListId: "list-1",
    assignees: [dummyUsers[0], dummyUsers[1]], // Multiple assignees
    tags: [dummyTags[0], dummyTags[3]], // Frontend, Feature
  },
  {
    id: "task-2",
    title: "Set up database schema",
    description:
      "Design and implement the initial database schema for the application",
    dueDate: new Date("2024-02-10"),
    position: 1,
    isArchived: false,
    archivedAt: null,
    createdAt: new Date("2024-01-19"),
    updatedAt: new Date("2024-01-19"),
    taskListId: "list-1",
    assignees: [dummyUsers[1]], // Single assignee
    tags: [dummyTags[1]], // Backend
  },
  {
    id: "task-3",
    title: "Fix login page responsive issues",
    description: "Login page breaks on mobile devices, need to fix CSS issues",
    dueDate: null,
    position: 2,
    isArchived: false,
    archivedAt: null,
    createdAt: new Date("2024-01-21"),
    updatedAt: new Date("2024-01-21"),
    taskListId: "list-1",
    assignees: [], // No assignees
    tags: [dummyTags[0], dummyTags[2]], // Frontend, Bug
  },

  // In Progress Column
  {
    id: "task-4",
    title: "Implement user authentication API",
    description: "Create REST API endpoints for user registration and login",
    dueDate: new Date("2024-02-05"),
    position: 0,
    isArchived: false,
    archivedAt: null,
    createdAt: new Date("2024-01-18"),
    updatedAt: new Date("2024-01-22"),
    taskListId: "list-2",
    assignees: [dummyUsers[1], dummyUsers[2], dummyUsers[3]], // Three assignees
    tags: [dummyTags[1], dummyTags[4]], // Backend, Urgent
  },
  {
    id: "task-5",
    title: "Create component library",
    description: "Build reusable React components for the design system",
    dueDate: new Date("2024-02-20"),
    position: 1,
    isArchived: false,
    archivedAt: null,
    createdAt: new Date("2024-01-17"),
    updatedAt: new Date("2024-01-21"),
    taskListId: "list-2",
    assignees: [dummyUsers[0], dummyUsers[3]], // Two assignees
    tags: [dummyTags[0], dummyTags[3]], // Frontend, Feature
  },

  // Review Column
  {
    id: "task-6",
    title: "Code review: Payment integration",
    description: "Review the Stripe payment integration code before deployment",
    dueDate: new Date("2024-01-25"),
    position: 0,
    isArchived: false,
    archivedAt: null,
    createdAt: new Date("2024-01-16"),
    updatedAt: new Date("2024-01-23"),
    taskListId: "list-3",
    assignees: [dummyUsers[2]], // Single assignee
    tags: [dummyTags[1], dummyTags[5]], // Backend, Documentation
  },
  {
    id: "task-7",
    title: "Test user onboarding flow",
    description:
      "Complete end-to-end testing of the new user onboarding process",
    dueDate: null,
    position: 1,
    isArchived: false,
    archivedAt: null,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-22"),
    taskListId: "list-3",
    assignees: [dummyUsers[0], dummyUsers[1], dummyUsers[2], dummyUsers[3]], // Four assignees
    tags: [dummyTags[3]], // Feature
  },

  // Done Column
  {
    id: "task-8",
    title: "Project setup and configuration",
    description: "Initialize Next.js project with TypeScript and Tailwind CSS",
    dueDate: new Date("2024-01-10"),
    position: 0,
    isArchived: false,
    archivedAt: null,
    createdAt: new Date("2024-01-05"),
    updatedAt: new Date("2024-01-12"),
    taskListId: "list-4",
    assignees: [dummyUsers[0]], // Single assignee
    tags: [dummyTags[0]], // Frontend
  },
  {
    id: "task-9",
    title: "Design system documentation",
    description: "Create comprehensive documentation for the design system",
    dueDate: new Date("2024-01-08"),
    position: 1,
    isArchived: false,
    archivedAt: null,
    createdAt: new Date("2024-01-03"),
    updatedAt: new Date("2024-01-09"),
    taskListId: "list-4",
    assignees: [dummyUsers[2], dummyUsers[3]], // Two assignees
    tags: [dummyTags[5]], // Documentation
  },
];

// Dummy Task Lists
export const dummyTaskLists: TaskListWithCards[] = [
  {
    id: "list-1",
    name: "To Do",
    position: 0,
    isArchived: false,
    archivedAt: null,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    boardId: "board-1",
    taskCards: dummyTaskCards.filter((card) => card.taskListId === "list-1"),
    _count: { taskCards: 3 },
  },
  {
    id: "list-2",
    name: "In Progress",
    position: 1,
    isArchived: false,
    archivedAt: null,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    boardId: "board-1",
    taskCards: dummyTaskCards.filter((card) => card.taskListId === "list-2"),
    _count: { taskCards: 2 },
  },
  {
    id: "list-3",
    name: "Review",
    position: 2,
    isArchived: false,
    archivedAt: null,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    boardId: "board-1",
    taskCards: dummyTaskCards.filter((card) => card.taskListId === "list-3"),
    _count: { taskCards: 2 },
  },
  {
    id: "list-4",
    name: "Done",
    position: 3,
    isArchived: false,
    archivedAt: null,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    boardId: "board-1",
    taskCards: dummyTaskCards.filter((card) => card.taskListId === "list-4"),
    _count: { taskCards: 2 },
  },
];

// Mock API response
export const dummyApiResponse = {
  data: dummyTaskLists,
  success: true,
};
