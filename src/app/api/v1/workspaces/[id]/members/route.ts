import { headers } from "next/headers";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";
import { can } from "@/lib/permissions";
import resend from "@/lib/resend";
import { generateToken } from "@/lib/utils";
import { Action, Resource } from "@/types/permission";

// GET /api/v1/workspaces/:id/members - Get all members of a workspace
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Check Authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user || !session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Find Workspace belonging to logged in user
    const workspaceMember = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId: id,
        userId: session.user.id,
      },
    });

    if (!workspaceMember) {
      return Response.json({ error: "Workspace not found" }, { status: 404 });
    }

    // Find All Members belonging to workspace
    const members = await prisma.workspaceMember.findMany({
      where: { workspaceId: id },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
      },
      orderBy: { role: "asc" },
    });

    return Response.json({ success: true, data: members });
  } catch (_error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/v1/workspaces/:id/members - Invite a member to a workspace
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // Check Authentication
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user || !session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Find Workspace belonging to logged in user
    const workspaceMember = await prisma.workspaceMember.findFirst({
      where: {
        workspaceId: id,
        userId: session.user.id,
      },
    });

    // Check Permissions
    if (
      !workspaceMember ||
      !can(workspaceMember.role, Resource.WORKSPACE, Action.INVITE)
    ) {
      return Response.json(
        { error: "Insufficient permissions" },
        { status: 403 },
      );
    }

    // Invite User
    const { email, role } = await req.json();
    const workspace = await prisma.workspace.findUnique({
      where: { id: id },
    });

    if (!workspace) {
      return Response.json({ error: "Workspace not found" }, { status: 404 });
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: {
        workspaceMembers: {
          where: { workspaceId: id },
        },
      },
    });

    if (existingUser) {
      // Check if user is already a member
      if (existingUser.workspaceMembers.length > 0) {
        return Response.json(
          { error: "User is already a member" },
          { status: 400 },
        );
      }

      // Add existing user to workspace
      await prisma.workspaceMember.create({
        data: {
          workspaceId: id,
          userId: existingUser.id,
          role,
        },
      });

      // Send notification email
      await resend.emails.send({
        from: "your-app@resend.dev",
        to: email,
        subject: `You've been added to ${workspace.name}`,
        html: `
          <h2>Welcome to ${workspace.name}!</h2>
          <p>You've been added as a ${role.toLowerCase()} to the workspace "${workspace.name}".</p>
          <p><a href="${process.env.NEXTAUTH_URL}/workspaces/${id}">Go to Workspace</a></p>
        `,
      });

      return Response.json({
        success: true,
        message: "User added to workspace",
      });
    }

    // User doesn't exist - create invitation
    const invitationToken = generateToken(32);
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await prisma.invitation.create({
      data: {
        token: invitationToken,
        email,
        role,
        resourceType: "WORKSPACE",
        workspaceId: id,
        invitedById: session.user.id,
        expiresAt,
      },
    });

    const invitationUrl = `${process.env.NEXTAUTH_URL}/auth/accept-invite?token=${invitationToken}`;

    await resend.emails.send({
      from: "your-app@resend.dev",
      to: email,
      subject: `Invitation to join ${workspace.name}`,
      html: `
        <h2>You're invited to join ${workspace.name}!</h2>
        <p>You've been invited by ${session.user.name} to join the workspace "${workspace.name}" as a ${role.toLowerCase()}.</p>
        <p><a href="${invitationUrl}">Accept Invitation</a></p>
        <p><small>This invitation will expire in 7 days.</small></p>
      `,
    });

    return Response.json({
      success: true,
      message: "Invitation sent successfully",
    });
  } catch (error) {
    console.error("Invite member error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
