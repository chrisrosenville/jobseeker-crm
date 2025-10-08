import Link from "next/link";
import { ThemeToggle } from "@/components/settings/ThemeToggle";

export default function Header() {
  return (
    <header className="sticky top-0 z-10 w-full bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-base font-semibold"
        >
          Jobseeeker
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          {/* Theme Toggle */}
          <ThemeToggle />

          <div className="ml-2 hidden h-5 w-px bg-border sm:block" />
          <Link
            href="/auth/signin"
            className="rounded-md px-3 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
          >
            Sign in
          </Link>
          <Link
            href="/auth/signup"
            className="rounded-md bg-foreground px-3 py-1.5 text-sm font-medium text-background hover:bg-foreground/90"
          >
            Create account
          </Link>
        </nav>
      </div>
    </header>
  );
}
