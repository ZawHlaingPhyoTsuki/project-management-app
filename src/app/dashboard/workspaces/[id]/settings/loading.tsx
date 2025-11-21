import DashboardContentWrapper from '@/components/shared/dashboard-content-wrapper'
import { Spinner } from '@/components/ui/spinner';

export default function LoadingPage() {
  return (
    <DashboardContentWrapper
      title="Workspace Settings"
      description="Manage your workspaces and collaborate with your team"
    >
      <div className="flex w-full h-full min-h-[400px] items-center justify-center">
        <Spinner className="w-8 h-8" />
      </div>
    </DashboardContentWrapper>
  );
}
