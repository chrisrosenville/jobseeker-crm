"use client";

import { ConfirmDelete } from "@/components/ConfirmDelete";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function DeleteJobButton({
  jobId,
  onDeleted,
}: {
  jobId: string;
  onDeleted?: () => void;
}) {
  return (
    <ConfirmDelete
      title="Delete job"
      description="This will permanently remove this job and its contacts."
      onConfirm={async () => {
        const res = await fetch(`/api/jobs/${jobId}`, { method: "DELETE" });
        if (!res.ok) {
          toast.error("Failed to delete job");
          return;
        }
        toast.success("Job deleted");
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
