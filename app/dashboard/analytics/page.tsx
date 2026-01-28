import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { YearStatusBarChart } from "@/components/analytics/YearStatusBarChart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3, Sparkles, TrendingUp } from "lucide-react";

export default async function AnalyticsPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const jobs = await prisma.jobApplication.findMany({ where: { userId } });

  const activeCount = jobs.filter(
    (j) => j.status === "APPLIED" || j.status === "INTERVIEW",
  ).length;

  return (
    <div className="space-y-8">
      <header className="space-y-1">
        <p className="text-sm text-muted-foreground">Analytics</p>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          See momentum at a glance.
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          {"Track progress across your pipeline and understand what's working."}
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          {
            title: "Applications",
            value: jobs.length,
            description: "Total roles tracked",
            icon: BarChart3,
          },
          {
            title: "Active pipeline",
            value: activeCount,
            description: "Applied + interview",
            icon: TrendingUp,
          },
          {
            title: "Offers",
            value: jobs.filter((j) => j.status === "OFFER").length,
            description: "Decision-ready roles",
            icon: Sparkles,
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base font-semibold">
            Job status trends
          </CardTitle>
          <CardDescription>
            Compare monthly activity across each stage.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <YearStatusBarChart jobs={jobs} />
        </CardContent>
      </Card>
    </div>
  );
}
