"use client";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CreateTaskSchema, CreateTaskType } from "@/validations/task";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group";

interface CreateTaskFormProps {
  defaultValues?: Partial<CreateTaskType>;
  onSubmit: (data: CreateTaskType) => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
  cancelButtonText?: string;
  onCancel?: () => void;
  showCancel?: boolean;
}

export function CreateTaskForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
  submitButtonText = "Create Task",
  cancelButtonText = "Cancel",
  onCancel,
  showCancel = true,
}: CreateTaskFormProps) {
  const form = useForm<CreateTaskType>({
    resolver: zodResolver(CreateTaskSchema),
    defaultValues: {
      title: "",
      description: "",
      ...defaultValues,
    },
  });

  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FieldGroup>
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="task-title">Task Title</FieldLabel>
              <Input
                {...field}
                id="task-title"
                aria-invalid={fieldState.invalid}
                placeholder="Enter task title"
                autoComplete="off"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="description"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="task-description">
                Description (optional)
              </FieldLabel>
              <InputGroup>
                <InputGroupTextarea
                  {...field}
                  id="task-description"
                  placeholder="Enter task description"
                  rows={3}
                  className="min-h-24 resize-none"
                  aria-invalid={fieldState.invalid}
                />
                <InputGroupAddon align="block-end">
                  <InputGroupText className="tabular-nums">
                    {field.value?.length || 0}/100 characters
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex gap-2 justify-end">
        {showCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {cancelButtonText}
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : submitButtonText}
        </Button>
      </div>
    </form>
  );
}
