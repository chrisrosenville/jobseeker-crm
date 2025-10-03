import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

export default async function AnalyticsPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const jobs = await prisma.jobApplication.findMany({ where: { userId } });

  const statusCounts = ["APPLIED", "INTERVIEW", "OFFER", "REJECTED"].map(
    (k) => ({
      status: k,
      count: jobs.filter((j) => j.status === (k as any)).length,
    })
  );

  const byDayMap = new Map<string, number>();
  for (const j of jobs) {
    const d = new Date(j.dateApplied);
    const key = new Date(d.getFullYear(), d.getMonth(), d.getDate())
      .toISOString()
      .slice(0, 10);
    byDayMap.set(key, (byDayMap.get(key) || 0) + 1);
  }
  const timeline = Array.from(byDayMap.entries())
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([date, count]) => ({ date, count }));

  const conversions = [
    { stage: "Applications", value: jobs.length },
    {
      stage: "Interviews",
      value: jobs.filter((j) => j.status === "INTERVIEW").length,
    },
    { stage: "Offers", value: jobs.filter((j) => j.status === "OFFER").length },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Analytics</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-white p-4">
          <h2 className="text-base font-semibold">Applications per status</h2>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statusCounts}>
                <XAxis dataKey="status" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="count" fill="#111827" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <h2 className="text-base font-semibold">Applications over time</h2>
          <div className="mt-4 h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeline}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#111827"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <h2 className="text-base font-semibold">Conversion funnel</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {conversions.map((c) => (
            <div
              key={c.stage}
              className="rounded border bg-gray-50 p-4 text-center"
            >
              <div className="text-sm text-gray-500">{c.stage}</div>
              <div className="text-2xl font-bold">{c.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
