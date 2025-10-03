"use client";

import { JOB_STATUS_LABELS, JOB_STATUS_ORDER, JobStatus } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function StatusSelect({
  value,
  onChange,
}: {
  value: JobStatus;
  onChange: (s: JobStatus) => void;
}) {
  return (
    <Select value={value} onValueChange={(v) => onChange(v as JobStatus)}>
      <SelectTrigger className="h-8 w-[160px]">
        <SelectValue placeholder="Status" />
      </SelectTrigger>
      <SelectContent>
        {JOB_STATUS_ORDER.map((s) => (
          <SelectItem key={s} value={s}>
            {JOB_STATUS_LABELS[s]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
