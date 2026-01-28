import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { isDemoUser } from "@/lib/auth";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (await isDemoUser()) {
    return NextResponse.json(
      { message: "Demo users cannot edit contacts" },
      { status: 403 },
    );
  }

  const { id } = await params;

  const data = await request.json();

  const existing = await prisma.contact.findUnique({
    where: { id },
  });
  if (!existing || existing.userId !== userId)
    return new NextResponse("Not found", { status: 404 });

  const contact = await prisma.contact.update({
    where: { id },
    data: {
      ...("name" in data ? { name: data.name } : {}),
      ...("email" in data ? { email: data.email } : {}),
      ...("phone" in data ? { phone: data.phone } : {}),
      ...("role" in data ? { role: data.role } : {}),
      ...("jobId" in data ? { jobId: data.jobId } : {}),
    },
  });
  return NextResponse.json(contact);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  if (await isDemoUser()) {
    return NextResponse.json(
      { message: "Demo users cannot delete contacts" },
      { status: 403 },
    );
  }

  const { id } = await params;

  const existing = await prisma.contact.findUnique({
    where: { id },
  });
  if (!existing || existing.userId !== userId)
    return new NextResponse("Not found", { status: 404 });

  await prisma.contact.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
