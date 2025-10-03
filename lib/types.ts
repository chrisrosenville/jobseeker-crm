export type JobStatus = "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED";

export type Job = {
  id: string;
  title: string;
  company: string;
  status: JobStatus;
  link?: string | null;
  salary?: number | null;
  dateApplied: string;
  notes?: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
};

export const JOB_STATUS_ORDER: JobStatus[] = [
  "APPLIED",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
];

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  APPLIED: "Applied",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  REJECTED: "Rejected",
};
