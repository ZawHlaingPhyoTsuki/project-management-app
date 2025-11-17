import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

// POST /api/v1/share/join/:token/accept - Accept a shareable link
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params;

    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user || !session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const shareableLink = await prisma.shareableLink.findFirst({
      where: {
        token,
        isActive: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      include: {
        workspace: true,
        board: true,
      },
    });

    if (!shareableLink) {
      return Response.json(
        { error: "Invalid or expired invitation link" },
        { status: 404 },
      );
    }

    if (
      shareableLink.maxUses &&
      shareableLink.useCount >= shareableLink.maxUses
    ) {
      return Response.json(
        { error: "Invitation link has reached maximum uses" },
        { status: 400 },
      );
    }

    // let result;

    if (
      shareableLink.resourceType === "WORKSPACE" &&
      shareableLink.workspace &&
      shareableLink.workspaceId
    ) {
      await prisma.workspaceMember.upsert({
        where: {
          workspaceId_userId: {
            workspaceId: shareableLink.workspaceId,
            userId: session.user.id,
          },
        },
        update: { role: shareableLink.role },
        create: {
          workspaceId: shareableLink.workspaceId,
          userId: session.user.id,
          role: shareableLink.role,
        },
      });
    } else if (
      shareableLink.resourceType === "BOARD" &&
      shareableLink.board &&
      shareableLink.boardId
    ) {
      await prisma.boardMember.upsert({
        where: {
          boardId_userId: {
            boardId: shareableLink.boardId,
            userId: session.user.id,
          },
        },
        update: { role: shareableLink.role },
        create: {
          boardId: shareableLink.boardId,
          userId: session.user.id,
          role: shareableLink.role,
        },
      });
    } else {
      return Response.json({ error: "Invalid resource" }, { status: 400 });
    }

    await prisma.shareableLink.update({
      where: { id: shareableLink.id },
      data: { useCount: { increment: 1 } },
    });

    return Response.json({
      success: true,
      data: {
        resourceType: shareableLink.resourceType,
        resourceId: shareableLink.workspaceId || shareableLink.boardId,
        role: shareableLink.role,
      },
    });
  } catch (error) {
    console.error("Accept shareable link error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
