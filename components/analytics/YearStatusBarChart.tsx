"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const STATUS_KEYS = ["APPLIED", "INTERVIEW", "OFFER", "REJECTED"] as const;
const STATUS_COLORS: Record<(typeof STATUS_KEYS)[number], string> = {
  APPLIED: "#3b82f6",
  INTERVIEW: "#6366f1",
  OFFER: "#10b981",
  REJECTED: "#ef4444",
};

const STATUS_LABELS: Record<(typeof STATUS_KEYS)[number], string> = {
  APPLIED: "Applied",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
};

const MONTH_LABELS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

type JobDatum = {
  status: string;
  dateApplied: Date | string;
};

type ChartDatum = {
  month: string;
} & Record<(typeof STATUS_KEYS)[number], number>;

function StatusTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; color?: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-md border bg-card px-3 py-2 text-xs text-foreground shadow-sm">
      <div className="font-medium">{label}</div>
      <div className="mt-1 space-y-1 text-muted-foreground">
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span>{entry.name}</span>
            <span className="ml-auto font-semibold text-foreground">
              {entry.value ?? 0}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function YearStatusBarChart({ jobs }: { jobs: JobDatum[] }) {
  const currentYear = new Date().getFullYear();
  const yearBounds = useMemo(() => {
    const years = jobs
      .map((job) => new Date(job.dateApplied).getFullYear())
      .filter((year) => Number.isFinite(year));
    const minYear = years.length
      ? Math.min(...years, currentYear)
      : currentYear;
    const maxYear = years.length
      ? Math.max(...years, currentYear)
      : currentYear;
    return { minYear, maxYear };
  }, [jobs, currentYear]);

  const [selectedYear, setSelectedYear] = useState(currentYear);

  const chartData = useMemo(() => {
    const base: ChartDatum[] = MONTH_LABELS.map((month) => ({
      month,
      APPLIED: 0,
      INTERVIEW: 0,
      OFFER: 0,
      REJECTED: 0,
    }));

    jobs.forEach((job) => {
      const date = new Date(job.dateApplied);
      const year = date.getFullYear();
      const monthIndex = date.getMonth();
      if (year !== selectedYear || monthIndex < 0 || monthIndex > 11) return;
      const status = job.status as (typeof STATUS_KEYS)[number];
      if (!STATUS_KEYS.includes(status)) return;
      base[monthIndex][status] += 1;
    });

    return base;
  }, [jobs, selectedYear]);

  const canGoPrev = selectedYear > yearBounds.minYear;
  const canGoNext = selectedYear < yearBounds.maxYear;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">Year</div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            disabled={!canGoPrev}
            onClick={() => setSelectedYear((year) => year - 1)}
            aria-label="Previous year"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="min-w-[72px] text-center text-sm font-semibold">
            {selectedYear}
          </div>
          <Button
            variant="ghost"
            size="icon"
            disabled={!canGoNext}
            onClick={() => setSelectedYear((year) => year + 1)}
            aria-label="Next year"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="4 4" stroke="rgba(0,0,0,0.06)" />
            <XAxis
              dataKey="month"
              tick={{ fill: "var(--color-muted-foreground)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: "var(--color-muted-foreground)" }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              content={<StatusTooltip />}
              cursor={{ fill: "transparent" }}
            />
            <Legend
              verticalAlign="top"
              height={24}
              formatter={(value) =>
                STATUS_LABELS[value as keyof typeof STATUS_LABELS]
              }
            />
            {STATUS_KEYS.map((key) => (
              <Bar
                key={key}
                dataKey={key}
                name={STATUS_LABELS[key]}
                fill={STATUS_COLORS[key]}
                radius={[6, 6, 2, 2]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
