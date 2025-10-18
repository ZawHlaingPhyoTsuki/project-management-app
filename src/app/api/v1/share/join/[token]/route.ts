import type { NextRequest } from "next/server";
import prisma from "@/lib/db";

// GET /api/v1/share/join/:token - Get a shareable link
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await params;

    // Check if the shareable link exists
    const shareableLink = await prisma.shareableLink.findFirst({
      where: {
        token,
        isActive: true,
        OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
      },
      include: {
        workspace: {
          select: {
            id: true,
            name: true,
            description: true,
            createdBy: {
              select: { id: true, name: true, email: true, image: true },
            },
          },
        },
        board: {
          select: {
            id: true,
            name: true,
            description: true,
            workspace: {
              select: { id: true, name: true },
            },
            createdBy: {
              select: { id: true, name: true, email: true, image: true },
            },
          },
        },
        createdBy: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
    });

    if (!shareableLink) {
      return Response.json(
        {
          error: "Invalid, expired, or disabled invitation link",
        },
        { status: 404 },
      );
    }

    // Check usage limits
    if (
      shareableLink.maxUses &&
      shareableLink.useCount >= shareableLink.maxUses
    ) {
      return Response.json(
        {
          error: "Invitation link has reached maximum uses",
        },
        { status: 400 },
      );
    }

    // Return public information about the resource
    const responseData = {
      id: shareableLink.id,
      token: shareableLink.token,
      resourceType: shareableLink.resourceType,
      role: shareableLink.role,
      expiresAt: shareableLink.expiresAt,
      maxUses: shareableLink.maxUses,
      useCount: shareableLink.useCount,
      createdBy: shareableLink.createdBy,
      resource:
        shareableLink.resourceType === "WORKSPACE"
          ? {
              type: "workspace" as const,
              id: shareableLink.workspace?.id,
              name: shareableLink.workspace?.name,
              description: shareableLink.workspace?.description,
              createdBy: shareableLink.workspace?.createdBy,
            }
          : {
              type: "board" as const,
              id: shareableLink.board?.id,
              name: shareableLink.board?.name,
              description: shareableLink.board?.description,
              workspace: shareableLink.board?.workspace,
              createdBy: shareableLink.board?.createdBy,
            },
    };

    return Response.json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error("Get shareable link details error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
