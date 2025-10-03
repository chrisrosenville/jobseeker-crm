import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { AddJobDialog } from "@/components/modals/AddJobDialog";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";

export default async function DashboardHome() {
  const { userId } = await auth();
  if (!userId) return null;

  const jobs = await prisma.jobApplication.findMany({ where: { userId } });
  const stats = {
    total: jobs.length,
    applied: jobs.filter((j: { status: string }) => j.status === "APPLIED")
      .length,
    interview: jobs.filter((j: { status: string }) => j.status === "INTERVIEW")
      .length,
    offer: jobs.filter((j: { status: string }) => j.status === "OFFER").length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Your Applications</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            {stats.total} total · {stats.applied} applied · {stats.interview}{" "}
            interviews · {stats.offer} offers
          </p>
        </div>
        <AddJobDialog />
      </div>
      <KanbanBoard initialJobs={jobs as any} />
    </div>
  );
}
