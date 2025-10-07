import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { BadgeCheck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default async function Home() {
  const user = await currentUser();
  if (user) redirect("/dashboard");

  return (
    <main className="bg-background text-foreground">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden py-20 sm:py-28">
        {/* Backdrop accents */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute left-1/2 top-[-20%] h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-200/60 via-indigo-200/40 to-transparent blur-3xl dark:from-blue-500/20 dark:via-indigo-500/10" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,0,0,0.06),transparent_60%)] dark:bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.06),transparent_60%)]" />
        </div>
        <div className="mx-auto max-w-6xl px-6 text-center">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium shadow-sm backdrop-blur">
            <BadgeCheck className="h-3.5 w-3.5" />
            Built for clarity and speed
          </div>
          <h1 className="mx-auto mt-4 max-w-4xl text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Stay organized and land your next role faster
          </h1>
          <p className="text-muted-foreground mx-auto mt-4 max-w-2xl text-base md:text-lg">
            Manage applications on a Kanban board, keep notes, and never lose a
            recruiter contact again.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Link
              href="/auth/signup"
              className="rounded-xl bg-foreground px-5 py-2.5 text-sm font-medium text-background shadow-sm hover:bg-foreground/90"
            >
              Get started free
            </Link>
            <Link
              href="#why"
              className="rounded-xl border px-5 py-2.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              Learn more
            </Link>
          </div>
        </div>
      </section>

      {/* Preview */}
      <section id="preview" className="bg-background py-16 px-4">
        <div className="relative aspect-[16/9] w-full max-w-3xl md:max-w-6xl mx-auto rounded-xl overflow-hidden p-4">
          <div className="absolute inset-0 bg-black/70 z-20 flex items-center justify-center dark:bg-black/60">
            <div className="px-6 text-center text-white">
              <h3 className="text-2xl md:text-3xl font-bold tracking-tight">
                Job search chaos stops here
              </h3>
              <p className="mt-2 max-w-2xl mx-auto text-sm md:text-base text-white/90">
                JobSeeker puts roles, stages, contacts, and notes in one clean
                flow—so you always know the status, the context, and the next
                action to move each opportunity forward.
              </p>
              <div className="mt-4">
                <Link
                  href="/auth/signup"
                  className="inline-block rounded-xl bg-white/90 px-4 py-2 text-sm font-medium text-black shadow-sm hover:bg-white"
                >
                  Start organizing now
                </Link>
              </div>
            </div>
          </div>
          <Image
            src="/frustrated.jpg"
            alt="Frustrated person"
            fill
            className="object-cover z-10"
          />
        </div>
      </section>

      {/* Why use JobSeeker? */}
      <section id="why" className="bg-background py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Why use JobSeeker?
            </h2>
            <p className="text-muted-foreground mt-2">
              Tracking your job applications, what stage you are at, and who to
              contact can be a lot of work. <br /> That is where JobSeeker comes
              in.
            </p>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h3 className="text-base font-semibold">
                  Everything in one place
                </h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  No more juggling spreadsheets, notes, and emails. Keep roles,
                  links, notes, contacts, and activity in one clean view so you
                  can spend energy on the next step—not on finding information.
                </p>
              </div>
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h3 className="text-base font-semibold">
                  Never miss a follow‑up
                </h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  Interviews slip when next steps live in your head. Capture
                  commitments and reminders next to each application so outreach
                  happens on time—without digging through inboxes.
                </p>
              </div>
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h3 className="text-base font-semibold">
                  Know where you stand
                </h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  See what’s in Applied, Interview, Offer, or Rejected at a
                  glance. Dates and recent activity make it obvious which roles
                  need attention today.
                </p>
              </div>
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h3 className="text-base font-semibold">
                  Contacts with context
                </h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  Recruiters, interviewers, and hiring managers stay linked to
                  the application. Reach out with full context—names, roles, and
                  previous conversations are always at hand.
                </p>
              </div>
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h3 className="text-base font-semibold">
                  Prep without the scramble
                </h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  Keep research, talking points, and questions right where you
                  need them. Walk into each conversation prepared with notes
                  tailored to the role and team.
                </p>
              </div>
              <div className="rounded-xl border bg-card p-6 shadow-sm">
                <h3 className="text-base font-semibold">Learn what works</h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  See which sources convert, how long stages take, and where
                  offers come from. Use data to prioritize effort and iterate on
                  your approach—not guess.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="bg-muted py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">
              Get set up in minutes
            </h2>
            <p className="text-muted-foreground mt-2">
              Move from chaos to clarity with a simple workflow.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="inline-flex size-8 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                1
              </div>
              <h3 className="mt-4 text-base font-semibold">
                Create your board
              </h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Add jobs, set status, and import existing applications.
              </p>
            </div>
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="inline-flex size-8 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                2
              </div>
              <h3 className="mt-4 text-base font-semibold">Track progress</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Drag cards between stages and keep notes and contacts together.
              </p>
            </div>
            <div className="rounded-xl border bg-card p-6 shadow-sm">
              <div className="inline-flex size-8 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                3
              </div>
              <h3 className="mt-4 text-base font-semibold">Stay on top</h3>
              <p className="text-muted-foreground mt-2 text-sm">
                Use analytics and reminders to plan next steps with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      {/* <section className="relative overflow-hidden py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="rounded-2xl border bg-white p-8 text-center shadow-sm md:p-12">
            <h3 className="text-2xl font-bold tracking-tight md:text-3xl">
              Find your next role faster
            </h3>
            <p className="text-muted-foreground mx-auto mt-2 max-w-2xl">
              Start organizing applications and planning your next steps in
              minutes.
            </p>
            <div className="mt-6 flex items-center justify-center gap-3">
              <Link
                href="/auth/signup"
                className="rounded-xl bg-black px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-black/90"
              >
                Get started
              </Link>
              <Link
                href="#why"
                className="rounded-xl border px-5 py-2.5 text-sm font-medium hover:bg-gray-50"
              >
                See features
              </Link>
            </div>
          </div>
        </div>
      </section> */}

      <Footer />
    </main>
  );
}
