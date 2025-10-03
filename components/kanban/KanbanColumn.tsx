"use client";

import { useDroppable } from "@dnd-kit/core";
import { JOB_STATUS_LABELS, JobStatus, Job } from "@/lib/types";
import { KanbanCard } from "./KanbanCard";

export function KanbanColumn({
  status,
  jobs,
  activeId,
}: {
  status: JobStatus;
  jobs: Job[];
  activeId?: string | null;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={`flex min-h-[240px] flex-col rounded-lg border bg-card/70 p-0 overflow-hidden transition shadow-xs ${
        isOver ? "ring-2 ring-primary/40" : ""
      }`}
    >
      <div
        className={`sticky top-0 z-[1] flex items-center justify-between border-b px-3 py-2 text-xs font-semibold tracking-wide uppercase ${
          status === "APPLIED"
            ? "text-muted-foreground"
            : status === "INTERVIEW"
            ? "text-blue-600"
            : status === "OFFER"
            ? "text-green-600"
            : "text-red-600"
        }`}
      >
        {JOB_STATUS_LABELS[status]}
        <span className="text-[10px] font-medium text-muted-foreground">
          {jobs.length}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        {jobs.length === 0 ? (
          <div className="text-xs text-muted-foreground">No items</div>
        ) : (
          jobs.map((job) => (
            <KanbanCard
              key={job.id}
              job={job}
              isDraggingGhost={activeId === job.id}
            />
          ))
        )}
      </div>
    </div>
  );
}
