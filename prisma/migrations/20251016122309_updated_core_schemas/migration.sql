/*
  Warnings:

  - The `role` column on the `board_member` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `workspace_member` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('OWNER', 'ADMIN', 'MEMBER', 'VIEWER');

-- CreateEnum
CREATE TYPE "ResourceType" AS ENUM ('WORKSPACE', 'BOARD');

-- AlterTable
ALTER TABLE "board_member" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'MEMBER';

-- AlterTable
ALTER TABLE "workspace_member" DROP COLUMN "role",
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'MEMBER';

-- DropEnum
DROP TYPE "public"."BoardRole";

-- DropEnum
DROP TYPE "public"."WorkspaceRole";

-- CreateTable
CREATE TABLE "ShareableLink" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "resourceType" "ResourceType" NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'VIEWER',
    "expiresAt" TIMESTAMP(3),
    "maxUses" INTEGER,
    "useCount" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdById" TEXT NOT NULL,
    "boardId" TEXT,
    "workspaceId" TEXT,

    CONSTRAINT "ShareableLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ShareableLink_token_key" ON "ShareableLink"("token");

-- CreateIndex
CREATE INDEX "ShareableLink_token_idx" ON "ShareableLink"("token");

-- AddForeignKey
ALTER TABLE "ShareableLink" ADD CONSTRAINT "ShareableLink_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShareableLink" ADD CONSTRAINT "ShareableLink_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShareableLink" ADD CONSTRAINT "ShareableLink_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;
