import { z } from "zod";

export const CreateTaskListSchema = z.object({
  name: z
    .string()
    .min(1, "List name is required")
    .max(50, "List name must be under 50 characters"),
});

export type CreateTaskListType = z.infer<typeof CreateTaskListSchema>;
