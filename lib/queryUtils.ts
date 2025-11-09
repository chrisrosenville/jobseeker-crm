import { Contact, JobApplication, User } from "@prisma/client";
import { QueryClient } from "@tanstack/react-query";

export const queryKeys = {
  jobsApplications: ["jobsApplications"],
  contacts: ["contacts"],
  user: ["user"],
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
          // Replace existing job
          const updated = [...old];
          updated[existingIndex] = job;
          return updated;
        }
        // Add new job
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
