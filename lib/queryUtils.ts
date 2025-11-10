import { Contact, JobApplication, User } from "@prisma/client";
import { QueryClient } from "@tanstack/react-query";

export const queryKeys = {
  jobsApplications: ["jobsApplications"],
  jobApplication: (id: string) => ["jobApplication", id],
  contacts: ["contacts"],
  user: ["user"],
};

export const staleTime = Infinity;
export const gcTime = Infinity;

export const globalCacheSettings = {
  jobsApplications: {
    staleTime,
    gcTime,
  },
  jobApplication: {
    staleTime,
    gcTime,
  },
  contacts: {
    staleTime,
    gcTime,
  },
  user: {
    staleTime,
    gcTime,
  },
};

export const invalidationPatterns = {
  jobsApplications: (queryClient: QueryClient) =>
    queryClient.invalidateQueries({ queryKey: queryKeys.jobsApplications }),
  contacts: (queryClient: QueryClient) =>
    queryClient.invalidateQueries({ queryKey: queryKeys.contacts }),
  user: (queryClient: QueryClient) =>
    queryClient.invalidateQueries({ queryKey: queryKeys.user }),
};

export const optimisticUpdates = {
  jobsApplications: (queryClient: QueryClient, job: JobApplication) =>
    queryClient.setQueryData(
      queryKeys.jobsApplications,
      (old: JobApplication[] | undefined) => {
        if (!old) return [job];

        const existingIndex = old.findIndex((j) => j.id === job.id);
        if (existingIndex >= 0) {
          const updated = [...old];
          updated[existingIndex] = job;
          return updated;
        }

        return [...old, job];
      }
    ),
  jobsStatus: (queryClient: QueryClient, job: JobApplication) =>
    queryClient.setQueryData(
      queryKeys.jobsApplications,
      (old: JobApplication[] | undefined) => {
        if (!old) return [job];

        const existingIndex = old.findIndex((j) => j.id === job.id);
        if (existingIndex >= 0) {
          const updated = [...old];
          updated[existingIndex] = job;
          return updated;
        }

        return [...old, job];
      }
    ),
  contacts: (queryClient: QueryClient, contact: Contact) =>
    queryClient.setQueryData(
      queryKeys.contacts,
      (old: Contact[] | undefined) => {
        if (!old) return [contact];
        const existingIndex = old.findIndex((c) => c.id === contact.id);
        if (existingIndex >= 0) {
          // Replace existing contact
          const updated = [...old];
          updated[existingIndex] = contact;
          return updated;
        }
        // Add new contact
        return [...old, contact];
      }
    ),
  user: (queryClient: QueryClient, user: User) =>
    queryClient.setQueryData(queryKeys.user, user),
};

export const optimisticDeletes = {
  jobsApplications: (queryClient: QueryClient, id: string) =>
    queryClient.setQueryData(
      queryKeys.jobsApplications,
      (old: JobApplication[]) => old.filter((job) => job.id !== id)
    ),
  contacts: (queryClient: QueryClient, id: string) =>
    queryClient.setQueryData(queryKeys.contacts, (old: Contact[]) =>
      old.filter((contact) => contact.id !== id)
    ),
};
