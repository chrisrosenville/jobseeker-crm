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
import { cn } from "@/lib/utils";

export const navigationItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/dashboard/jobs", icon: BriefcaseBusiness, label: "Jobs" },
  { href: "/dashboard/contacts", icon: Users, label: "Contacts" },
  { href: "/dashboard/analytics", icon: BarChart3, label: "Analytics" },
  { href: "/dashboard/ai-application", icon: Bot, label: "AI Application" },
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
];

function NavLink({
  href,
  children,
  label,
  collapsed,
}: {
  href: string;
  children: ReactNode;
  label: string;
  collapsed: boolean;
}) {
  return (
    <Button
      asChild
      variant="ghost"
      size={collapsed ? "icon" : "default"}
      className={cn(
        collapsed
          ? "h-9 w-9 justify-center rounded-md"
          : "w-full justify-start",
      )}
    >
      <Link
        href={href}
        prefetch
        aria-label={label}
        className={cn(
          "relative group flex items-center",
          collapsed ? "justify-center" : "w-full",
        )}
      >
        {children}
      </Link>
    </Button>
  );
}

export function SidebarNav({
  closeOnNavigate = false,
  className,
  collapsed = false,
}: {
  closeOnNavigate?: boolean;
  className?: string;
  collapsed?: boolean;
}) {
  return (
    <nav
      className={cn(
        "flex w-full flex-col gap-1",
        collapsed ? "p-2 items-center" : "p-4",
        className,
      )}
      data-collapsed={collapsed}
    >
      {navigationItems.map((item) => {
        const content = (
          <NavLink
            key={item.href}
            href={item.href}
            label={item.label}
            collapsed={collapsed}
          >
            <span
              className={cn(
                "inline-flex items-center gap-2",
                collapsed && "flex-col",
              )}
            >
              <item.icon className="h-4 w-4" />
              {collapsed ? (
                <span className="sr-only">{item.label}</span>
              ) : (
                <span className="text-sm">{item.label}</span>
              )}
            </span>
            {collapsed && (
              <span className="pointer-events-none absolute left-full top-1/2 -translate-y-1/2 whitespace-nowrap rounded-md border bg-background px-2 py-1 text-xs font-medium text-foreground shadow-sm opacity-0 transition-opacity group-hover:opacity-100">
                {item.label}
              </span>
            )}
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
