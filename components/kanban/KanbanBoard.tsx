"use client";

import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import { useMemo, useState } from "react";
import { JOB_STATUS_ORDER } from "@/lib/types";
import { KanbanColumn } from "./KanbanColumn";
import { useUpdateJobStatus } from "@/hooks/useJobs";
import { JobApplication } from "@prisma/client";

export function KanbanBoard({
  jobApplications,
}: {
  jobApplications: JobApplication[];
}) {
  const { mutateAsync: updateJobStatus } = useUpdateJobStatus();
  const [activeId, setActiveId] = useState<string | null>(null);

  const columns = useMemo(() => {
    const map: Record<JobApplication["status"], JobApplication[]> = {
      APPLIED: [],
      INTERVIEW: [],
      OFFER: [],
      GHOSTED: [],
      REJECTED: [],
    };
    for (const job of jobApplications) {
      map[job.status].push(job);
    }
    return map;
  }, [jobApplications]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    // Check if any dialog is currently open
    const hasOpenDialog =
      document.querySelector(
        '[data-slot="dialog-content"][data-state="open"]',
      ) !== null ||
      document.querySelector(
        '[data-slot="alert-dialog-content"][data-state="open"]',
      ) !== null;

    if (hasOpenDialog) {
      // Cancel the drag if a dialog is open
      return;
    }

    setActiveId(event.active.id as string);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const targetStatus = over.id as JobApplication["status"];
    const id = active.id as string;

    const jobApplication = jobApplications.find((j) => j.id === id);
    if (!jobApplication || !jobApplication.id) return;

    // Only update if status actually changed
    if (jobApplication.status !== targetStatus) {
      await updateJobStatus({ id, status: targetStatus });
    }
    setActiveId(null);
  };

  const activeJob = useMemo(
    () => jobApplications.find((j) => j.id === activeId) ?? null,
    [activeId, jobApplications],
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {JOB_STATUS_ORDER.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            jobs={columns[status]}
            activeId={activeId}
          />
        ))}
      </div>
      <DragOverlay dropAnimation={null}>
        {activeJob ? (
          <div className="pointer-events-none">
            <div className="rounded-md border bg-card p-3 shadow-sm">
              <div className="text-sm font-medium">{activeJob.title}</div>
              <div className="text-xs text-muted-foreground">
                {activeJob.company}
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
