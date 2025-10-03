import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { userId, sessionId } = await auth();
  const clerkAuthClient = await clerkClient();

  const url = new URL(request.url);

  if (!userId) {
    url.pathname = "/auth/signin";
    return NextResponse.redirect(url);
  }

  try {
    const user = await clerkAuthClient.users.getUser(userId);
    const email = user.emailAddresses?.[0]?.emailAddress ?? null;

    await prisma.user.upsert({
      where: { id: userId },
      update: { email },
      create: { id: userId, email },
    });

    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  } catch (err) {
    if (sessionId) {
      try {
        await clerkAuthClient.sessions.revokeSession(sessionId);
      } catch {}
    }
    url.pathname = "/auth/signin";
    url.searchParams.set("error", "account_setup_failed");
    return NextResponse.redirect(url);
  }
}
