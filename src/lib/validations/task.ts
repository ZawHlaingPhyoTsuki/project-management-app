import { z } from "zod";

export const CreateTaskListSchema = z.object({
  name: z
    .string()
    .min(1, "List name is required")
    .max(50, "List name must be under 50 characters"),
});

export const CreateTaskSchema = z.object({
  title: z
    .string()
    .min(1, "Task title is required")
    .max(100, "Task title must be at most 100 characters"),
  description: z
    .string()
    .max(100, "Description must be at most 100 characters")
    .optional(),
});

export const UpdateTaskSchema = z
  .object({
    title: z
      .string()
      .min(1, "Task title is required")
      .max(100, "Task title must be at most 100 characters")
      .optional(),
    description: z
      .string()
      .max(100, "Description must be at most 100 characters")
      .optional(),
  })
  .refine(
    (data) => data.title !== undefined || data.description !== undefined,
    {
      message: "At least one field (title or description) must be provided",
    }
  );

export const UpdateTaskListSchema = z.object({
  title: z
    .string()
    .min(1, "Task list name is required")
    .max(50, "Task list name must be under 50 characters"),
});

export type CreateTaskListType = z.infer<typeof CreateTaskListSchema>;
export type CreateTaskType = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskType = z.infer<typeof UpdateTaskSchema>;
export type UpdateTaskListType = z.infer<typeof UpdateTaskListSchema>;