import path from "node:path";
import dotenv from "dotenv";
import type { PrismaConfig } from "prisma";

dotenv.config();

export default {
  schema: path.join("prisma", "schema"),
  migrations: {
    path: path.join("prisma", "migrations"),
    seed: "bun run prisma/seed.ts",
  },
} satisfies PrismaConfig;
