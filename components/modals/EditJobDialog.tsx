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
import { JOB_STATUS_ORDER, JobStatus } from "@/lib/types";

type Props = {
  job: {
    id: string;
    title: string;
    company: string;
    link?: string | null;
    salary?: number | null;
    dateApplied: string | Date;
    notes?: string | null;
    status: JobStatus;
  };
  onUpdated?: () => void;
  trigger?: React.ReactNode;
};

export function EditJobDialog({ job, onUpdated, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    const payload: any = {
      title: formData.get("title"),
      company: formData.get("company"),
      link: formData.get("link") || null,
      salary: formData.get("salary") ? Number(formData.get("salary")) : null,
      dateApplied: formData.get("dateApplied") || undefined,
      notes: formData.get("notes") || null,
      status: formData.get("status"),
    };
    await fetch(`/api/jobs/${job.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setLoading(false);
    setOpen(false);
    if (onUpdated) onUpdated();
    else if (typeof window !== "undefined") window.location.reload();
  }

  const appliedISO =
    typeof job.dateApplied === "string"
      ? job.dateApplied
      : job.dateApplied.toISOString();
  const dateVal = appliedISO ? appliedISO.slice(0, 10) : "";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? <Button variant="outline">Edit</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit job</DialogTitle>
        </DialogHeader>
        <form action={(fd) => onSubmit(fd)} className="grid gap-3">
          <div className="grid gap-1">
            <Label htmlFor="title">Job title</Label>
            <Input id="title" name="title" defaultValue={job.title} required />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              name="company"
              defaultValue={job.company}
              required
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="link">Link</Label>
            <Input id="link" name="link" defaultValue={job.link || ""} />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="dateApplied">Date applied</Label>
            <Input
              id="dateApplied"
              name="dateApplied"
              type="date"
              defaultValue={dateVal}
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="salary">Salary</Label>
            <Input
              id="salary"
              name="salary"
              type="number"
              min="0"
              defaultValue={job.salary ?? undefined}
            />
          </div>
          <div className="grid gap-1">
            <Label>Status</Label>
            <Select name="status" defaultValue={job.status}>
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
            <Textarea id="notes" name="notes" defaultValue={job.notes || ""} />
          </div>
          <div className="mt-2 flex justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setOpen(false)}
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
