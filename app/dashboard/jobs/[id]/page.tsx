import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// import { ConfirmDelete } from "@/components/ConfirmDelete";
import { DeleteJobButton } from "@/components/DeleteJobButton";
import { JobStatusControl } from "@/components/JobStatusControl";
import { Textarea } from "@/components/ui/textarea";
import { AddContactDialog } from "@/components/modals/AddContactDialog";
import { Badge } from "@/components/ui/badge";
// import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ContactCard } from "@/components/contacts/ContactCard";
import { JOB_STATUS_LABELS } from "@/lib/types";
import {
  Building2,
  CalendarDays,
  Link as LinkIcon,
  CircleDollarSign,
  Clock,
} from "lucide-react";

// addContactAction removed (handled via dialog component)

async function updateNotesAction(formData: FormData) {
  "use server";
  const { userId } = await auth();
  if (!userId) return;
  const jobId = String(formData.get("jobId"));
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/jobs/${jobId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ notes: formData.get("notes") }),
  });
}

export default async function JobDetails({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { userId } = await auth();
  if (!userId) return null;

  const { id } = await params;

  const job = await prisma.jobApplication.findFirst({
    where: { id, userId },
    include: { contacts: true },
  });
  if (!job) return notFound();

  const daysSinceUpdate = Math.floor(
    (Date.now() - new Date(job.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  const statusClass =
    job.status === "APPLIED"
      ? "bg-gray-100 text-gray-700"
      : job.status === "INTERVIEW"
      ? "bg-blue-100 text-blue-700"
      : job.status === "OFFER"
      ? "bg-green-100 text-green-700"
      : "bg-red-100 text-red-700";

  // initials helper moved into ContactListItem

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl md:text-3xl font-bold tracking-tight">
              {job.title}
            </h1>
            <Badge className={statusClass}>
              {JOB_STATUS_LABELS[job.status]}
            </Badge>
          </div>
          <div className="text-muted-foreground mt-1 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
            <div className="inline-flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span>{job.company}</span>
            </div>
            <div className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <span>
                Applied {new Date(job.dateApplied).toLocaleDateString()}
              </span>
            </div>
            {job.link ? (
              <div className="inline-flex items-center gap-2">
                <LinkIcon className="h-4 w-4" />
                <a
                  href={job.link}
                  className="underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  Job link
                </a>
              </div>
            ) : null}
            {job.salary ? (
              <div className="inline-flex items-center gap-2">
                <CircleDollarSign className="h-4 w-4" />
                <span>${job.salary.toLocaleString()}</span>
              </div>
            ) : null}
            <div className="inline-flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{daysSinceUpdate} days since update</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DeleteJobButton jobId={job.id} />
          <JobStatusControl jobId={job.id} initialStatus={job.status} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Notes</CardTitle>
              <CardDescription>
                Jot down updates and reminders for this application.
              </CardDescription>
            </CardHeader>
            <CardContent className="py-6">
              <form action={updateNotesAction} className="grid gap-3">
                <input type="hidden" name="jobId" defaultValue={job.id} />
                <Textarea
                  id="notes"
                  name="notes"
                  defaultValue={job.notes || ""}
                />
                <div className="flex justify-end">
                  <Button type="submit">Save notes</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Contacts</CardTitle>
                  <CardDescription>
                    People connected to this application.
                  </CardDescription>
                </div>
                <AddContactDialog jobId={job.id} />
              </div>
            </CardHeader>
            <CardContent className="py-6">
              <div className="space-y-3">
                {job.contacts.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    No contacts yet.
                  </div>
                ) : (
                  job.contacts.map((c) => (
                    <ContactCard
                      key={c.id}
                      id={c.id}
                      name={c.name}
                      role={c.role}
                      email={c.email}
                      phone={c.phone}
                      company={job.company}
                      jobTitle={job.title}
                    />
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
