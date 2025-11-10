"use client";

import { AddJobDialog } from "@/components/modals/AddJobDialog";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { useJobApplications } from "@/hooks/useJobs";
import { LoadingScreen } from "../LoadingScreen";

export function BoardSection() {
  const {
    data: jobApplications = [],
    isPending,
    isLoading,
  } = useJobApplications();

  if (isPending || isLoading) return <LoadingScreen />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Your Applications</h1>
          {jobApplications.length > 0 ? (
            <p className="text-muted-foreground mt-1 text-sm">
              {jobApplications.length} job applications in total.
            </p>
          ) : (
            <p className="text-muted-foreground mt-1 text-sm">
              You have not logged any jobs yet.
            </p>
          )}
        </div>
        <AddJobDialog />
      </div>
      {jobApplications.length > 0 && (
        <KanbanBoard jobApplications={jobApplications} />
      )}
    </div>
  );
}
