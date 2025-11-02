import z from "zod";

export const CreateBoardSchema = z.object({
  workspaceId: z.string(),
  name: z.string(),
  description: z.string().optional().nullable(),
});

export type CreateBoardType = z.infer<typeof CreateBoardSchema>;
