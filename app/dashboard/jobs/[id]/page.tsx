"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

import {
  CalendarDays,
  Building2,
  Link as LinkIcon,
  DollarSign,
  FileText,
} from "lucide-react";

import { useJobApplication, useUpdateJobApplication } from "@/hooks/useJobs";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { JobStatusControl } from "@/components/JobStatusControl";
import { Textarea } from "@/components/ui/textarea";
import { AddContactDialog } from "@/components/modals/AddContactDialog";
import { ContactCard } from "@/components/contacts/ContactCard";

import { LoadingScreen } from "@/components/LoadingScreen";
import { KanbanCardOptions } from "@/components/kanban/KanbanCardOptions";
import { Badge } from "@/components/ui/badge";
import { JOB_STATUS_LABELS } from "@/lib/types";

export default function JobDetails() {
  const params = useParams<{ id: string }>();
  const {
    data: jobApplication,
    isPending,
    isLoading,
  } = useJobApplication(params?.id);

  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const updateJob = useUpdateJobApplication();

  useEffect(() => {
    if (jobApplication?.notes) {
      setNotes(jobApplication.notes);
    }
  }, [jobApplication?.notes]);

  if (isPending || isLoading) return <LoadingScreen />;
  if (!jobApplication) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold">Job application not found</h2>
          <p className="text-sm text-muted-foreground">
            This job may have been deleted or you don&apos;t have access to it.
          </p>
        </div>
      </div>
    );
  }

  const handleUpdateNotes = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await updateJob.mutateAsync({
        id: jobApplication.id,
        title: jobApplication.title,
        company: jobApplication.company,
        status: jobApplication.status,
        dateApplied: new Date(jobApplication.dateApplied),
        link: jobApplication.link ? new URL(jobApplication.link) : null,
        salary: jobApplication.salary,
        notes: notes,
      });
    } finally {
      setIsSaving(false);
    }
  };

  const hasContacts =
    jobApplication.contacts && jobApplication.contacts.length > 0;

  return (
    <div className="space-y-6 w-full">
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="space-y-3">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold tracking-tight">
              {jobApplication.title}
            </h1>
            <div className="flex items-center gap-2 text-lg text-muted-foreground">
              <Building2 className="h-5 w-5" />
              <span>{jobApplication.company}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="font-normal">
              {JOB_STATUS_LABELS[jobApplication.status]}
            </Badge>
            <span className="text-sm text-muted-foreground">·</span>
            <div className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              <span>
                Applied{" "}
                {new Date(jobApplication.dateApplied).toLocaleDateString(
                  "en-US",
                  {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  },
                )}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <JobStatusControl
            jobId={jobApplication.id}
            initialStatus={jobApplication.status}
          />
          <KanbanCardOptions job={jobApplication} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Details Card */}
        <Card>
          <CardHeader>
            <CardTitle>Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {jobApplication.link && (
              <div className="flex items-start gap-3">
                <LinkIcon className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div className="space-y-1 min-w-0 flex-1">
                  <p className="text-sm font-medium">Job posting</p>
                  <a
                    href={jobApplication.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline break-all"
                  >
                    {jobApplication.link}
                  </a>
                </div>
              </div>
            )}

            {jobApplication.salary && (
              <div className="flex items-start gap-3">
                <DollarSign className="h-5 w-5 mt-0.5 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Salary</p>
                  <p className="text-sm text-muted-foreground">
                    {jobApplication.salary}
                  </p>
                </div>
              </div>
            )}

            {!jobApplication.link && !jobApplication.salary && (
              <p className="text-sm text-muted-foreground">
                No additional details available
              </p>
            )}
          </CardContent>
        </Card>

        {/* Notes Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <CardTitle>Notes</CardTitle>
            </div>
            <CardDescription>
              Keep track of updates, reminders, and important details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdateNotes} className="space-y-4">
              <Textarea
                id="notes"
                name="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add notes about this application..."
                rows={6}
                className="resize-none"
              />
              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={isSaving || notes === jobApplication.notes}
                >
                  {isSaving ? "Saving..." : "Save notes"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Contacts Section */}
      <div className="w-full">
        <Card className="w-full">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle>Contacts</CardTitle>
                <CardDescription>
                  {hasContacts
                    ? `${jobApplication.contacts?.length ?? 0} ${jobApplication.contacts?.length === 1 ? "person" : "people"}`
                    : "No contacts yet"}
                </CardDescription>
              </div>
              <AddContactDialog
                jobId={jobApplication.id}
                trigger={
                  <Button size="sm" variant="outline">
                    Add
                  </Button>
                }
              />
            </div>
          </CardHeader>
          {hasContacts && (
            <CardContent className="space-y-3">
              {jobApplication.contacts?.map((contact) => (
                <ContactCard
                  key={contact.id}
                  id={contact.id}
                  name={contact.name}
                  role={contact.role}
                  email={contact.email}
                  phone={contact.phone}
                />
              ))}
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
