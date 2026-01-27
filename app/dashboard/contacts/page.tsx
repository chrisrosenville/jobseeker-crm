"use client";

import { ContactListItem } from "@/components/contacts/ContactListItem";
import { AddContactDialog } from "@/components/modals/AddContactDialog";
import { LoadingScreen } from "@/components/LoadingScreen";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useContacts } from "@/hooks/useContacts";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal, Users, X } from "lucide-react";
import type { Contact } from "@prisma/client";

type ContactWithJob = Contact & {
  job?: {
    title?: string | null;
    company?: string | null;
  } | null;
};

export default function ContactsPage() {
  const { data = [], isLoading: isLoadingContacts } = useContacts();
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"recent" | "name">("recent");

  const roleOptions = useMemo(() => {
    const roles = new Set<string>();
    data.forEach((contact) => {
      if (contact.role) roles.add(contact.role);
    });
    return Array.from(roles).sort((a, b) => a.localeCompare(b));
  }, [data]);
  const filteredContacts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    let filtered = data as ContactWithJob[];

    if (roleFilter !== "ALL") {
      if (roleFilter === "UNSPECIFIED") {
        filtered = filtered.filter((contact) => !contact.role);
      } else {
        filtered = filtered.filter((contact) => contact.role === roleFilter);
      }
    }

    if (normalizedQuery) {
      filtered = filtered.filter((contact) => {
        const name = contact.name?.toLowerCase() ?? "";
        const role = contact.role?.toLowerCase() ?? "";
        const email = contact.email?.toLowerCase() ?? "";
        const phone = contact.phone?.toLowerCase() ?? "";
        const jobTitle = contact.job?.title?.toLowerCase() ?? "";
        const jobCompany = contact.job?.company?.toLowerCase() ?? "";
        return (
          name.includes(normalizedQuery) ||
          role.includes(normalizedQuery) ||
          email.includes(normalizedQuery) ||
          phone.includes(normalizedQuery) ||
          jobTitle.includes(normalizedQuery) ||
          jobCompany.includes(normalizedQuery)
        );
      });
    }

    const sorted = [...filtered];
    sorted.sort((a, b) => {
      if (sortBy === "name") {
        return (a.name ?? "").localeCompare(b.name ?? "");
      }
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    });

    return sorted;
  }, [data, query, roleFilter, sortBy]);

  const hasFilters =
    query.trim().length > 0 || roleFilter !== "ALL" || sortBy !== "recent";

  if (isLoadingContacts) return <LoadingScreen />;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">Contacts</p>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Find the right person fast.
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Search by name, role, or company to reconnect quickly.
          </p>
        </div>
        <div className="lg:shrink-0">
          <AddContactDialog />
        </div>
      </header>

      <Card>
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-3">
            <div className="relative w-full max-w-xl">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by name, role, company, or email"
                className={cn("pl-9", hasFilters && "pr-10")}
              />
              {hasFilters && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 top-1/2 h-7 w-7 -translate-y-1/2 text-muted-foreground"
                  onClick={() => {
                    setQuery("");
                    setRoleFilter("ALL");
                    setSortBy("recent");
                  }}
                  aria-label="Clear filters"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="All roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ALL">All roles</SelectItem>
                  <SelectItem value="UNSPECIFIED">No role</SelectItem>
                  {roleOptions.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={sortBy}
                onValueChange={(value) => setSortBy(value as "recent" | "name")}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most recent</SelectItem>
                  <SelectItem value="name">Name A–Z</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
            <span>
              Showing {filteredContacts.length} of {data.length} contacts
            </span>
          </div>
          {data.length === 0 ? (
            <div className="rounded-xl border border-dashed bg-muted/30 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-sm">
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-base font-semibold">
                Add your first contact
              </h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Store recruiter details and keep conversations handy.
              </p>
              <div className="mt-4 flex justify-center">
                <AddContactDialog />
              </div>
            </div>
          ) : filteredContacts.length === 0 ? (
            <div className="rounded-xl border border-dashed bg-muted/30 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-sm">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <h3 className="mt-4 text-base font-semibold">No matches found</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Try adjusting your search or clearing filters.
              </p>
              <div className="mt-4 flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => {
                    setQuery("");
                    setRoleFilter("ALL");
                    setSortBy("recent");
                  }}
                >
                  Clear filters
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
              {filteredContacts.map((contact) => (
                <ContactListItem
                  key={contact.id}
                  id={contact.id}
                  name={contact.name}
                  role={contact.role}
                  email={contact.email}
                  phone={contact.phone}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
