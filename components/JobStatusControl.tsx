"use client";

import { useState, useTransition } from "react";
import { StatusSelect } from "@/components/StatusSelect";
import { JobStatus } from "@/lib/types";
import { toast } from "sonner";

export function JobStatusControl({
  jobId,
  initialStatus,
}: {
  jobId: string;
  initialStatus: JobStatus;
}) {
  const [status, setStatus] = useState<JobStatus>(initialStatus);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="inline-flex items-center gap-2">
      <StatusSelect
        value={status}
        onChange={(s) => {
          setStatus(s);
          startTransition(async () => {
            const res = await fetch(`/api/jobs/${jobId}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status: s }),
            });
            if (!res.ok) {
              toast.error("Failed to update status");
              // best-effort refetch on error
              setStatus(initialStatus);
            } else {
              toast.success("Status updated");
            }
          });
        }}
      />
    </div>
  );
}
