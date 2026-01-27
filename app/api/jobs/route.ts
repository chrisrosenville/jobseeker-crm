import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { JobApplication } from "@prisma/client";

const jobSchema = z.object({
  title: z
    .string()
    .min(5, "Job title must be at least 5 characters long")
    .max(100, "Job title must be less than 100 characters long"),
  company: z
    .string()
    .min(2, "Company name must be at least 2 characters long")
    .max(50, "Company name must be less than 50 characters long"),
  link: z.url("Invalid URL").optional().nullable(),
  dateApplied: z.coerce.date({ message: "Invalid date applied" }),
  salary: z.string("Invalid salary").optional().nullable(),
  notes: z.string().optional().nullable(),
});

export async function GET() {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const jobApplications = await prisma.jobApplication.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });

  const jobDataWithoutUserId: Omit<JobApplication, "userId">[] = [];
  for (const job of jobApplications) {
    const { userId: _userId, ...jobData } = job;
    void _userId;
    jobDataWithoutUserId.push(jobData);
  }

  return NextResponse.json(jobDataWithoutUserId);
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const body = await request.json();
  const parsed = jobSchema.safeParse(body);
  if (!parsed.success) {
    return new NextResponse(
      JSON.stringify({
        errors: parsed.error.issues.map((issue) => ({
          path: issue.path,
          message: issue.message,
        })),
      }),
      { status: 400 },
    );
  }
  const { title, company, link, dateApplied, salary, notes } = parsed.data;

  const newJobApplication = await prisma.jobApplication.create({
    data: {
      title,
      company,
      dateApplied,
      link,
      salary,
      notes,
      userId,
    },
  });

  if (!newJobApplication) {
    return new NextResponse("Internal server error", {
      status: 500,
    });
  }

  const {
    userId: _userId,
    updatedAt: _updatedAt,
    createdAt: _createdAt,
    ...jobData
  } = newJobApplication;
  void _userId;
  void _updatedAt;
  void _createdAt;

  return NextResponse.json(jobData, { status: 201 });
}
