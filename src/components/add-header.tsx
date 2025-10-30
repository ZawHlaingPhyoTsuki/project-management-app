import { Label } from "@/components/ui/label";

interface AddHeaderProps {
  children?: React.ReactNode;
  title?: string;
}

export default function AddHeader({ children, title }: AddHeaderProps) {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center justify-between gap-2 border-b px-1.5 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) lg:px-3.5">
      <div className="flex items-center gap-1 lg:gap-2">
        <Label className="text-3xl font-bold tracking-tight">{title}</Label>
      </div>
      <div className="flex items-center gap-2">{children}</div>
    </header>
  );
}
