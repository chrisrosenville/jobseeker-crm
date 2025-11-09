"use server";

import { auth, currentUser } from "@clerk/nextjs/server";
import { BoardSection } from "@/components/dashboard/BoardSection";

export default async function DashboardHome() {
  const { isAuthenticated } = await auth();
  if (!isAuthenticated) return <div>Sign in to view your dashboard</div>;

  const user = await currentUser();
  if (!user) return <div>User not found</div>;

  return <BoardSection />;
}
