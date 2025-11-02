"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  isPending?: boolean;
  // For type-to-confirm functionality
  requireConfirmation?: boolean;
  confirmationText?: string;
  expectedText?: string;
}

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  title,
  description,
  confirmText = "Delete",
  cancelText = "Cancel",
  isPending = false,
  requireConfirmation = false,
  confirmationText = "",
  expectedText = "",
}: DeleteConfirmationDialogProps) {
  const [inputValue, setInputValue] = useState("");

  const isConfirmDisabled = requireConfirmation
    ? inputValue !== expectedText || isPending
    : isPending;

  const handleConfirm = () => {
    onConfirm();
    if (requireConfirmation) {
      setInputValue(""); // Reset input after confirmation
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>

        {requireConfirmation && (
          <div className="space-y-2">
            <Label htmlFor="confirm-delete-input">{confirmationText}</Label>
            <Input
              id="confirm-delete-input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={expectedText}
              className="mt-2"
            />
          </div>
        )}

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              variant="destructive"
              onClick={handleConfirm}
              disabled={isConfirmDisabled}
              className="text-white"
            >
              {isPending ? "Deleting..." : confirmText}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
