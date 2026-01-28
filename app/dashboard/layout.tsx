import { ReactNode, Suspense } from "react";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs";
import { LoadingScreen } from "@/components/LoadingScreen";
import { DashboardPrefetcher } from "@/components/dashboard/DashboardPrefetcher";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DemoModeBanner } from "@/components/dashboard/DemoModeBanner";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Jobseeeker - Dashboard",
  description: "Track and manage your job applications",
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>

      <SignedIn>
        <div className="min-h-screen bg-background">
          <DashboardPrefetcher />
          <DashboardHeader />
          <DemoModeBanner />
          <div className="flex">
            <DashboardSidebar />
            <main className="flex-1 px-4 py-6 md:px-8 lg:px-10">
              <Suspense fallback={<LoadingScreen />}>{children}</Suspense>
            </main>
          </div>
        </div>
      </SignedIn>
    </>
  );
}
