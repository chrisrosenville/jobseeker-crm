import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { BoardSection } from "@/components/dashboard/BoardSection";
import type { Job } from "@/lib/types";

export default async function DashboardHome() {
  const { userId } = await auth();
  if (!userId) return null;

  const jobs = await prisma.jobApplication.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  const initialJobs: Job[] = jobs.map((j) => ({
    id: j.id,
    title: j.title,
    company: j.company,
    status: j.status as Job["status"],
    link: j.link ?? null,
    salary: j.salary ?? null,
    dateApplied: j.dateApplied.toISOString(),
    notes: j.notes ?? null,
    userId: j.userId,
    createdAt: j.createdAt.toISOString(),
    updatedAt: j.updatedAt.toISOString(),
  }));
  return <BoardSection initialJobs={initialJobs} />;
}
