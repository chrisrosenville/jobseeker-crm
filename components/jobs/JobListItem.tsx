"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Building2, Calendar, ExternalLink } from "lucide-react";
import { JOB_STATUS_LABELS } from "@/lib/types";
import { JobApplication } from "@prisma/client";
import { KanbanCardOptions } from "../kanban/KanbanCardOptions";

export function JobListItem({ job }: { job: JobApplication }) {
  const getStatusColor = (status: JobApplication["status"]) => {
    switch (status) {
      case "APPLIED":
        return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
      case "INTERVIEW":
        return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
      case "OFFER":
        return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800";
      case "REJECTED":
        return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800";
      default:
        return "";
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toISOString().split("T")[0];
  };

  return (
    <div className="rounded border p-4 text-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 mb-2">
            <div className="flex-1 min-w-0">
              <Link
                href={`/dashboard/jobs/${job.id}`}
                className="block hover:underline"
              >
                <div className="font-medium text-base leading-tight mb-1">
                  {job.title}
                </div>
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <Building2 className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{job.company}</span>
                </div>
              </Link>
              <div className="flex items-center gap-4 flex-wrap">
                <Badge
                  variant="outline"
                  className={`text-xs ${getStatusColor(
                    job.status as JobApplication["status"]
                  )}`}
                >
                  {JOB_STATUS_LABELS[job.status as JobApplication["status"]]}
                </Badge>
                {job.dateApplied && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    <span className="text-xs">
                      {formatDate(job.dateApplied as Date)}
                    </span>
                  </div>
                )}
                {job.salary && (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <span className="text-xs">{job.salary}</span>
                  </div>
                )}
                {job.link && (
                  <a
                    href={job.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-primary hover:underline text-xs"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>View posting</span>
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        <KanbanCardOptions job={job} />
      </div>
    </div>
  );
}
