import { NextResponse } from "next/server";
import { currentUser, auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  const { isAuthenticated, sessionId } = await auth();
  if (!isAuthenticated) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const user = await currentUser();
  if (!user) {
    return new NextResponse("User not found", { status: 404 });
  }

  const url = new URL(request.url);

  if (!user.id) {
    url.pathname = "/auth/signin";
    return NextResponse.redirect(url);
  }

  const clerkAuthClient = await clerkClient();

  try {
    const email = user.emailAddresses?.[0]?.emailAddress ?? null;
    if (!email) {
      return new NextResponse("Email not found", { status: 404 });
    }

    await prisma.user.upsert({
      where: { id: user.id },
      update: { email },
      create: { id: user.id, email },
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
