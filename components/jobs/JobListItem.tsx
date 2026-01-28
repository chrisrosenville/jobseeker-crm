"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Building2, Calendar, ExternalLink } from "lucide-react";
import { JOB_STATUS_LABELS } from "@/lib/types";
import { JobApplication } from "@prisma/client";
import { KanbanCardOptions } from "../kanban/KanbanCardOptions";
import { Card, CardContent } from "@/components/ui/card";

export function JobListItem({ job }: { job: JobApplication }) {
  const getStatusColor = (status: JobApplication["status"]) => {
    switch (status) {
      case "APPLIED":
        return "bg-gray-100 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700";
      case "INTERVIEW":
        return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800";
      case "OFFER":
        return "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800";
      case "GHOSTED":
        return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800";
      case "REJECTED":
        return "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800";
      default:
        return "";
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toISOString().split("T")[0];
  };

  const getInitials = (company?: string | null) => {
    if (!company) return "??";
    return company
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <Card className="transition-shadow hover:shadow-sm p-2">
      <CardContent className="p-3">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-primary/5 text-xs font-semibold text-primary">
            {getInitials(job.company)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <Link
                  href={`/dashboard/jobs/${job.id}`}
                  className="block text-base font-semibold leading-tight hover:underline"
                >
                  {job.title}
                </Link>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground pt-2">
                  <Building2 className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{job.company}</span>
                </div>
              </div>
              <Badge
                variant="outline"
                className={`text-xs ${getStatusColor(
                  job.status as JobApplication["status"],
                )}`}
              >
                {JOB_STATUS_LABELS[job.status as JobApplication["status"]]}
              </Badge>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
              {job.dateApplied && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>{formatDate(job.dateApplied as Date)}</span>
                </div>
              )}
              {job.salary && <span>{job.salary}</span>}
              {job.link && (
                <a
                  href={job.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-primary hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>View posting</span>
                </a>
              )}
            </div>
          </div>
          <div className="shrink-0">
            <KanbanCardOptions job={job} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
