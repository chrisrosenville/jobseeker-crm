"use client";

import { JobListItem } from "@/components/jobs/JobListItem";
import { LoadingScreen } from "@/components/LoadingScreen";
import { AddJobDialog } from "@/components/modals/AddJobDialog";
import { useJobApplications } from "@/hooks/useJobs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { BriefcaseBusiness, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { JOB_STATUS_LABELS, JobStatus } from "@/lib/types";
import { useMemo, useState } from "react";

export default function JobsPage() {
  const { data = [], isLoading: isLoadingJobApplications } =
    useJobApplications();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | JobStatus>("ALL");
  const [sortBy, setSortBy] = useState<"recent" | "company" | "title">(
    "recent",
  );

  const filteredJobs = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    let filtered = data;

    if (statusFilter !== "ALL") {
      filtered = filtered.filter((job) => job.status === statusFilter);
    }

    if (normalizedQuery) {
      filtered = filtered.filter((job) => {
        const title = job.title?.toLowerCase() ?? "";
        const company = job.company?.toLowerCase() ?? "";
        const notes = job.notes?.toLowerCase() ?? "";
        const salary = job.salary?.toLowerCase() ?? "";
        return (
          title.includes(normalizedQuery) ||
          company.includes(normalizedQuery) ||
          notes.includes(normalizedQuery) ||
          salary.includes(normalizedQuery)
        );
      });
    }

    const sorted = [...filtered];
    sorted.sort((a, b) => {
      if (sortBy === "company") {
        return (a.company ?? "").localeCompare(b.company ?? "");
      }
      if (sortBy === "title") {
        return (a.title ?? "").localeCompare(b.title ?? "");
      }
      const dateA = a.dateApplied ? new Date(a.dateApplied).getTime() : 0;
      const dateB = b.dateApplied ? new Date(b.dateApplied).getTime() : 0;
      return dateB - dateA;
    });

    return sorted;
  }, [data, query, sortBy, statusFilter]);

  if (isLoadingJobApplications) return <LoadingScreen />;

  const statusCounts = data.reduce(
    (acc, job) => {
      acc[job.status] += 1;
      return acc;
    },
    {
      APPLIED: 0,
      INTERVIEW: 0,
      OFFER: 0,
      REJECTED: 0,
    },
  );

  const hasFilters =
    query.trim().length > 0 || statusFilter !== "ALL" || sortBy !== "recent";

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Jobs</p>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Browse your applications fast.
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Search, filter, and sort your job list to find the right role in
            seconds.
          </p>
        </div>
        <div className="lg:shrink-0">
          <AddJobDialog />
        </div>
      </header>

      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-3">
            <div className="relative w-full max-w-xl">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by title, company, notes, or salary"
                className={cn("pl-9", hasFilters && "pr-10")}
              />
              {hasFilters && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                  onClick={() => {
                    setQuery("");
                    setStatusFilter("ALL");
                    setSortBy("recent");
                  }}
                  aria-label="Clear filters"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <Select
                value={statusFilter}
                onValueChange={(value) =>
                  setStatusFilter(value as "ALL" | JobStatus)
                }
              >
                <SelectTrigger className="w-1/2 max-w-[150px]">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All statuses</SelectItem>
                  {Object.entries(JOB_STATUS_LABELS).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={sortBy}
                onValueChange={(value) =>
                  setSortBy(value as "recent" | "company" | "title")
                }
              >
                <SelectTrigger className="w-1/2 max-w-[150px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Newest first</SelectItem>
                  <SelectItem value="company">Company A–Z</SelectItem>
                  <SelectItem value="title">Title A–Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[
              {
                key: "ALL" as const,
                label: "All",
                count: data.length,
              },
              {
                key: "APPLIED" as const,
                label: JOB_STATUS_LABELS.APPLIED,
                count: statusCounts.APPLIED,
              },
              {
                key: "INTERVIEW" as const,
                label: JOB_STATUS_LABELS.INTERVIEW,
                count: statusCounts.INTERVIEW,
              },
              {
                key: "OFFER" as const,
                label: JOB_STATUS_LABELS.OFFER,
                count: statusCounts.OFFER,
              },
              {
                key: "REJECTED" as const,
                label: JOB_STATUS_LABELS.REJECTED,
                count: statusCounts.REJECTED,
              },
            ].map((chip) => (
              <button
                key={chip.key}
                type="button"
                onClick={() => setStatusFilter(chip.key)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium transition",
                  statusFilter === chip.key
                    ? "border-primary/40 bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                {chip.label}
                <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                  {chip.count}
                </span>
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
            <span>
              Showing {filteredJobs.length} of {data.length} jobs
            </span>
          </div>
          {data.length === 0 ? (
            <div className="rounded-xl border border-dashed bg-muted/30 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-sm">
                <BriefcaseBusiness className="h-5 w-5 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-base font-semibold">
                Add your first job application
              </h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Capture a role, track its stage, and search it anytime.
              </p>
              <div className="mt-4 flex justify-center">
                <AddJobDialog />
              </div>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="rounded-xl border border-dashed bg-muted/30 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-sm">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-base font-semibold">No matches found</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Try adjusting your search or clearing filters.
              </p>
              <div className="mt-4 flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuery("");
                    setStatusFilter("ALL");
                    setSortBy("recent");
                  }}
                >
                  Clear filters
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
              {filteredJobs.map((jobApplication) => (
                <JobListItem key={jobApplication.id} job={jobApplication} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
