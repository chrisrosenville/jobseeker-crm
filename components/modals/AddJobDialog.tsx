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

export function AddJobDialog() {
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
    []
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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
        <Button>+ Add Job</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add job application</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="grid gap-3"
        >
          <div className="grid gap-1">
            <Label htmlFor="title">
              Job title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              required
              placeholder="Frontend Engineer"
              value={formData.title || ""}
              onChange={handleChange}
            />
            {errors.find((error) => error.path.includes("title")) && (
              <p className="text-sm text-red-500">
                {errors.find((error) => error.path.includes("title"))?.message}
              </p>
            )}
          </div>

          <div className="grid gap-1">
            <Label htmlFor="company">
              Company <span className="text-red-500">*</span>
            </Label>
            <Input
              id="company"
              name="company"
              required
              placeholder="Spotify"
              value={formData.company || ""}
              onChange={handleChange}
            />
            {errors.find((error) => error.path.includes("company")) && (
              <p className="text-sm text-red-500">
                {
                  errors.find((error) => error.path.includes("company"))
                    ?.message
                }
              </p>
            )}
          </div>

          <div className="grid gap-1">
            <Label htmlFor="dateApplied">
              Date applied <span className="text-red-500">*</span>
            </Label>
            <Input
              id="dateApplied"
              name="dateApplied"
              type="date"
              value={formData.dateApplied?.toISOString().split("T")[0]}
              onChange={handleChange}
              required
            />
            {errors.find((error) => error.path.includes("dateApplied")) && (
              <p className="text-sm text-red-500">
                {
                  errors.find((error) => error.path.includes("dateApplied"))
                    ?.message
                }
              </p>
            )}
          </div>

          <div className="grid gap-1">
            <Label htmlFor="link">Job posting link</Label>
            <Input
              id="link"
              name="link"
              type="url"
              placeholder="https://"
              value={formData.link?.toString() ?? ""}
              onChange={handleChange}
            />
            {errors.find((error) => error.path.includes("link")) && (
              <p className="text-sm text-red-500">
                {errors.find((error) => error.path.includes("link"))?.message}
              </p>
            )}
          </div>

          <div className="grid gap-1">
            <Label htmlFor="salary">Requested salary</Label>
            <Input
              id="salary"
              name="salary"
              type="text"
              placeholder="35,000"
              value={formData.salary ?? ""}
              onChange={handleChange}
            />
            {errors.find((error) => error.path.includes("salary")) && (
              <p className="text-sm text-red-500">
                {errors.find((error) => error.path.includes("salary"))?.message}
              </p>
            )}
          </div>

          <div className="grid gap-1">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Referred by Sarah"
              value={formData.notes || ""}
              onChange={handleChange}
            />
            {errors.find((error) => error.path.includes("notes")) && (
              <p className="text-sm text-red-500">
                {errors.find((error) => error.path.includes("notes"))?.message}
              </p>
            )}
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
