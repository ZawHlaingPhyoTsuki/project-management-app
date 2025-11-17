import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

// GET /api/v1/share/links/:linkId - Get a shareable link
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ linkId: string }> },
) {
  try {
    const { linkId } = await params;

    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user || !session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const shareableLink = await prisma.shareableLink.findFirst({
      where: {
        id: linkId,
        createdById: session.user.id,
      },
      include: {
        workspace: {
          select: { id: true, name: true },
        },
        board: {
          select: { id: true, name: true },
        },
      },
    });

    if (!shareableLink) {
      return Response.json(
        { error: "Shareable link not found" },
        { status: 404 },
      );
    }

    const shareUrl = `${process.env.NEXTAUTH_URL}/join/${shareableLink.token}`;

    return Response.json({
      success: true,
      data: {
        ...shareableLink,
        shareUrl,
      },
    });
  } catch (_error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/v1/share/links/:linkId - Delete a shareable link
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ linkId: string }> },
) {
  try {
    const { linkId } = await params;

    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user || !session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const shareableLink = await prisma.shareableLink.findFirst({
      where: {
        id: linkId,
        createdById: session.user.id,
      },
    });

    if (!shareableLink) {
      return Response.json(
        { error: "Shareable link not found" },
        { status: 404 },
      );
    }

    await prisma.shareableLink.delete({
      where: { id: linkId },
    });

    return Response.json({ success: true, message: "Shareable link deleted" });
  } catch (_error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
