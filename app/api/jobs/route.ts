import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const jobs = await prisma.jobApplication.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(jobs);
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const body = await request.json();
  const {
    title,
    company,
    link,
    dateApplied,
    salary,
    notes,
  }: {
    title: string;
    company: string;
    link?: string;
    dateApplied?: string;
    salary?: number;
    notes?: string;
  } = body;

  if (!title || !company) {
    return new NextResponse("Missing required fields", { status: 400 });
  }

  const job = await prisma.jobApplication.create({
    data: {
      title,
      company,
      link,
      dateApplied: dateApplied ? new Date(dateApplied) : undefined,
      salary: salary ?? undefined,
      notes,
      userId,
    },
  });
  return NextResponse.json(job, { status: 201 });
}
