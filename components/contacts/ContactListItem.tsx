"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ConfirmDelete } from "@/components/ConfirmDelete";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import { EditContactDialog } from "@/components/modals/EditContactDialog";

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
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <div className="rounded border p-3 text-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
          </Avatar>
          <div>
            <div className="font-medium">{name}</div>
            <div className="text-muted-foreground">{role || "Contact"}</div>
            {email && <div className="mt-1">{email}</div>}
            {phone && <div>{phone}</div>}
          </div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button size="icon" variant="ghost" className="h-7 w-7">
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
          onOpenChange={setDeleteOpen}
          onConfirm={async () => {
            await fetch(`/api/contacts/${id}`, { method: "DELETE" });
            setDeleteOpen(false);
            router.refresh();
          }}
        />
      </div>
    </div>
  );
}
