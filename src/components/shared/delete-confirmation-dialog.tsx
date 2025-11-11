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
import { Check, Copy } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DeleteConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  title: string;
  description: string | React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  isPending?: boolean;
  // For type-to-confirm functionality
  requireConfirmation?: boolean;
  expectedText?: string;
  loadingText?: string;
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
  expectedText = "",
  loadingText = "Deleting...",
}: DeleteConfirmationDialogProps) {
  const [inputValue, setInputValue] = useState("");
  const [copied, setCopied] = useState(false);

  const isConfirmDisabled = requireConfirmation
    ? inputValue !== expectedText || isPending
    : isPending;

  const handleConfirm = () => {
    onConfirm();
    if (requireConfirmation) {
      setInputValue(""); // Reset input after confirmation
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(expectedText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
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
            <div className="flex items-center justify-between">
              <Label
                htmlFor="confirm-delete-input"
                className="cursor-text select-text"
              >
                Type
                <Badge variant="secondary" className="text-md">
                  {expectedText}
                  <span
                    className="ml-1 cursor-pointer hover:opacity-70 transition-opacity"
                    onClick={copyToClipboard}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        copyToClipboard();
                      }
                    }}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </span>
                </Badge>
                to confirm.
              </Label>
            </div>
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
              {isPending ? loadingText : confirmText}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
