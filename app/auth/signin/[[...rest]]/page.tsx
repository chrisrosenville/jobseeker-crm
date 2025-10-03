import { SignIn } from "@clerk/nextjs";

export default function Page({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const error = searchParams?.error;

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      {error === "account_setup_failed" ? (
        <div className="fixed top-4 left-1/2 z-10 -translate-x-1/2 rounded bg-red-50 px-4 py-2 text-sm text-red-700">
          {
            "We couldn't finish setting up your account. Please try signing in again."
          }
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
        forceRedirectUrl="/auth/callback"
      />
    </div>
  );
}
