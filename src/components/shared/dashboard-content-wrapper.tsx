interface DashboardContentWrapperProps {
  children: React.ReactNode;
  title: string;
  description: string;
  ActionButton?: React.ReactNode;
}

export default function DashboardContentWrapper({
  children,
  title,
  description,
  ActionButton,
}: DashboardContentWrapperProps) {
  return (
    <div className="flex flex-1 flex-col p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-muted-foreground mt-1">{description}</p>
        </div>
        {ActionButton}
      </div>

      <div className="space-y-8">{children}</div>
    </div>
  );
}
