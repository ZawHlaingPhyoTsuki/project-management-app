import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

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

    const invitation = await prisma.invitation.findFirst({
      where: {
        token,
        status: "PENDING",
        expiresAt: { gt: new Date() },
      },
      include: {
        workspace: true,
        board: true,
        invitedBy: true,
      },
    });

    if (!invitation) {
      return Response.json(
        {
          error: "Invalid, expired, or already used invitation",
        },
        { status: 404 },
      );
    }

    if (invitation.email !== session.user.email) {
      return Response.json(
        {
          error: "This invitation was sent to a different email address",
        },
        { status: 403 },
      );
    }

    if (
      invitation.resourceType === "WORKSPACE" &&
      invitation.workspace &&
      invitation.workspaceId
    ) {
      await prisma.workspaceMember.upsert({
        where: {
          workspaceId_userId: {
            workspaceId: invitation.workspaceId,
            userId: session.user.id,
          },
        },
        update: { role: invitation.role },
        create: {
          workspaceId: invitation.workspaceId,
          userId: session.user.id,
          role: invitation.role,
        },
      });
    } else if (
      invitation.resourceType === "BOARD" &&
      invitation.board &&
      invitation.boardId
    ) {
      await prisma.boardMember.upsert({
        where: {
          boardId_userId: {
            boardId: invitation.boardId,
            userId: session.user.id,
          },
        },
        update: { role: invitation.role },
        create: {
          boardId: invitation.boardId,
          userId: session.user.id,
          role: invitation.role,
        },
      });
    } else {
      return Response.json({ error: "Invalid resource" }, { status: 400 });
    }

    await prisma.invitation.update({
      where: { id: invitation.id },
      data: { status: "ACCEPTED" },
    });

    return Response.json({
      success: true,
      data: {
        resourceType: invitation.resourceType,
        resourceId: invitation.workspaceId || invitation.boardId,
        resourceName: invitation.workspace?.name || invitation.board?.name,
        role: invitation.role,
      },
    });
  } catch (error) {
    console.error("Accept invitation error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
