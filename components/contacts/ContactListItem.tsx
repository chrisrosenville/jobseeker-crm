"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConfirmDelete } from "@/components/ConfirmDelete";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2, Mail, Phone } from "lucide-react";
import { EditContactDialog } from "@/components/modals/EditContactDialog";
import { Card, CardContent } from "@/components/ui/card";
import { useIsDemoUser } from "@/hooks/useUserRole";
import { useDeleteContact } from "@/hooks/useContacts";
import { CONTACT_ROLE_LABELS, ContactRole } from "@/lib/types";

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "?";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export function ContactListItem({
  id,
  name,
  role,
  email,
  phone,
}: {
  id: string;
  name: string;
  role: string | null;
  email: string | null;
  phone?: string | null;
}) {
  const { isDemoUser } = useIsDemoUser();
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const deleteContact = useDeleteContact();

  const displayRole = role
    ? CONTACT_ROLE_LABELS[role as ContactRole] || role
    : null;

  return (
    <Card className="transition-shadow hover:shadow-sm p-2">
      <CardContent className="p-3">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg border bg-primary/5 text-xs font-semibold text-primary">
            {getInitials(name)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="text-sm font-semibold leading-tight">
                  {name}
                </div>
                {displayRole && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    {displayRole}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              {email && (
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-1.5 text-primary hover:underline"
                >
                  <Mail className="h-3.5 w-3.5" />
                  <span>{email}</span>
                </a>
              )}
              {phone && (
                <a
                  href={`tel:${phone}`}
                  className="flex items-center gap-1.5 text-primary hover:underline"
                >
                  <Phone className="h-3.5 w-3.5" />
                  <span>{phone}</span>
                </a>
              )}
            </div>
          </div>
          <div className="shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  disabled={isDemoUser}
                  title={isDemoUser ? "Not available in demo mode" : undefined}
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    setEditOpen(true);
                  }}
                  className="cursor-pointer"
                >
                  <Pencil className="mr-2 h-4 w-4" /> Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onSelect={(e) => {
                    e.preventDefault();
                    setDeleteOpen(true);
                  }}
                  className="group cursor-pointer"
                >
                  <Trash2 className="mr-2 h-4 w-4 text-red-600 group-data-[highlighted]:text-red-700" />
                  <span className="text-red-600 group-data-[highlighted]:text-red-700">
                    Delete
                  </span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <EditContactDialog
          contact={{
            id,
            name,
            role: role || undefined,
            email: email || undefined,
            phone: phone || undefined,
          }}
          onUpdated={() => router.refresh()}
          open={editOpen}
          onOpenChange={setEditOpen}
        />
        <ConfirmDelete
          open={deleteOpen}
          setOpen={setDeleteOpen}
          onConfirm={async () => {
            await deleteContact.mutateAsync(id);
            setDeleteOpen(false);
          }}
        />
      </CardContent>
    </Card>
  );
}
