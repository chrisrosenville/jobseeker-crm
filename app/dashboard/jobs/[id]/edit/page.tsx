import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

async function saveJobAction(formData: FormData) {
  "use server";
  const { userId } = await auth();
  if (!userId) return;
  const id = String(formData.get("id"));
  await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ""}/api/jobs/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: String(formData.get("title") || ""),
      company: String(formData.get("company") || ""),
      link: (formData.get("link") as string) || null,
      dateApplied: (formData.get("dateApplied") as string) || undefined,
      salary: formData.get("salary") ? Number(formData.get("salary")) : null,
      notes: (formData.get("notes") as string) || null,
      status: String(formData.get("status") || "APPLIED"),
    }),
  });
  redirect(`/dashboard/jobs/${id}`);
}

export default async function EditJobPage({
  params,
}: {
  params: { id: string };
}) {
  const { userId } = await auth();
  if (!userId) return null;
  const job = await prisma.jobApplication.findFirst({
    where: { id: params.id, userId },
  });
  if (!job) return notFound();

  const dateVal = job.dateApplied.toISOString().slice(0, 10);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Edit job</h1>
      <Card className="p-4">
        <form action={saveJobAction} className="grid gap-3">
          <input type="hidden" name="id" defaultValue={job.id} />

          <div className="grid gap-1">
            <Label htmlFor="title">Job title</Label>
            <Input id="title" name="title" required defaultValue={job.title} />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="company">Company</Label>
            <Input
              id="company"
              name="company"
              required
              defaultValue={job.company}
            />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="link">Link</Label>
            <Input id="link" name="link" defaultValue={job.link ?? ""} />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="dateApplied">Date applied</Label>
            <Input
              id="dateApplied"
              name="dateApplied"
              type="date"
              defaultValue={dateVal}
            />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="salary">Salary</Label>
            <Input
              id="salary"
              name="salary"
              type="number"
              min="0"
              defaultValue={job.salary ?? undefined}
            />
          </div>

          <div className="grid gap-1">
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              name="status"
              defaultValue={job.status}
              className="h-9 rounded-md border px-3 text-sm"
            >
              <option value="APPLIED">Applied</option>
              <option value="INTERVIEW">Interview</option>
              <option value="OFFER">Offer</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div className="grid gap-1">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" name="notes" defaultValue={job.notes ?? ""} />
          </div>

          <div className="mt-2 flex justify-end gap-2">
            <Button type="submit">Save changes</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
