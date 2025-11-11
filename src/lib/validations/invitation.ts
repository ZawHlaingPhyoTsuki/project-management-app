import z from "zod";

export const SendInvitationSchema = z.object({})

export type SendInvitationType = z.infer<typeof SendInvitationSchema>;
