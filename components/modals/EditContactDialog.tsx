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

type Props = {
  contact: {
    id: string;
    name: string;
    role?: string | null;
    email?: string | null;
    phone?: string | null;
  };
  onUpdated?: () => void;
  trigger?: React.ReactNode;
};

export function EditContactDialog({ contact, onUpdated, trigger }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    const payload: any = {
      name: formData.get("name"),
      role: formData.get("role"),
      email: formData.get("email"),
      phone: formData.get("phone"),
    };
    await fetch(`/api/contacts/${contact.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setLoading(false);
    setOpen(false);
    if (onUpdated) onUpdated();
    else if (typeof window !== "undefined") window.location.reload();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? <Button variant="outline">Edit</Button>}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit contact</DialogTitle>
        </DialogHeader>
        <form action={(fd) => onSubmit(fd)} className="grid gap-3">
          <div className="grid gap-1">
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" defaultValue={contact.name} required />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="role">Role</Label>
            <Input id="role" name="role" defaultValue={contact.role || ""} />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={contact.email || ""}
            />
          </div>
          <div className="grid gap-1">
            <Label htmlFor="phone">Phone</Label>
            <Input id="phone" name="phone" defaultValue={contact.phone || ""} />
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
