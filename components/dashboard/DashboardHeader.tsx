import { UserButton } from "@clerk/nextjs";
import { BriefcaseBusiness } from "lucide-react";

export const DashboardHeader = () => {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-3 px-4 md:px-6">
        <div className="hidden md:flex items-center gap-2 text-foreground">
          <BriefcaseBusiness className="h-5 w-5" />
          <span className="font-semibold">Jobseeeker</span>
        </div>
        <div className="ml-auto flex items-center">
          <UserButton afterSwitchSessionUrl="/" />
        </div>
      </div>
    </header>
  );
};
