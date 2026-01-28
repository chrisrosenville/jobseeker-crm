"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

type StatusDatum = { status: string; count: number };

const STATUS_COLORS: Record<string, string> = {
  APPLIED: "#3b82f6",
  INTERVIEW: "#6366f1",
  OFFER: "#10b981",
  GHOSTED: "#f59e0b",
  REJECTED: "#ef4444",
};

const STATUS_LABELS: Record<string, string> = {
  APPLIED: "Applied",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  GHOSTED: "Ghosted",
  REJECTED: "Rejected",
};

function StatusTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ value?: number; payload?: StatusDatum }>;
}) {
  if (!active || !payload?.length) return null;
  const datum = payload[0]?.payload;
  if (!datum) return null;

  return (
    <div className="rounded-md border bg-card px-3 py-2 text-sm text-foreground shadow-sm">
      <div className="font-medium">
        {STATUS_LABELS[datum.status] ?? datum.status}
      </div>
      <div className="text-muted-foreground">{datum.count} applications</div>
    </div>
  );
}

export function StatusBarChart({ data }: { data: StatusDatum[] }) {
  return (
    <div className="mt-4 h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 0 }}>
          <defs>
            {data.map((item) => (
              <linearGradient
                key={`gradient-${item.status}`}
                id={`gradient-${item.status}`}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={STATUS_COLORS[item.status] ?? "#94a3b8"}
                  stopOpacity={0.9}
                />
                <stop
                  offset="95%"
                  stopColor={STATUS_COLORS[item.status] ?? "#94a3b8"}
                  stopOpacity={0.25}
                />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke="rgba(0,0,0,0.06)" />
          <XAxis
            dataKey="status"
            tickFormatter={(value: string) => STATUS_LABELS[value] ?? value}
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
          <Bar
            dataKey="count"
            radius={[10, 10, 2, 2]}
            stroke="var(--color-card)"
            strokeWidth={1}
          />
          {data.map((item) => (
            <Cell
              key={`cell-${item.status}`}
              fill={`url(#gradient-${item.status})`}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
