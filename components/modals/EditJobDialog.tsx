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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit job</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-3">
          <div className="grid gap-1">
            <Label htmlFor="title">Job title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              name="company"
              value={formData.company}
              onChange={handleChange}
              required
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="link">Link</Label>
            <Input
              id="link"
              name="link"
              value={formData.link?.toString() || ""}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="dateApplied">Date applied</Label>
            <Input
              id="dateApplied"
              name="dateApplied"
              type="date"
              value={formData.dateApplied.toLocaleDateString()}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="salary">Salary</Label>
            <Input
              id="salary"
              name="salary"
              type="text"
              placeholder="35,000"
              value={formData.salary ?? ""}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-1">
            <Label>Status</Label>
            <Select
              name="status"
              value={formData.status}
              onValueChange={(v) =>
                setFormData({ ...formData, status: v as JobStatus })
              }
            >
              <SelectTrigger>
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
          <div className="grid gap-1">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes || ""}
              onChange={handleChange}
            />
          </div>
          <div className="mt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange?.(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
