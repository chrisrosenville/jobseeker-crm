import { useQuery } from "@tanstack/react-query";
import { UserRole } from "@prisma/client";

async function fetchUserRole(): Promise<UserRole | null> {
  const res = await fetch("/api/account/role");
  if (!res.ok) return null;
  const data = await res.json();
  return data.role;
}

export function useUserRole() {
  return useQuery({
    queryKey: ["user-role"],
    queryFn: fetchUserRole,
    staleTime: Infinity, // Role rarely changes
  });
}

export function useIsDemoUser() {
  const { data: role, isLoading } = useUserRole();
  return {
    isDemoUser: role === "DEMO",
    isLoading,
  };
}
