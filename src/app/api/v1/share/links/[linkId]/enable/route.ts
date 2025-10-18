import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

// POST /api/v1/share/links/:linkId/enable - Enable a shareable link
export async function POST(
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

    const updatedLink = await prisma.shareableLink.update({
      where: { id: linkId },
      data: { isActive: true },
    });

    return Response.json({
      success: true,
      data: updatedLink,
      message: "Shareable link enabled successfully",
    });
  } catch (error) {
    console.error("Enable shareable link error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
