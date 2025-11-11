"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { UpdateTaskListSchema, UpdateTaskListType } from "@/validations/task";
import { toast } from "sonner";

interface InlineEditableTitleProps {
  title: string;
  taskListId: string;
  boardId: string;
  onSave: (data: {
    title: string;
    taskListId: string;
    boardId: string;
  }) => Promise<void> | void;
  isSaving?: boolean;
  className?: string;
}

export function InlineEditableTitle({
  title,
  taskListId,
  boardId,
  onSave,
  isSaving = false,
  className = "",
}: InlineEditableTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const form = useForm<UpdateTaskListType>({
    resolver: zodResolver(UpdateTaskListSchema),
    defaultValues: {
      title: title,
    },
  });

  // Define handleFormSubmit first using useCallback
  const handleFormSubmit = useCallback(
    async (data: UpdateTaskListType) => {
      if (data.title.trim() === title) {
        setIsEditing(false);
        return;
      }

      try {
        await onSave({
          title: data.title.trim(),
          taskListId,
          boardId,
        });
        setIsEditing(false);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        toast.error(error?.error || "Failed to update task list");
      }
    },
    [title, taskListId, boardId, onSave]
  );

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // Handle click outside to save
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        form.handleSubmit(handleFormSubmit)();
      }
    };

    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isEditing, form, handleFormSubmit]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      form.handleSubmit(handleFormSubmit)();
    } else if (e.key === "Escape") {
      form.reset({ title });
      setIsEditing(false);
    }
  };

  const startEditing = () => {
    if (!isSaving) {
      setIsEditing(true);
      form.reset({ title });
    }
  };

  if (isEditing) {
    return (
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="w-full">
        <FieldGroup>
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid} className="w-full mb-0">
                <Input
                  {...field}
                  ref={inputRef}
                  onKeyDown={handleKeyDown}
                  disabled={isSaving}
                  aria-invalid={fieldState.invalid}
                  className={cn(
                    "text-lg font-semibold h-7 px-2 py-1 w-full",
                    "focus-visible:ring-2 focus-visible:ring-ring",
                    className
                  )}
                  placeholder="Enter task list name..."
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
      </form>
    );
  }

  return (
    <div
      onClick={startEditing}
      className={cn(
        "text-lg font-semibold cursor-text hover:bg-accent hover:text-accent-foreground px-2 py-1 rounded transition-colors",
        "select-none min-w-0 flex-1 truncate",
        "border border-transparent hover:border-border",
        className
      )}
      title="Click to edit"
    >
      {title}
    </div>
  );
}
