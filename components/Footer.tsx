import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative bg-background">
      <div className="border-t" />
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="col-span-1">
            <div className="flex items-center gap-2 text-base font-semibold">
              JobSeeker CRM
            </div>
            <p className="text-muted-foreground mt-3 text-sm">
              A clean, focused workspace for managing your job search—from first
              application to final offer.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Product</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#why" className="hover:underline">
                  Why JobSeeker
                </Link>
              </li>
              <li>
                <Link href="#how" className="hover:underline">
                  How it works
                </Link>
              </li>
              <li>
                <Link href="#preview" className="hover:underline">
                  Preview
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Support</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:underline">
                  Guides
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Contact us
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-semibold">Account</h4>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/auth/signin" className="hover:underline">
                  Sign in
                </Link>
              </li>
              <li>
                <Link href="/auth/signup" className="hover:underline">
                  Create account
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} JobSeeker CRM. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:underline">
              Privacy
            </a>
            <a href="#" className="hover:underline">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
