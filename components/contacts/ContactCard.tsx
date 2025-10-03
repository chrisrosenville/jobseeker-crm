"use client";

import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Pencil,
  Trash2,
  Mail,
  Phone,
  Building2,
} from "lucide-react";
import { EditContactDialog } from "@/components/modals/EditContactDialog";
import { ConfirmDelete } from "@/components/ConfirmDelete";
import { useRouter } from "next/navigation";

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "?";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export function ContactCard({
  id,
  name,
  role,
  email,
  phone,
  company,
  jobTitle,
}: {
  id: string;
  name: string;
  role?: string | null;
  email?: string | null;
  phone?: string | null;
  company?: string | null;
  jobTitle?: string | null;
}) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <Avatar>
              <AvatarFallback>{getInitials(name)}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="leading-tight">{name}</CardTitle>
              <CardDescription>{role || "Contact"}</CardDescription>
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="ghost" className="h-8 w-8">
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
      </CardHeader>
      <CardContent className="py-6">
        <div className="grid gap-2 text-sm">
          {company || jobTitle ? (
            <div className="inline-flex items-center gap-2 text-muted-foreground">
              <Building2 className="h-4 w-4" />
              <span>
                {jobTitle ? `${jobTitle}` : null}
                {jobTitle && company ? " · " : null}
                {company ? `${company}` : null}
              </span>
            </div>
          ) : null}
          {email ? (
            <div className="inline-flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <a href={`mailto:${email}`} className="underline">
                {email}
              </a>
            </div>
          ) : null}
          {phone ? (
            <div className="inline-flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <a href={`tel:${phone}`}>{phone}</a>
            </div>
          ) : null}
        </div>
      </CardContent>
      <ConfirmDelete
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={async () => {
          await fetch(`/api/contacts/${id}`, { method: "DELETE" });
          setDeleteOpen(false);
          router.refresh();
        }}
      />
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
    </Card>
  );
}
