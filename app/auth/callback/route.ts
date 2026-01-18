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
  const intent = url.searchParams.get("intent") ?? "signin";

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

    if (intent === "signin") {
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (!existingUser || existingUser.id !== user.id) {
        // User tried signing in with an email that has no account in our DB.
        if (sessionId) {
          try {
            await clerkAuthClient.sessions.revokeSession(sessionId);
          } catch {}
        }

        url.search = "";
        url.pathname = "/auth/signin";
        url.searchParams.set("error", "account_not_found");
        return NextResponse.redirect(url);
      }

      await prisma.user.update({
        where: { id: existingUser.id },
        data: { email },
      });
    } else {
      await prisma.user.upsert({
        where: { id: user.id },
        update: { email },
        create: { id: user.id, email },
      });
    }

    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  } catch (err) {
    if (sessionId) {
      try {
        await clerkAuthClient.sessions.revokeSession(sessionId);
      } catch {}
    }
    url.search = "";
    url.pathname = "/auth/signin";
    url.searchParams.set("error", "account_setup_failed");
    return NextResponse.redirect(url);
  }
}
