import * as z from "zod";
import { ResourceType, Role } from "@/types";

export const GetShareLinksSchema = z.object({
  resourceType: z.enum(ResourceType).optional(),
  resourceId: z.string().optional(),
});

export const CreateShareLinkSchema = z.object({
  resourceType: z.enum(ResourceType),
  resourceId: z.string().min(1, "Resource ID is required"),
  role: z.enum(Role).default(Role.VIEWER),
  expiresInDays: z.number().int().positive().optional().default(7),
  maxUses: z.number().int().positive().optional().nullable(),
});
