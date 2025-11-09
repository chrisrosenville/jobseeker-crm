"use client";

import { useDraggable } from "@dnd-kit/core";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { JobApplication } from "@prisma/client";
import { KanbanCardOptions } from "./KanbanCardOptions";

export function KanbanCard({
  job,
}: {
  job: JobApplication;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: job.id });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        transition: "none",
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? "opacity-0" : undefined}
    >
      <Card
        className="p-3 transition shadow-xs hover:shadow-sm hover:bg-accent/30 cursor-grab active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2">
            <Link 
              href={`/dashboard/jobs/${job.id}`} 
              className="block"
              onPointerDown={(e) => e.stopPropagation()}
            >
              <div className="text-sm font-medium leading-5">{job.title}</div>
              <div className="text-xs text-muted-foreground">{job.company}</div>
            </Link>
          </div>
          <div onPointerDown={(e) => e.stopPropagation()}>
            <KanbanCardOptions job={job} />
          </div>
        </div>
      </Card>
    </div>
  );
}
