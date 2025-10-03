"use client";

import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { useEffect, useMemo, useState } from "react";
import { JOB_STATUS_ORDER, Job, JobStatus } from "@/lib/types";
import { KanbanColumn } from "./KanbanColumn";

async function updateJobStatus(id: string, status: JobStatus) {
  await fetch(`/api/jobs/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  });
}

export function KanbanBoard({
  initialJobs = [] as Job[],
  onChange,
}: {
  initialJobs?: Job[];
  onChange?: (jobs: Job[]) => void;
}) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs);

  useEffect(() => {
    if (initialJobs.length === 0) {
      fetch("/api/jobs")
        .then((r) => r.json())
        .then((data: Job[]) => setJobs(data));
    }
  }, [initialJobs]);

  useEffect(() => {
    onChange?.(jobs);
  }, [jobs, onChange]);

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

  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const targetStatus = over.id as JobStatus;
    const id = active.id as string;

    setJobs((prev) =>
      prev.map((j) => (j.id === id ? { ...j, status: targetStatus } : j))
    );
    updateJobStatus(id, targetStatus).catch(() => {
      // revert on failure - refetch
      fetch("/api/jobs")
        .then((r) => r.json())
        .then((data: Job[]) => setJobs(data));
    });
  };

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {JOB_STATUS_ORDER.map((status) => (
          <KanbanColumn key={status} status={status} jobs={columns[status]} />
        ))}
      </div>
    </DndContext>
  );
}
