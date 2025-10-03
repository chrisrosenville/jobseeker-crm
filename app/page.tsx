import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { KanbanSquare, Users, FileText, BarChart3 } from "lucide-react";

export default async function Home() {
  const user = await currentUser();
  if (user) redirect("/dashboard");

  return (
    <main>
      {/* Header */}
      <header className="sticky top-0 z-10 w-full bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-base font-semibold"
          >
            <span className="inline-block h-2 w-2 rounded-full bg-black" />
            JobSeeker CRM
          </Link>
          <nav className="flex items-center gap-3 text-sm">
            <Link href="#features" className="hover:underline">
              Features
            </Link>
            <Link href="#preview" className="hover:underline">
              Preview
            </Link>
            <div className="ml-2 hidden h-5 w-px bg-gray-200 sm:block" />
            <Link
              href="/auth/signin"
              className="rounded-md px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
            >
              Sign in
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-md bg-black px-3 py-1.5 text-sm font-medium text-white hover:bg-black/90"
            >
              Create account
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden pb-20 pt-20 sm:pb-24 sm:pt-28">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.08),transparent_60%)]" />
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h1 className="mx-auto max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Stay organized and land your next role faster
          </h1>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl">
            Manage applications, track stages on a Kanban board, keep notes, and
            never lose a recruiter contact again.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="/auth/signup"
              className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/90"
            >
              Get started
            </Link>
            <Link
              href="#features"
              className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t bg-white py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border p-6">
              <KanbanSquare className="h-6 w-6" />
              <h3 className="mt-4 text-base font-semibold">Kanban board</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Drag and drop between stages: Applied, Interview, Offer,
                Rejected.
              </p>
            </div>
            <div className="rounded-lg border p-6">
              <Users className="h-6 w-6" />
              <h3 className="mt-4 text-base font-semibold">Contacts</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Store recruiter and interviewer info linked to each application.
              </p>
            </div>
            <div className="rounded-lg border p-6">
              <FileText className="h-6 w-6" />
              <h3 className="mt-4 text-base font-semibold">Notes</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Keep interview prep, reminders, and follow-ups all in one place.
              </p>
            </div>
            <div className="rounded-lg border p-6">
              <BarChart3 className="h-6 w-6" />
              <h3 className="mt-4 text-base font-semibold">Analytics</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                See progress across stages and optimize your job search.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Preview */}
      <section id="preview" className="bg-gray-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="rounded-xl border bg-white p-4 shadow-sm">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg border">
              <Image
                src="/window.svg"
                alt="App preview"
                fill
                className="object-contain p-6"
                priority
              />
            </div>
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/auth/signup"
              className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-black/90"
            >
              Create your free account
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 sm:flex-row">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} JobSeeker CRM
          </p>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <Link href="#features" className="hover:underline">
              Features
            </Link>
            <Link href="/auth/signin" className="hover:underline">
              Sign in
            </Link>
            <Link href="/auth/signup" className="hover:underline">
              Create account
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
