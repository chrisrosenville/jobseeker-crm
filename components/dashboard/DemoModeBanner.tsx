"use client";

import { useIsDemoUser } from "@/hooks/useUserRole";
import { AlertCircle } from "lucide-react";

export function DemoModeBanner() {
  const { isDemoUser, isLoading } = useIsDemoUser();

  if (isLoading || !isDemoUser) return null;

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400">
        <AlertCircle className="h-4 w-4 flex-shrink-0" />
        <p>
          <span className="font-semibold">{"Demo Mode"}</span>
          {
            " — You're viewing a read-only demo. Actions like adding, editing, or deleting are disabled."
          }
        </p>
      </div>
    </div>
  );
}
