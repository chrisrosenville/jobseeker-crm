import { ReactNode } from "react";
import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <div className="min-h-screen">
          <header className="border-b bg-white">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
              <nav className="flex items-center gap-4 text-sm">
                <Link href="/dashboard">Dashboard</Link>
                <Link href="/dashboard/jobs">Jobs</Link>
                <Link href="/dashboard/contacts">Contacts</Link>
                <Link href="/dashboard/analytics">Analytics</Link>
              </nav>
              <UserButton afterSignOutUrl="/" />
            </div>
          </header>
          <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        </div>
      </SignedIn>
    </>
  );
}
