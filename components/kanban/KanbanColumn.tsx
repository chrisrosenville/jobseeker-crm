"use client";

import { useDroppable } from "@dnd-kit/core";
import { JOB_STATUS_LABELS, JobStatus, Job } from "@/lib/types";
import { KanbanCard } from "./KanbanCard";

export function KanbanColumn({
  status,
  jobs,
}: {
  status: JobStatus;
  jobs: Job[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-[200px] flex-col gap-2 rounded-lg border bg-white p-3 ${
        isOver ? "ring-2 ring-black" : ""
      }`}
    >
      <div className="mb-2 text-sm font-semibold">
        {JOB_STATUS_LABELS[status]}
      </div>
      {jobs.length === 0 ? (
        <div className="text-xs text-gray-400">No items</div>
      ) : (
        jobs.map((job) => <KanbanCard key={job.id} job={job} />)
      )}
    </div>
  );
}
