"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function DashboardPrefetcher() {
  const router = useRouter();

  useEffect(() => {
    const routes = [
      "/dashboard",
      "/dashboard/jobs",
      "/dashboard/contacts",
      "/dashboard/analytics",
    ];
    for (const r of routes) router.prefetch(r);
  }, [router]);

  return null;
}
