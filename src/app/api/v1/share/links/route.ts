import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { can } from "@/lib/permissions";
import { generateToken } from "@/lib/utils";
import {
  CreateShareLinkSchema,
  GetShareLinksSchema,
} from "@/validations/share-link";
import { Action, Resource } from "@/types/permission";
import type { Prisma } from "../../../../../../prisma/generated/client";

// GET /api/v1/share/links - Get all shareable links
export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user || !session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);

    // Validation
    const validationResult = GetShareLinksSchema.safeParse({
      resourceType: searchParams.get("resourceType"),
      resourceId: searchParams.get("resourceId"),
    });
    if (!validationResult.success) {
      return Response.json(
        { error: "Invalid parameters", details: validationResult.error.issues },
        { status: 400 },
      );
    }

    const { resourceType, resourceId } = validationResult.data;

    const where: Prisma.ShareableLinkWhereInput = {
      createdById: session.user.id,
    };

    if (resourceType) {
      where.resourceType = resourceType;
    }

    if (resourceId) {
      where.OR = [{ workspaceId: resourceId }, { boardId: resourceId }];
    }

    const shareableLinks = await prisma.shareableLink.findMany({
      where,
      include: {
        workspace: {
          select: { id: true, name: true },
        },
        board: {
          select: { id: true, name: true, workspaceId: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const linksWithUrls = shareableLinks.map((link) => ({
      ...link,
      shareUrl: `${process.env.NEXTAUTH_URL}/join/${link.token}`,
    }));

    return Response.json({ success: true, data: linksWithUrls });
  } catch (_error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/v1/share/links - Create a new share link
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user || !session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    // Validation
    const validationResult = CreateShareLinkSchema.safeParse(body);
    if (!validationResult.success) {
      return Response.json(
        {
          error: "Invalid request data",
          details: validationResult.error.issues,
        },
        { status: 400 },
      );
    }

    const { resourceType, resourceId, role, expiresInDays, maxUses } =
      validationResult.data;

    let resource: Resource;
    const permissionAction: Action = Action.INVITE;

    if (resourceType === "WORKSPACE") {
      resource = Resource.WORKSPACE;

      const workspaceMember = await prisma.workspaceMember.findFirst({
        where: {
          workspaceId: resourceId,
          userId: session.user.id,
        },
      });

      if (!workspaceMember) {
        return Response.json({ error: "Workspace not found" }, { status: 404 });
      }

      if (!can(workspaceMember.role, resource, permissionAction)) {
        return Response.json(
          { error: "Insufficient permissions" },
          { status: 403 },
        );
      }
    } else if (resourceType === "BOARD") {
      resource = Resource.BOARD;

      const boardMember = await prisma.boardMember.findFirst({
        where: {
          boardId: resourceId,
          userId: session.user.id,
        },
        include: { board: true },
      });

      if (!boardMember) {
        return Response.json({ error: "Board not found" }, { status: 404 });
      }

      if (!can(boardMember.role, resource, permissionAction)) {
        return Response.json(
          { error: "Insufficient permissions" },
          { status: 403 },
        );
      }
    } else {
      return Response.json({ error: "Invalid resource type" }, { status: 400 });
    }

    const token = generateToken(32);
    const expiresAt = expiresInDays
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
      : null;

    const shareableLink = await prisma.shareableLink.create({
      data: {
        token,
        resourceType,
        workspaceId: resourceType === "WORKSPACE" ? resourceId : null,
        boardId: resourceType === "BOARD" ? resourceId : null,
        role,
        createdById: session.user.id,
        expiresAt,
        maxUses,
      },
    });

    const shareUrl = `${process.env.NEXTAUTH_URL}/join/${token}`;

    return Response.json({
      success: true,
      data: {
        id: shareableLink.id,
        token: shareableLink.token,
        shareUrl,
        expiresAt: shareableLink.expiresAt,
        maxUses: shareableLink.maxUses,
      },
    });
  } catch (error) {
    console.error("Create shareable link error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
