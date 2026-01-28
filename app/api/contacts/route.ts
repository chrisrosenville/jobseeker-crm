import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { isDemoUser } from "@/lib/auth";
import { ContactRole } from "@prisma/client";

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const contacts = await prisma.contact.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { job: true },
  });
  return NextResponse.json(contacts);
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (await isDemoUser()) {
    return NextResponse.json(
      { message: "Demo users cannot create contacts" },
      { status: 403 },
    );
  }

  const body = await request.json();
  const { name, email, phone, role, jobId } = body as {
    name: string;
    email?: string;
    phone?: string;
    role?: ContactRole | null;
    jobId?: string;
  };

  if (!name) {
    return NextResponse.json({ message: "Missing name" }, { status: 400 });
  }

  const contact = await prisma.contact.create({
    data: {
      name,
      email,
      phone,
      role,
      jobId,
      userId,
    },
  });
  return NextResponse.json(contact, { status: 201 });
}
