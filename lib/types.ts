import { JobStatus, UserRole, ContactRole } from "@prisma/client";

// Re-export Prisma enums
export type { JobStatus, UserRole, ContactRole };

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
  role?: ContactRole | null;
};

export const JOB_STATUS_ORDER: JobStatus[] = [
  "APPLIED",
  "INTERVIEW",
  "OFFER",
  "GHOSTED",
  "REJECTED",
];

export const JOB_STATUS_LABELS: Record<JobStatus, string> = {
  APPLIED: "Applied",
  INTERVIEW: "Interview",
  OFFER: "Offer",
  GHOSTED: "Ghosted",
  REJECTED: "Rejected",
};

export const CONTACT_ROLE_ORDER: ContactRole[] = [
  "RECRUITER",
  "HIRING_MANAGER",
  "REFERRAL",
  "OTHER",
];

export const CONTACT_ROLE_LABELS: Record<ContactRole, string> = {
  RECRUITER: "Recruiter",
  HIRING_MANAGER: "Hiring Manager",
  REFERRAL: "Referral",
  OTHER: "Other",
};
