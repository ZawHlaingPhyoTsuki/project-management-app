"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBoardStore } from "@/store/use-board-store";

export default function BoardEmpty() {
  const { setIsBoardModalOpen } = useBoardStore();

  return (
    <Card className="text-center py-12">
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          <Button
            className="rounded-full py-2"
            variant="secondary"
            size="icon"
            onClick={() => setIsBoardModalOpen(true)}
          >
            <Plus className="h-6 w-6 text-muted-foreground" />
          </Button>
          <div>
            <h3 className="font-semibold text-lg">No boards yet</h3>
            <p className="text-muted-foreground mt-1">
              Create your first board to get started
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
