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
import { useIsDemoUser } from "@/hooks/useUserRole";
import { toast } from "sonner";

export function AddContactDialog({
  jobId,
  trigger,
  onCreated,
}: {
  jobId?: string;
  trigger?: React.ReactNode;
  onCreated?: () => void;
}) {
  const { isDemoUser } = useIsDemoUser();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    try {
      const res = await fetch("/api/contacts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: jobId || undefined,
          name: formData.get("name"),
          role: formData.get("role"),
          email: formData.get("email"),
          phone: formData.get("phone") || undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to create contact");
      }

      setLoading(false);
      setOpen(false);
      if (onCreated) onCreated();
      else if (typeof window !== "undefined") window.location.reload();
    } catch (error) {
      setLoading(false);
      const message =
        error instanceof Error ? error.message : "Failed to create contact";
      toast.error(message);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          <div
            className="inline-flex"
            title={isDemoUser ? "Not available in demo mode" : undefined}
          >
            {trigger}
          </div>
        ) : (
          <Button
            disabled={isDemoUser}
            title={isDemoUser ? "Not available in demo mode" : undefined}
          >
            + Add Contact
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add contact</DialogTitle>
        </DialogHeader>
        <form action={(fd) => onSubmit(fd)} className="grid gap-3">
          <div className="grid gap-1">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" required />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="role">Role</Label>
            <Input id="role" name="role" placeholder="Recruiter" />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" />
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
