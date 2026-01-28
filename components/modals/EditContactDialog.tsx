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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  CONTACT_ROLE_ORDER,
  CONTACT_ROLE_LABELS,
  ContactRole,
} from "@/lib/types";

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
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function EditContactDialog({
  contact,
  onUpdated,
  trigger,
  open,
  onOpenChange,
}: Props) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isControlled = typeof open === "boolean";
  const isOpen = isControlled ? open : internalOpen;
  const setOpen = isControlled && onOpenChange ? onOpenChange : setInternalOpen;
  const [loading, setLoading] = useState(false);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    try {
      const payload = {
        name: String(formData.get("name") || ""),
        role: (formData.get("role") as string) || "",
        email: (formData.get("email") as string) || "",
        phone: (formData.get("phone") as string) || "",
      };
      const res = await fetch(`/api/contacts/${contact.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to update contact");
      }

      setLoading(false);
      setOpen(false);
      if (onUpdated) onUpdated();
      else if (typeof window !== "undefined") window.location.reload();
    } catch (error) {
      setLoading(false);
      const message =
        error instanceof Error ? error.message : "Failed to update contact";
      toast.error(message);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="space-y-2 pb-4">
          <DialogTitle className="text-xl font-semibold">
            Edit contact
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Update contact information.
          </p>
        </DialogHeader>
        <form action={(fd) => onSubmit(fd)} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                defaultValue={contact.name}
                required
                className="h-10"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium">
                Role
              </Label>
              <Select name="role" defaultValue={contact.role || undefined}>
                <SelectTrigger className="h-10">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  {CONTACT_ROLE_ORDER.map((role) => (
                    <SelectItem key={role} value={role}>
                      {CONTACT_ROLE_LABELS[role]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={contact.email || ""}
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-sm font-medium">
                  Phone
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  defaultValue={contact.phone || ""}
                  className="h-10"
                />
              </div>
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
              {loading ? "Saving..." : "Save changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
