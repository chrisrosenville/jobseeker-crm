"use client";

import { useState } from "react";
import { useParams } from "next/navigation";

import { CalendarDays } from "lucide-react";

import { useJobApplication } from "@/hooks/useJobs";

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

import { LoadingScreen } from "@/components/LoadingScreen";
import { KanbanCardOptions } from "@/components/kanban/KanbanCardOptions";

export default function JobDetails() {
  const [notes, setNotes] = useState("");

  const params = useParams<{ id: string }>();
  const {
    data: jobApplication,
    isPending,
    isLoading,
  } = useJobApplication(params?.id);

  if (isPending || isLoading) return <LoadingScreen />;
  if (!jobApplication) return <div>Job application not found</div>;

  const handleUpdateNotes = async () => {};

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl md:text-3xl font-bold tracking-tight items-center flex justify-center">
              {jobApplication.title}
            </h1>
          </div>
          <div className="text-muted-foreground mt-1 grid gap-2 text-sm">
            <div className="inline-flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <span>
                Applied{" "}
                {new Date(jobApplication.dateApplied).toLocaleDateString()}
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

      <div className="grid gap-6 grid-cols-1">
        <div className="space-y-4">
          <Card>
            <CardHeader className="border-b">
              <CardTitle>Notes</CardTitle>
              <CardDescription>
                Jot down updates and reminders for this application.
              </CardDescription>
            </CardHeader>
            <CardContent className="py-6">
              <form onSubmit={handleUpdateNotes} className="grid gap-3">
                <input
                  type="hidden"
                  name="jobId"
                  defaultValue={jobApplication.id}
                />
                <Textarea
                  id="notes"
                  name="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
                <div className="flex justify-end">
                  <Button type="submit">Save notes</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Contacts</CardTitle>
                  <CardDescription>
                    People connected to this application.
                  </CardDescription>
                </div>
                <AddContactDialog jobId={jobApplication.id} />
              </div>
            </CardHeader>
            <CardContent className="py-6">
              {/* <div className="space-y-3">
                {jobApplication.contacts?.length === 0 ? (
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
              </div> */}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
