import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const { id } = await params;

  const job = await prisma.jobApplication.findFirst({
    where: { id, userId },
    include: { contacts: true },
  });
  if (!job) return new NextResponse("Not found", { status: 404 });
  return NextResponse.json(job);
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const { id } = await params;

  const data = await request.json();
  const job = await prisma.jobApplication.update({
    where: { id },
    data: {
      ...("title" in data ? { title: data.title } : {}),
      ...("company" in data ? { company: data.company } : {}),
      ...("link" in data ? { link: data.link } : {}),
      ...("dateApplied" in data
        ? { dateApplied: new Date(data.dateApplied) }
        : {}),
      ...("salary" in data ? { salary: data.salary } : {}),
      ...("notes" in data ? { notes: data.notes } : {}),
      ...("status" in data ? { status: data.status } : {}),
    },
  });
  if (job.userId !== userId)
    return new NextResponse("Forbidden", { status: 403 });
  return NextResponse.json(job);
}

export async function DELETE(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const { id } = await params;

  const existing = await prisma.jobApplication.findUnique({
    where: { id },
  });
  if (!existing || existing.userId !== userId)
    return new NextResponse("Not found", { status: 404 });

  await prisma.jobApplication.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
