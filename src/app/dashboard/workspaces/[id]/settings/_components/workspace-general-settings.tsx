"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Edit, Save, X } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  UpdateWorkspaceSchema,
  type UpdateWorkspaceType,
} from "@/lib/validations/workspace";
import { useUpdateWorkspace } from "@/data/workspaces/mutations";

interface WorkspaceGeneralSettingsProps {
  workspace: {
    id: string;
    name: string;
    description?: string | null;
  };
}

export default function WorkspaceGeneralSettings({
  workspace,
}: WorkspaceGeneralSettingsProps) {
  const { mutateAsync: updateWorkspace, isPending: isUpdating } =
    useUpdateWorkspace();

  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<UpdateWorkspaceType>({
    resolver: zodResolver(UpdateWorkspaceSchema),
    defaultValues: {
      id: workspace.id,
      name: workspace?.name || "",
      description: workspace?.description || "",
    },
    values: {
      id: workspace.id,
      name: workspace.name || "",
      description: workspace.description || "",
    },
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    form.reset({
      id: workspace.id,
      name: workspace?.name || "",
      description: workspace?.description || "",
    });
    setIsEditing(false);
  };

  const onSubmit = async (data: UpdateWorkspaceType) => {
    try {
      const result = await updateWorkspace(data);

      if (result.success) {
        setIsEditing(false);
        toast.success("Workspace updated successfully");
        // The revalidatePath in the server action will refresh the page data
      } else {
        toast.error(result.error || "Failed to update workspace");
      }
    } catch (error) {
      console.error("Error updating workspace:", error);
      toast.error("Something went wrong");
    }
  };

  if (!workspace) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            Workspace not found
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div className="flex flex-col items-start gap-2">
          <CardTitle>General Settings</CardTitle>
          <CardDescription>
            Manage your workspace name and description
          </CardDescription>
        </div>
        {!isEditing ? (
          <Button
            variant="outline"
            size="icon"
            onClick={handleEdit}
            disabled={isUpdating}
          >
            <Edit className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            variant="destructive"
            size="icon"
            onClick={handleCancel}
            disabled={isUpdating}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <form
          id="workspace-settings-form"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup>
            <input type="hidden" {...form.register("id")} />

            {/* Workspace Name Field */}
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="workspace-name">
                    Workspace Name
                  </FieldLabel>
                  <Input
                    {...field}
                    id="workspace-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Enter workspace name"
                    disabled={!isEditing || isUpdating}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Description Field */}
            <Controller
              name="description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="workspace-description">
                    Description{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </FieldLabel>
                  <Textarea
                    {...field}
                    value={field.value || ""}
                    id="workspace-description"
                    placeholder="Enter workspace description"
                    rows={4}
                    className="min-h-24 resize-none"
                    aria-invalid={fieldState.invalid}
                    disabled={!isEditing || isUpdating}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        {/* Action Buttons */}
        {isEditing && (
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              form="workspace-settings-form"
              disabled={isUpdating || !form.formState.isDirty}
            >
              <Save className="h-4 w-4" />
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
