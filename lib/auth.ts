import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";
import { UserRole } from "@prisma/client";

/**
 * Check if the current authenticated user has a DEMO role
 * @returns true if user is a demo user, false otherwise
 */
export async function isDemoUser(): Promise<boolean> {
  const { userId } = await auth();
  if (!userId) return false;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  return user?.role === UserRole.DEMO;
}

/**
 * Get the current user's role
 * @returns UserRole or null if not authenticated
 */
export async function getUserRole(): Promise<UserRole | null> {
  const { userId } = await auth();
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  return user?.role ?? null;
}
