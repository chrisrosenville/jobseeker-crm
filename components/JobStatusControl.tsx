"use client";

import { useState, useTransition } from "react";
import { StatusSelect } from "@/components/StatusSelect";
import { JobStatus } from "@/lib/types";
import { toast } from "sonner";
import { useUpdateJobStatus } from "@/hooks/useJobs";
import { LoadingScreen } from "./LoadingScreen";

export function JobStatusControl({
  jobId,
  initialStatus,
}: {
  jobId: string;
  initialStatus: JobStatus;
}) {
  const [status, setStatus] = useState<JobStatus>(initialStatus);
  const [isPending, startTransition] = useTransition();

  const { mutateAsync: updateJobStatus, isPending: isUpdatingStatus } =
    useUpdateJobStatus();

  const isLoading = isUpdatingStatus || isPending;
  if (isLoading) return <LoadingScreen />;

  return (
    <div className="inline-flex items-center gap-2">
      <StatusSelect
        value={status}
        onChange={(s) => {
          setStatus(s);
          startTransition(async () => {
            await updateJobStatus({ id: jobId, status: s });
          });
        }}
      />
    </div>
  );
}
