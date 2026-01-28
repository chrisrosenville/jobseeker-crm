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

import { CreateOrUpdateJobApplication } from "@/lib/types";
import { useCreateJobApplication } from "@/hooks/useJobs";
import { useIsDemoUser } from "@/hooks/useUserRole";

export function AddJobDialog() {
  const { isDemoUser } = useIsDemoUser();
  const [formData, setFormData] = useState<CreateOrUpdateJobApplication>({
    title: "",
    company: "",
    status: "APPLIED",
    link: null,
    salary: null,
    dateApplied: new Date(),
    notes: null,
  });
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ path: string[]; message: string }[]>(
    [],
  );
  const { mutateAsync: createJobApplication } = useCreateJobApplication();

  const handleResetForm = () => {
    setFormData({
      title: "",
      company: "",
      status: "APPLIED",
      link: null,
      salary: null,
      dateApplied: new Date(),
      notes: null,
    });
    setErrors([]);
    setLoading(false);
    setOpen(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  async function onSubmit() {
    setLoading(true);
    setErrors([]);

    try {
      await createJobApplication(formData);
      setLoading(false);
      setOpen(false);
    } catch (error) {
      console.error(error);
      setErrors([{ path: ["unknown"], message: "Something went wrong" }]);
      setLoading(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) handleResetForm();
      }}
    >
      <DialogTrigger asChild>
        <Button
          disabled={isDemoUser}
          title={isDemoUser ? "Not available in demo mode" : undefined}
        >
          + Add Job
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="space-y-2 pb-4">
          <DialogTitle className="text-xl font-semibold">
            Add job application
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Track a new opportunity in your pipeline.
          </p>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="space-y-6"
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Job title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                name="title"
                required
                placeholder="e.g. Frontend Engineer"
                value={formData.title || ""}
                onChange={handleChange}
                className="h-10"
              />
              {errors.find((error) => error.path.includes("title")) && (
                <p className="text-xs text-destructive">
                  {
                    errors.find((error) => error.path.includes("title"))
                      ?.message
                  }
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company" className="text-sm font-medium">
                Company <span className="text-destructive">*</span>
              </Label>
              <Input
                id="company"
                name="company"
                required
                placeholder="e.g. Spotify"
                value={formData.company || ""}
                onChange={handleChange}
                className="h-10"
              />
              {errors.find((error) => error.path.includes("company")) && (
                <p className="text-xs text-destructive">
                  {
                    errors.find((error) => error.path.includes("company"))
                      ?.message
                  }
                </p>
              )}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="dateApplied" className="text-sm font-medium">
                  Date applied <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="dateApplied"
                  name="dateApplied"
                  type="date"
                  value={formData.dateApplied?.toISOString().split("T")[0]}
                  onChange={handleChange}
                  required
                  className="h-10"
                />
                {errors.find((error) => error.path.includes("dateApplied")) && (
                  <p className="text-xs text-destructive">
                    {
                      errors.find((error) => error.path.includes("dateApplied"))
                        ?.message
                    }
                  </p>
                )}
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
                {errors.find((error) => error.path.includes("salary")) && (
                  <p className="text-xs text-destructive">
                    {
                      errors.find((error) => error.path.includes("salary"))
                        ?.message
                    }
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="link" className="text-sm font-medium">
                Job posting link
              </Label>
              <Input
                id="link"
                name="link"
                type="url"
                placeholder="https://company.com/careers/job-id"
                value={formData.link?.toString() ?? ""}
                onChange={handleChange}
                className="h-10"
              />
              {errors.find((error) => error.path.includes("link")) && (
                <p className="text-xs text-destructive">
                  {errors.find((error) => error.path.includes("link"))?.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">
                Notes
              </Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Add any relevant details, referrals, or reminders..."
                value={formData.notes || ""}
                onChange={handleChange}
                rows={3}
                className="resize-none"
              />
              {errors.find((error) => error.path.includes("notes")) && (
                <p className="text-xs text-destructive">
                  {
                    errors.find((error) => error.path.includes("notes"))
                      ?.message
                  }
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add application"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
