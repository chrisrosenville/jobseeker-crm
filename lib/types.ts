export type JobStatus = "APPLIED" | "INTERVIEW" | "OFFER" | "REJECTED";

export type CreateOrUpdateJobApplication = {
  id?: string;
  title: string;
  company: string;
  status: JobStatus;
  link?: URL | null;
  salary?: string | null;
  dateApplied: Date;
  notes?: string | null;
};

export type CreateOrUpdateContact = {
  jobId: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  role?: string | null;
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
