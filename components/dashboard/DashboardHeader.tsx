import { UserButton } from "@clerk/nextjs";
import { BriefcaseBusiness, Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SidebarNav } from "@/components/dashboard/SidebarNav";

export const DashboardHeader = () => {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-3 px-4 md:px-6">
        <div className="flex items-center gap-2 text-foreground">
          {/* Mobile/Tablet menu trigger */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <SidebarNav closeOnNavigate className="px-2 py-3 grid gap-1" />
              </SheetContent>
            </Sheet>
          </div>

          {/* Brand (hidden on small screens) */}
          <div className="hidden md:flex items-center gap-2">
            <BriefcaseBusiness className="h-5 w-5" />
            <span className="font-semibold">Jobseeeker</span>
          </div>
        </div>
        <div className="ml-auto flex items-center">
          <UserButton afterSwitchSessionUrl="/" />
        </div>
      </div>
    </header>
  );
};
