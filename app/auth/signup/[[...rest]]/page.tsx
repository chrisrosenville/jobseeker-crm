import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <SignUp
        appearance={{
          elements: {
            formButtonPrimary: "bg-black text-white hover:bg-black/90",
          },
        }}
        routing="path"
        path="/auth/signup"
        signInUrl="/auth/signin"
        forceRedirectUrl="/auth/callback"
      />
    </div>
  );
}
