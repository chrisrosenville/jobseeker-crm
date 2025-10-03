"use client";

import { useMemo } from "react";
import { Job } from "@/lib/types";
import { AddJobDialog } from "@/components/modals/AddJobDialog";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { useJobs } from "@/hooks/useJobs";

export function BoardSection({ initialJobs }: { initialJobs: Job[] }) {
  const { data: jobs = [] } = useJobs({ initialData: initialJobs });

  const stats = useMemo(() => {
    return {
      total: jobs.length,
      applied: jobs.filter((j) => j.status === "APPLIED").length,
      interview: jobs.filter((j) => j.status === "INTERVIEW").length,
      offer: jobs.filter((j) => j.status === "OFFER").length,
    };
  }, [jobs]);

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
      <KanbanBoard jobs={jobs} />
    </div>
  );
}
