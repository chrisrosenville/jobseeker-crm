"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SignIn } from "@clerk/nextjs";

export default function Page() {
  const searchParams = useSearchParams();
  const [dismissed, setDismissed] = useState(false);

  const error = useMemo(() => searchParams.get("error"), [searchParams]);

  const showSetupFailed = !dismissed && error === "account_setup_failed";
  const showAccountNotFound = !dismissed && error === "account_not_found";

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      {showSetupFailed ? (
        <div className="fixed top-4 left-1/2 z-10 flex w-full max-w-lg -translate-x-1/2 items-start gap-3 rounded-xl border border-red-200/80 bg-white/90 px-4 py-3 text-sm text-red-800 shadow-2xl ring-1 ring-red-100/70 backdrop-blur">
          <div className="flex-1">
            {
              "We couldn't finish setting up your account. Please try signing in again."
            }
          </div>
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-200/70 bg-white/70 text-red-700 transition hover:border-red-300 hover:text-red-900"
            onClick={() => setDismissed(true)}
            aria-label="Dismiss"
          >
            X
          </button>
        </div>
      ) : null}
      {showAccountNotFound ? (
        <div className="fixed top-4 left-1/2 z-10 w-full max-w-lg -translate-x-1/2 rounded-xl border border-amber-200/80 bg-white/90 px-4 py-3 text-sm text-amber-900 shadow-2xl ring-1 ring-amber-100/70 backdrop-blur">
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <p className="font-semibold">
                We couldn't find an account connected to that social login.
              </p>
              <p className="mt-1">Would you like to create one instead?</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Link
                  href="/auth/signup"
                  className="rounded-md bg-amber-900 px-3 py-1.5 text-xs font-medium text-amber-50 shadow-sm transition hover:bg-amber-800"
                >
                  Create an account
                </Link>
              </div>
            </div>
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-amber-200/70 bg-white/70 text-amber-900 transition hover:border-amber-300 hover:text-amber-700"
              onClick={() => setDismissed(true)}
              aria-label="Dismiss"
            >
              X
            </button>
          </div>
        </div>
      ) : null}
      <SignIn
        appearance={{
          elements: {
            formButtonPrimary: "bg-black text-white hover:bg-black/90",
          },
        }}
        routing="path"
        path="/auth/signin"
        signUpUrl="/auth/signup"
        forceRedirectUrl="/auth/callback?intent=signin"
      />
    </div>
  );
}
