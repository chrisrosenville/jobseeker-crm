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
import { JOB_STATUS_ORDER, Job, JobStatus } from "@/lib/types";
import { KanbanColumn } from "./KanbanColumn";
import { useUpdateJobStatus } from "@/hooks/useJobs";

export function KanbanBoard({ jobs }: { jobs: Job[] }) {
  const updateStatus = useUpdateJobStatus();
  const [activeId, setActiveId] = useState<string | null>(null);

  const columns = useMemo(() => {
    const map: Record<JobStatus, Job[]> = {
      APPLIED: [],
      INTERVIEW: [],
      OFFER: [],
      REJECTED: [],
    };
    for (const job of jobs) {
      map[job.status].push(job);
    }
    return map;
  }, [jobs]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const targetStatus = over.id as JobStatus;
    const id = active.id as string;
    updateStatus.mutate({ id, status: targetStatus });
    if (typeof window !== "undefined") {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setActiveId(null));
      });
    } else {
      setActiveId(null);
    }
  };

  const activeJob = useMemo(
    () => jobs.find((j) => j.id === activeId) ?? null,
    [activeId, jobs]
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
