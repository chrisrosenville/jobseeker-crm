import Link from "next/link";
import { ReactNode } from "react";
import {
  BriefcaseBusiness,
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  Menu,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navigationItems = [
  {
    href: "/dashboard",
    icon: LayoutDashboard,
    label: "Dashboard",
  },
  {
    href: "/dashboard/jobs",
    icon: BriefcaseBusiness,
    label: "Jobs",
  },
  {
    href: "/dashboard/contacts",
    icon: Users,
    label: "Contacts",
  },
  {
    href: "/dashboard/analytics",
    icon: BarChart3,
    label: "Analytics",
  },
  {
    href: "/dashboard/ai-application",
    icon: Bot,
    label: "AI Application",
  },
  {
    href: "/dashboard/settings",
    icon: Settings,
    label: "Settings",
  },
];

function NavLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Button asChild variant="ghost" className="justify-start w-full">
      <Link href={href} prefetch>
        {children}
      </Link>
    </Button>
  );
}

export default function DashboardSidebar() {
  return (
    <>
      {/* Mobile Sidebar */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <nav className="px-2 py-3 grid gap-1">
              {navigationItems.map((item) => (
                <NavLink key={item.href} href={item.href}>
                  <span className="inline-flex items-center gap-2">
                    <item.icon className="h-4 w-4" /> {item.label}
                  </span>
                </NavLink>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 border-r min-h-[calc(100vh-3.5rem)] top-14 left-0">
        <nav className="p-4 flex w-full flex-col gap-1">
          {navigationItems.map((item) => (
            <NavLink key={item.href} href={item.href}>
              <span className="inline-flex items-center gap-2">
                <item.icon className="h-4 w-4" /> {item.label}
              </span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
