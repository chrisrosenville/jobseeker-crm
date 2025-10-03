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

export function AddJobDialog({ onCreated }: { onCreated?: () => void }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    await fetch("/api/jobs", {
      method: "POST",
      body: JSON.stringify({
        title: formData.get("title"),
        company: formData.get("company"),
        link: formData.get("link") || undefined,
        dateApplied: formData.get("dateApplied") || undefined,
        salary: formData.get("salary")
          ? Number(formData.get("salary"))
          : undefined,
        notes: formData.get("notes") || undefined,
      }),
      headers: { "Content-Type": "application/json" },
    });
    setLoading(false);
    setOpen(false);
    if (onCreated) onCreated();
    else if (typeof window !== "undefined") {
      window.location.reload();
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>+ Add Job</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add job application</DialogTitle>
        </DialogHeader>
        <form action={(fd) => onSubmit(fd)} className="grid gap-3">
          <div className="grid gap-1">
            <Label htmlFor="title">Job title</Label>
            <Input
              id="title"
              name="title"
              required
              placeholder="Frontend Engineer"
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="company">Company</Label>
            <Input id="company" name="company" required placeholder="Spotify" />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="link">Link</Label>
            <Input id="link" name="link" placeholder="https://" />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="dateApplied">Date applied</Label>
            <Input id="dateApplied" name="dateApplied" type="date" />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="salary">Salary</Label>
            <Input
              id="salary"
              name="salary"
              type="number"
              min="0"
              placeholder="Optional"
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" placeholder="Referred by Sarah" />
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
