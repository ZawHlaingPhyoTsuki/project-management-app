import { IconCloud } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

interface EmptySectionProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  showButton?: boolean;
  buttonText?: string;
  onClick?: () => void;
}

export default function EmptySection({
  title,
  description,
  icon,
  showButton = false,
  buttonText,
  onClick,
}: EmptySectionProps) {
  return (
    <Empty className="border border-dashed">
      <EmptyHeader>
        <EmptyMedia variant="icon">{icon || <IconCloud />}</EmptyMedia>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        {showButton && (
          <Button onClick={onClick} variant="outline" size="sm">
            {buttonText}
          </Button>
        )}
      </EmptyContent>
    </Empty>
  );
}
