import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { clerkClient } from "@clerk/nextjs/server";

export async function DELETE() {
  const { userId } = await auth();
  if (!userId)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Delete user data from our DB
  await prisma.contact.deleteMany({ where: { userId } });
  await prisma.jobApplication.deleteMany({ where: { userId } });
  await prisma.user.deleteMany({ where: { id: userId } });

  // Delete user from Clerk
  // Note: requires appropriate Clerk permissions configured in the environment
  const clerkAuthClient = await clerkClient();
  try {
    await clerkAuthClient.users.deleteUser(userId);
  } catch {
    // If Clerk deletion fails, we still return 200 since local data is gone
  }

  return NextResponse.json({ ok: true });
}
