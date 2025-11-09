"use client";

import { useMemo } from "react";
import { AddJobDialog } from "@/components/modals/AddJobDialog";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { useJobApplications } from "@/hooks/useJobs";

export function BoardSection() {
  const { data: jobApplications = [] } = useJobApplications();

  const stats = useMemo(() => {
    return {
      total: jobApplications.length,
      applied: jobApplications.filter((j) => j.status === "APPLIED").length,
      interview: jobApplications.filter((j) => j.status === "INTERVIEW").length,
      offer: jobApplications.filter((j) => j.status === "OFFER").length,
    };
  }, [jobApplications]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Your Applications</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {stats.total} total · {stats.applied} applied · {stats.interview}{" "}
            interviews · {stats.offer} offers
          </p>
        </div>
        <AddJobDialog />
      </div>
      <KanbanBoard jobApplications={jobApplications} />
    </div>
  );
}
