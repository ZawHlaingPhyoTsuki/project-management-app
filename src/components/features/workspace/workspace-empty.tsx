"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useWorkspaceStore } from "@/stores/workspace";

export default function BoardEmpty() {
  const { setIsWorkspaceModalOpen } = useWorkspaceStore();

  return (
    <Card className="text-center py-12">
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          <Button
            className="rounded-full py-2"
            variant="secondary"
            size="icon"
            onClick={() => setIsWorkspaceModalOpen(true)}
          >
            <Plus className="h-6 w-6 text-muted-foreground" />
          </Button>
          <div>
            <h3 className="font-semibold text-lg">No workspaces yet</h3>
            <p className="text-muted-foreground mt-1">
              Create your first workspace to get started
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
