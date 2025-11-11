// src/hooks/shared/use-confirmation.ts
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface UseConfirmationProps<TVariables> {
  mutationFn: (
    variables: TVariables
  ) => Promise<{ success: boolean; error?: string }>;
  successMessage: string;
  errorMessage?: string;
  onSuccess?: () => void;
  refreshOnSuccess?: boolean;
  redirectOnSuccess?: string;
}

export function useConfirmation<TVariables>({
  mutationFn,
  successMessage,
  errorMessage = "Operation failed",
  onSuccess,
  refreshOnSuccess = true,
  redirectOnSuccess,
}: UseConfirmationProps<TVariables>) {
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const execute = async (variables: TVariables) => {
    setIsPending(true);
    try {
      const result = await mutationFn(variables);

      if (result.success) {
        toast.success(successMessage);
        setIsOpen(false);

        if (refreshOnSuccess) {
          router.refresh();
        }

        if (redirectOnSuccess) {
          router.push(redirectOnSuccess);
        }

        onSuccess?.();
      } else {
        toast.error("Error", {
          description: result.error || errorMessage,
        });
      }
    } catch (_error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsPending(false);
    }
  };

  return {
    isOpen,
    setIsOpen,
    execute,
    isPending,
  };
}
