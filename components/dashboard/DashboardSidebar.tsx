"use client";

import { useEffect, useState } from "react";
import { SidebarNav } from "@/components/dashboard/SidebarNav";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";

export default function DashboardSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem("dashboard.sidebar.collapsed");
    if (stored !== null) {
      setCollapsed(stored === "true");
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(
      "dashboard.sidebar.collapsed",
      String(collapsed),
    );
  }, [collapsed]);

  return (
    <aside
      className={cn(
        "hidden lg:flex shrink-0 border-r min-h-[calc(100vh-3.5rem)] top-14 left-0 sticky transition-[width] duration-200",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex w-full flex-col">
        <div
          className={cn(
            "flex items-center justify-between px-3 py-3",
            collapsed && "justify-center",
          )}
        >
          {!collapsed && (
            <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Navigation
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => setCollapsed((value) => !value)}
          >
            {collapsed ? (
              <PanelLeftOpen className="h-4 w-4" />
            ) : (
              <PanelLeftClose className="h-4 w-4" />
            )}
          </Button>
        </div>
        <SidebarNav collapsed={collapsed} className="px-2" />
      </div>
    </aside>
  );
}
