"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useClerk } from "@clerk/nextjs";

export function AccountActions() {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);
  const { signOut } = useClerk();

  async function handleSignOut() {
    setLoading("signout");
    try {
      await signOut({ redirectUrl: "/" });
    } finally {
      setLoading(null);
    }
  }

  async function handleDeleteAccount() {
    if (
      !confirm(
        "Are you sure you want to delete your account? This cannot be undone."
      )
    )
      return;
    setLoading("delete");
    try {
      const res = await fetch("/api/account", { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete account");
      router.push("/");
    } finally {
      setLoading(null);
    }
  }

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Account</CardTitle>
        <CardDescription>
          Sign out or permanently delete your account.
        </CardDescription>
      </CardHeader>
      <CardContent className="py-6">
        <div className="flex flex-wrap gap-3">
          <Button
            variant="outline"
            onClick={handleSignOut}
            disabled={loading === "signout"}
          >
            {loading === "signout" ? "Signing out…" : "Sign out"}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={loading === "delete"}
          >
            {loading === "delete" ? "Deleting…" : "Delete account"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
