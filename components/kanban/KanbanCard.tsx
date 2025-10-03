"use client";

import { useDraggable } from "@dnd-kit/core";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EditJobDialog } from "@/components/modals/EditJobDialog";
import { ConfirmDelete } from "@/components/ConfirmDelete";
import { Job } from "@/lib/types";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

export function KanbanCard({ job }: { job: Job }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: job.id });
  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={isDragging ? "opacity-70" : undefined}
    >
      <Card className="cursor-grab p-3">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/dashboard/jobs/${job.id}`} className="block">
            <div className="text-sm font-medium">{job.title}</div>
            <div className="text-xs text-gray-500">{job.company}</div>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-7 w-7"
                aria-label="Actions"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <EditJobDialog
                job={job}
                trigger={
                  <DropdownMenuItem>
                    <Pencil className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                }
              />
              <DropdownMenuSeparator />
              <ConfirmDelete
                onConfirm={async () => {
                  await fetch(`/api/jobs/${job.id}`, { method: "DELETE" });
                  if (typeof window !== "undefined") window.location.reload();
                }}
              >
                <DropdownMenuItem className="group cursor-pointer">
                  <Trash2 className="mr-2 h-4 w-4 text-red-600 group-data-[highlighted]:text-red-700" />
                  <span className="text-red-600 group-data-[highlighted]:text-red-700">
                    Delete
                  </span>
                </DropdownMenuItem>
              </ConfirmDelete>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </Card>
    </div>
  );
}
