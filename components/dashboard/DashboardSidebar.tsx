import { SidebarNav } from "@/components/dashboard/SidebarNav";

export default function DashboardSidebar() {
  return (
    <aside className="hidden lg:flex w-64 shrink-0 border-r min-h-[calc(100vh-3.5rem)] top-14 left-0">
      <SidebarNav />
    </aside>
  );
}
