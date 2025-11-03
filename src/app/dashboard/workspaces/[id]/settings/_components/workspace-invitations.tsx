"use client";

import { Copy, MoreVertical, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Invitation {
  id: string;
  email: string;
  role: "ADMIN" | "MEMBER" | "VIEWER";
  status: "PENDING" | "ACCEPTED" | "DECLINED" | "EXPIRED";
  expiresAt: string;
  invitedBy: string;
}

export default function WorkspaceInvitations() {
  const invitations: Invitation[] = [
    {
      id: "1",
      email: "alice@example.com",
      role: "MEMBER",
      status: "PENDING",
      expiresAt: "2024-12-31",
      invitedBy: "John Doe",
    },
    {
      id: "2",
      email: "bob@example.com",
      role: "VIEWER",
      status: "PENDING",
      expiresAt: "2024-12-31",
      invitedBy: "Jane Smith",
    },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "PENDING":
        return "secondary";
      case "ACCEPTED":
        return "default";
      case "DECLINED":
        return "destructive";
      case "EXPIRED":
        return "outline";
      default:
        return "outline";
    }
  };

  const handleCopyInviteLink = () => {
    // TODO: Implement copy invite link logic
    navigator.clipboard.writeText(
      "https://app.example.com/invite/workspace-token",
    );
  };

  const handleCancelInvitation = (invitationId: string) => {
    // TODO: Implement cancel invitation logic
    console.log(`Cancel invitation ${invitationId}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pending Invitations</CardTitle>
        <CardDescription>
          Manage pending invitations to your workspace
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {invitations.map((invitation) => (
            <div
              key={invitation.id}
              className="flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div>
                  <div className="font-medium">{invitation.email}</div>
                  <div className="text-sm text-muted-foreground">
                    Invited by {invitation.invitedBy} • Expires{" "}
                    {invitation.expiresAt}
                  </div>
                </div>
                <Badge variant={getStatusVariant(invitation.status)}>
                  {invitation.status}
                </Badge>
                <Badge variant="outline">{invitation.role}</Badge>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopyInviteLink}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => handleCancelInvitation(invitation.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Cancel Invitation
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}

          {invitations.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              No pending invitations
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
