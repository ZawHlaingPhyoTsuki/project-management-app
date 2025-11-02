import { z } from "zod";

export const UpdateWorkspaceSchema = z.object({
  id: z.string(),
  name: z
    .string()
    .min(1, "Workspace name is required")
    .max(50, "Workspace name must be at most 50 characters"),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .optional()
    .nullable(),
});

export type UpdateWorkspaceType = z.infer<typeof UpdateWorkspaceSchema>;
