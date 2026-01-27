"use client";

import { AddJobDialog } from "@/components/modals/AddJobDialog";
import { KanbanBoard } from "@/components/kanban/KanbanBoard";
import { useJobApplications } from "@/hooks/useJobs";
import { LoadingScreen } from "../LoadingScreen";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  Sparkles,
  Users,
} from "lucide-react";
import { JOB_STATUS_LABELS } from "@/lib/types";

export function BoardSection() {
  const {
    data: jobApplications = [],
    isPending,
    isLoading,
  } = useJobApplications();

  if (isPending || isLoading) return <LoadingScreen />;

  const statusCounts = jobApplications.reduce(
    (acc, job) => {
      acc[job.status] += 1;
      return acc;
    },
    {
      APPLIED: 0,
      INTERVIEW: 0,
      OFFER: 0,
      REJECTED: 0,
    },
  );

  const totalApplications = jobApplications.length;
  const activeApplications =
    statusCounts.APPLIED + statusCounts.INTERVIEW + statusCounts.OFFER;

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border bg-gradient-to-br from-primary/10 via-background to-background p-6 shadow-sm md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-3">
            <Badge variant="secondary" className="gap-1">
              <Sparkles className="h-3.5 w-3.5" />
              Welcome back
            </Badge>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
                Your job search, organized and effortless.
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">
                Track every application, move cards as you progress, and keep
                your momentum visible at a glance.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <AddJobDialog />
              <Button variant="outline" asChild>
                <Link href="/dashboard/jobs">
                  View all jobs
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="grid w-full max-w-md grid-cols-2 gap-3">
            <Card className="border-white/40 bg-background/70 backdrop-blur">
              <CardHeader className="p-4">
                <CardTitle className="text-sm font-medium">
                  Total applications
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="text-2xl font-semibold">
                  {totalApplications}
                </div>
                <p className="text-muted-foreground text-xs">
                  {totalApplications === 0
                    ? "Start with your first role"
                    : `${activeApplications} active right now`}
                </p>
              </CardContent>
            </Card>
            <Card className="border-white/40 bg-background/70 backdrop-blur">
              <CardHeader className="p-4">
                <CardTitle className="text-sm font-medium">
                  Next steps
                </CardTitle>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="text-2xl font-semibold">
                  {statusCounts.INTERVIEW + statusCounts.OFFER}
                </div>
                <p className="text-muted-foreground text-xs">
                  Interviews + offers
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: JOB_STATUS_LABELS.APPLIED,
            value: statusCounts.APPLIED,
            description: "Recently submitted applications.",
            icon: BriefcaseBusiness,
          },
          {
            title: JOB_STATUS_LABELS.INTERVIEW,
            value: statusCounts.INTERVIEW,
            description: "Prep for upcoming conversations.",
            icon: CheckCircle2,
          },
          {
            title: JOB_STATUS_LABELS.OFFER,
            value: statusCounts.OFFER,
            description: "Negotiations and decisions ahead.",
            icon: BarChart3,
          },
        ].map((item) => (
          <Card key={item.title}>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-base font-semibold">
                  {item.title}
                </CardTitle>
                <CardDescription>{item.description}</CardDescription>
              </div>
              <div className="rounded-full border bg-muted/40 p-2 text-muted-foreground">
                <item.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">{item.value}</div>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Move cards to update status
            </CardTitle>
            <CardDescription>
              Drag and drop to keep your pipeline accurate and motivating.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {jobApplications.length > 0 ? (
              <KanbanBoard jobApplications={jobApplications} />
            ) : (
              <div className="rounded-xl border border-dashed bg-muted/30 p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-background shadow-sm">
                  <BriefcaseBusiness className="h-5 w-5 text-muted-foreground" />
                </div>
                <h3 className="mt-4 text-base font-semibold">
                  Add your first opportunity
                </h3>
                <p className="text-muted-foreground mt-2 text-sm">
                  Capture a role, track its stage, and unlock the full dashboard
                  experience.
                </p>
                <div className="mt-4 flex justify-center">
                  <AddJobDialog />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Quick actions
            </CardTitle>
            <CardDescription>
              Jump into the areas that keep you moving.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              variant="secondary"
              className="w-full justify-start"
              asChild
            >
              <Link href="/dashboard/contacts">
                <span className="flex w-full items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="flex-1 text-left">Manage contacts</span>
                  <ArrowUpRight className="h-4 w-4 opacity-70" />
                </span>
              </Link>
            </Button>
            <Button
              variant="secondary"
              className="w-full justify-start"
              asChild
            >
              <Link href="/dashboard/analytics">
                <span className="flex w-full items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  <span className="flex-1 text-left">Review analytics</span>
                  <ArrowUpRight className="h-4 w-4 opacity-70" />
                </span>
              </Link>
            </Button>
            <Button
              variant="secondary"
              className="w-full justify-start"
              asChild
            >
              <Link href="/dashboard/ai-application">
                <span className="flex w-full items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  <span className="flex-1 text-left">Try AI tools</span>
                  <ArrowUpRight className="h-4 w-4 opacity-70" />
                </span>
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
