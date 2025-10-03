import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const contacts = await prisma.contact.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { job: true },
  });
  return NextResponse.json(contacts);
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) return new NextResponse("Unauthorized", { status: 401 });

  const body = await request.json();
  const { name, email, phone, role, jobId } = body as {
    name: string;
    email?: string;
    phone?: string;
    role?: string;
    jobId?: string;
  };

  if (!name) return new NextResponse("Missing name", { status: 400 });

  const contact = await prisma.contact.create({
    data: { name, email, phone, role, jobId, userId },
  });
  return NextResponse.json(contact, { status: 201 });
}
