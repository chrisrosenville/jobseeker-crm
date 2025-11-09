"use client";

import { ConfirmDelete } from "@/components/ConfirmDelete";
import { Button } from "@/components/ui/button";
import { useDeleteJobApplication } from "@/hooks/useJobs";
import { toast } from "sonner";

export function DeleteJobButton({
  jobId,
  onDeleted,
}: {
  jobId: string;
  onDeleted?: () => void;
}) {
  const deleteJobApplication = useDeleteJobApplication();

  return (
    <ConfirmDelete
      title="Delete job"
      description="This will permanently remove this job and its contacts."
      onConfirm={async () => {
        await deleteJobApplication.mutateAsync(jobId);
        if (onDeleted) onDeleted();
        else window.location.href = "/dashboard";
      }}
    >
      <Button variant="ghost" className="text-red-600">
        Delete
      </Button>
    </ConfirmDelete>
  );
}
