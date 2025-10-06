import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ThemeSelector } from "@/components/settings/ThemeSelector";
import { AccountActions } from "@/components/settings/AccountActions";

export default async function SettingsPage() {
  const { userId } = await auth();
  if (!userId) return redirect("/auth/signin");
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Settings</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Personalize your experience and manage your account.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <ThemeSelector />
        <AccountActions />
      </div>
    </div>
  );
}
