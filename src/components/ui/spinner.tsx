import { Loader2Icon } from "lucide-react";
import { cn } from "@/lib/utils";

function Spinner({ className, ...props }: React.ComponentProps<"output">) {
  return (
    <output aria-label="Loading" {...props}>
      <Loader2Icon className={cn("size-4 animate-spin", className)} />
    </output>
  );
}

export { Spinner };
