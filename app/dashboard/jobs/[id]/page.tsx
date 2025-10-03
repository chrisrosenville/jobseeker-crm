import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmDelete } from "@/components/ConfirmDelete";
import { DeleteJobButton } from "@/components/DeleteJobButton";
import { JobStatusControl } from "@/components/JobStatusControl";
import { Textarea } from "@/components/ui/textarea";
import { AddContactDialog } from "@/components/modals/AddContactDialog";

async function addContactAction(formData: FormData) {
  "use server";
  const { userId } = await auth();
  if (!userId) return;
  const jobId = String(formData.get("jobId"));
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/contacts`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      jobId,
      name: formData.get("name"),
      role: formData.get("role"),
      email: formData.get("email"),
      phone: formData.get("phone") || undefined,
    }),
  });
}

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
  params: { id: string };
}) {
  const { userId } = await auth();
  if (!userId) return null;
  const job = await prisma.jobApplication.findFirst({
    where: { id: params.id, userId },
    include: { contacts: true },
  });
  if (!job) return notFound();

  const daysSinceUpdate = Math.floor(
    (Date.now() - new Date(job.updatedAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-semibold">{job.title}</h1>
          <div className="text-muted-foreground mt-1 flex flex-wrap items-center gap-2 text-sm">
            <span>{job.company}</span>
            <span>•</span>
            <span>
              Applied {new Date(job.dateApplied).toLocaleDateString()}
            </span>
            {job.link ? (
              <>
                <span>•</span>
                <a href={job.link} className="underline" target="_blank">
                  Job link
                </a>
              </>
            ) : null}
            {job.salary ? (
              <>
                <span>•</span>
                <span>Salary ${job.salary.toLocaleString()}</span>
              </>
            ) : null}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DeleteJobButton jobId={job.id} />
          <JobStatusControl jobId={job.id} initialStatus={job.status as any} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-4">
          <Card className="p-4">
            <h2 className="text-lg font-semibold">Notes</h2>
            <p className="text-xs text-gray-500">
              {daysSinceUpdate} days since last update
            </p>
            <form action={updateNotesAction} className="mt-3 grid gap-2">
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
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <Card className="p-4">
            <div className="mb-2 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Contacts</h2>
              <AddContactDialog jobId={job.id} />
            </div>
            <div className="space-y-3">
              {job.contacts.length === 0 ? (
                <div className="text-sm text-gray-500">No contacts yet.</div>
              ) : (
                job.contacts.map((c) => (
                  <div key={c.id} className="rounded border p-3 text-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="font-medium">{c.name}</div>
                        <div className="text-gray-500">{c.role}</div>
                        {c.email && <div>{c.email}</div>}
                        {c.phone && <div>{c.phone}</div>}
                      </div>
                      <div className="flex gap-2">
                        <form
                          action={async () => {
                            "use server";
                            await fetch(
                              `${
                                process.env.NEXT_PUBLIC_BASE_URL || ""
                              }/api/contacts/${c.id}`,
                              { method: "DELETE" }
                            );
                          }}
                        >
                          <ConfirmDelete onConfirm={async () => {}}>
                            <Button
                              type="button"
                              variant="ghost"
                              className="text-red-600"
                            >
                              Delete
                            </Button>
                          </ConfirmDelete>
                        </form>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
