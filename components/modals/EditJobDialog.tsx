"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CreateOrUpdateJobApplication,
  JOB_STATUS_ORDER,
  JobStatus,
} from "@/lib/types";
import { JobApplication } from "@prisma/client";
import { useUpdateJobApplication } from "@/hooks/useJobs";

type Props = {
  job: JobApplication;
  onUpdated?: () => void;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function EditJobDialog({
  job,
  onUpdated,
  trigger,
  open,
  onOpenChange,
}: Props) {
  const [formData, setFormData] = useState<CreateOrUpdateJobApplication>({
    id: job.id,
    title: job.title,
    company: job.company,
    dateApplied: new Date(job.dateApplied),
    link: job.link ? new URL(job.link) : null,
    salary: job.salary ?? undefined,
    notes: job.notes ?? undefined,
    status: job.status as JobStatus,
  });
  const [loading, setLoading] = useState(false);

  const { mutateAsync: updateJobApplication } = useUpdateJobApplication();

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    if (name === "link") {
      setFormData({
        ...formData,
        link: value ? new URL(value) : null,
      });
    } else if (name === "dateApplied") {
      setFormData({
        ...formData,
        dateApplied: new Date(value),
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const payload: CreateOrUpdateJobApplication = {
        ...formData,
        link: formData.link
          ? (formData.link.toString() as unknown as URL)
          : null,
      };
      await updateJobApplication(payload);
      onUpdated?.();
      onOpenChange?.(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="space-y-2 pb-4">
          <DialogTitle className="text-xl font-semibold">
            Edit job application
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Update details for this opportunity.
          </p>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Job title
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company" className="text-sm font-medium">
                Company
              </Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                required
                className="h-10"
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dateApplied" className="text-sm font-medium">
                  Date applied
                </Label>
                <Input
                  id="dateApplied"
                  name="dateApplied"
                  type="date"
                  value={formData.dateApplied.toISOString().split("T")[0]}
                  onChange={handleChange}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salary" className="text-sm font-medium">
                  Salary
                </Label>
                <Input
                  id="salary"
                  name="salary"
                  type="text"
                  placeholder="e.g. $85,000"
                  value={formData.salary ?? ""}
                  onChange={handleChange}
                  className="h-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="link" className="text-sm font-medium">
                Link
              </Label>
              <Input
                id="link"
                name="link"
                value={formData.link?.toString() || ""}
                onChange={handleChange}
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Status</Label>
              <Select
                name="status"
                value={formData.status}
                onValueChange={(v) =>
                  setFormData({ ...formData, status: v as JobStatus })
                }
              >
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {JOB_STATUS_ORDER.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">
                Notes
              </Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes || ""}
                onChange={handleChange}
                rows={3}
                className="resize-none"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange?.(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
