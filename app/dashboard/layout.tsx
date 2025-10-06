import { ReactNode, Suspense } from "react";
import Link from "next/link";
import {
  SignedIn,
  SignedOut,
  RedirectToSignIn,
  UserButton,
} from "@clerk/nextjs";
import {
  BriefcaseBusiness,
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LoadingScreen } from "@/components/LoadingScreen";
import { DashboardPrefetcher } from "@/components/dashboard/DashboardPrefetcher";

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Button asChild variant="ghost" className="justify-start w-full">
      <Link href={href} prefetch>
        {children}
      </Link>
    </Button>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        <div className="min-h-screen bg-background">
          <DashboardPrefetcher />
          <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="flex h-14 items-center gap-3 px-4 md:px-6">
              <div className="flex items-center gap-2">
                <div className="hidden md:flex items-center gap-2 text-foreground">
                  <BriefcaseBusiness className="h-5 w-5" />
                  <span className="font-semibold">JobSeeker CRM</span>
                </div>
                <div className="md:hidden">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Open menu"
                      >
                        <Menu className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0">
                      <div className="px-4 py-3 flex items-center gap-2">
                        <BriefcaseBusiness className="h-5 w-5" />
                        <span className="font-semibold">JobSeeker CRM</span>
                      </div>
                      <Separator />
                      <nav className="px-2 py-3 grid gap-1">
                        <NavLink href="/dashboard">
                          <span className="inline-flex items-center gap-2">
                            <LayoutDashboard className="h-4 w-4" /> Dashboard
                          </span>
                        </NavLink>
                        <NavLink href="/dashboard/jobs">
                          <span className="inline-flex items-center gap-2">
                            <BriefcaseBusiness className="h-4 w-4" /> Jobs
                          </span>
                        </NavLink>
                        <NavLink href="/dashboard/contacts">
                          <span className="inline-flex items-center gap-2">
                            <Users className="h-4 w-4" /> Contacts
                          </span>
                        </NavLink>
                        <NavLink href="/dashboard/analytics">
                          <span className="inline-flex items-center gap-2">
                            <BarChart3 className="h-4 w-4" /> Analytics
                          </span>
                        </NavLink>
                        <NavLink href="/dashboard/settings">
                          <span className="inline-flex items-center gap-2">
                            <Settings className="h-4 w-4" /> Settings
                          </span>
                        </NavLink>
                      </nav>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
              <div className="ml-auto flex items-center">
                <UserButton afterSignOutUrl="/" />
              </div>
            </div>
          </header>
          <div className="flex">
            <aside className="hidden md:flex w-64 shrink-0 border-r min-h-[calc(100vh-3.5rem)] sticky top-14">
              <nav className="p-4 flex w-full flex-col gap-1">
                <NavLink href="/dashboard">
                  <span className="inline-flex items-center gap-2">
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </span>
                </NavLink>
                <NavLink href="/dashboard/jobs">
                  <span className="inline-flex items-center gap-2">
                    <BriefcaseBusiness className="h-4 w-4" /> Jobs
                  </span>
                </NavLink>
                <NavLink href="/dashboard/contacts">
                  <span className="inline-flex items-center gap-2">
                    <Users className="h-4 w-4" /> Contacts
                  </span>
                </NavLink>
                <NavLink href="/dashboard/analytics">
                  <span className="inline-flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" /> Analytics
                  </span>
                </NavLink>
                <NavLink href="/dashboard/settings">
                  <span className="inline-flex items-center gap-2">
                    <Settings className="h-4 w-4" /> Settings
                  </span>
                </NavLink>
              </nav>
            </aside>
            <main className="flex-1 px-4 py-6 md:px-8 lg:px-10">
              <Suspense fallback={<LoadingScreen />}>{children}</Suspense>
            </main>
          </div>
        </div>
      </SignedIn>
    </>
  );
}
