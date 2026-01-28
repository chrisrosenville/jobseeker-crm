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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsDemoUser } from "@/hooks/useUserRole";
import { useContacts } from "@/hooks/useContacts";
import { toast } from "sonner";
import { CONTACT_ROLE_ORDER, CONTACT_ROLE_LABELS } from "@/lib/types";

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
  const { data: allContacts = [] } = useContacts();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedContactId, setSelectedContactId] = useState<string>("");

  // Filter out contacts that don't have a jobId (unassociated) or different jobId
  const availableContacts = allContacts;

  async function onSubmitNew(formData: FormData) {
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

  async function onLinkExisting() {
    if (!selectedContactId || !jobId) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/contacts/${selectedContactId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to link contact");
      }

      setLoading(false);
      setOpen(false);
      setSelectedContactId("");
      if (onCreated) onCreated();
      else if (typeof window !== "undefined") window.location.reload();
    } catch (error) {
      setLoading(false);
      const message =
        error instanceof Error ? error.message : "Failed to link contact";
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
      <DialogContent className="sm:max-w-lg">
        <DialogHeader className="space-y-2 pb-4">
          <DialogTitle className="text-xl font-semibold">
            Add contact
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            {jobId
              ? "Create a new contact or link an existing one to this job."
              : "Add someone you've connected with during your job search."}
          </p>
        </DialogHeader>

        {jobId && availableContacts.length > 0 ? (
          <Tabs defaultValue="new" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="new">Create New</TabsTrigger>
              <TabsTrigger value="existing">Link Existing</TabsTrigger>
            </TabsList>

            <TabsContent value="new" className="space-y-6 mt-6">
              <form action={(fd) => onSubmitNew(fd)} className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">
                      Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="e.g. Sarah Johnson"
                      required
                      className="h-10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role" className="text-sm font-medium">
                      Role <span className="text-destructive">*</span>
                    </Label>
                    <Select name="role" required>
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
                        placeholder="email@company.com"
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
                        placeholder="+1 (555) 123-4567"
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
                    {loading ? "Adding..." : "Add contact"}
                  </Button>
                </div>
              </form>
            </TabsContent>

            <TabsContent value="existing" className="space-y-6 mt-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="contact-select"
                    className="text-sm font-medium"
                  >
                    Select contact <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={selectedContactId}
                    onValueChange={setSelectedContactId}
                  >
                    <SelectTrigger className="h-10" id="contact-select">
                      <SelectValue placeholder="Choose a contact" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableContacts.map((contact) => (
                        <SelectItem key={contact.id} value={contact.id}>
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="font-medium truncate">
                              {contact.name}
                            </span>
                            {contact.role && (
                              <>
                                <span className="text-muted-foreground">·</span>
                                <span className="text-sm text-muted-foreground truncate">
                                  {CONTACT_ROLE_LABELS[
                                    contact.role as keyof typeof CONTACT_ROLE_LABELS
                                  ] || contact.role}
                                </span>
                              </>
                            )}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Link an existing contact from your network to this job.
                  </p>
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
                <Button
                  onClick={onLinkExisting}
                  disabled={loading || !selectedContactId}
                >
                  {loading ? "Linking..." : "Link contact"}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        ) : (
          <form action={(fd) => onSubmitNew(fd)} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="e.g. Sarah Johnson"
                  required
                  className="h-10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role" className="text-sm font-medium">
                  Role <span className="text-destructive">*</span>
                </Label>
                <Select name="role" required>
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
                    placeholder="email@company.com"
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
                    placeholder="+1 (555) 123-4567"
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
                {loading ? "Adding..." : "Add contact"}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
