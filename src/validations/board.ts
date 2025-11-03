import { z } from "zod";

export const CreateBoardSchema = z.object({
  name: z
    .string()
    .min(1, "Board name is required")
    .max(100, "Board name is too long"),
  description: z.string().max(500, "Description is too long").optional(),
  workspaceId: z.string().min(1, "Workspace ID is required"),
});

export type CreateBoardType = z.infer<typeof CreateBoardSchema>;
