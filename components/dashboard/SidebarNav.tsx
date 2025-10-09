import Link from "next/link";
import { ReactNode } from "react";
import {
  BriefcaseBusiness,
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  Bot,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";

export const navigationItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/jobs", icon: BriefcaseBusiness, label: "Jobs" },
  { href: "/dashboard/contacts", icon: Users, label: "Contacts" },
  { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/dashboard/ai-application", icon: Bot, label: "AI Application" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
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

export function SidebarNav({
  closeOnNavigate = false,
  className,
}: {
  closeOnNavigate?: boolean;
  className?: string;
}) {
  return (
    <nav className={className ? className : "p-4 flex w-full flex-col gap-1"}>
      {navigationItems.map((item) => {
        const content = (
          <NavLink key={item.href} href={item.href}>
            <span className="inline-flex items-center gap-2">
              <item.icon className="h-4 w-4" /> {item.label}
            </span>
          </NavLink>
        );

        return closeOnNavigate ? (
          <SheetClose asChild key={item.href}>
            {content}
          </SheetClose>
        ) : (
          content
        );
      })}
    </nav>
  );
}
