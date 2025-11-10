"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { JobApplication } from "@prisma/client";
import { toast } from "sonner";

import { api } from "@/lib/api";
import {
  queryKeys,
  invalidationPatterns,
  optimisticUpdates,
  globalCacheSettings,
} from "@/lib/queryUtils";
import { CreateOrUpdateJobApplication, JobStatus } from "@/lib/types";

export function useJobApplications() {
  return useQuery<JobApplication[]>({
    queryKey: queryKeys.jobsApplications,
    queryFn: () => api.get<JobApplication[]>("/api/jobs"),
    ...globalCacheSettings.jobsApplications,
  });
}

export function useJobApplication(id: string) {
  return useQuery<JobApplication | undefined>({
    queryKey: queryKeys.jobApplication(id),
    queryFn: () => api.get<JobApplication>(`/api/jobs/${id}`),
    enabled: !!id,
    initialData: undefined,
    ...globalCacheSettings.jobApplication,
  });
}

export function useCreateJobApplication() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (jobApplication: CreateOrUpdateJobApplication) => {
      return api.post<JobApplication>("/api/jobs", jobApplication);
    },
    onSuccess: (newJobApplication) => {
      optimisticUpdates.jobsApplications(qc, newJobApplication);
      invalidationPatterns.jobsApplications(qc);
      toast.success("Job application created successfully");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to create job application");
    },
  });
}

export function useUpdateJobApplication() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (jobApplication: CreateOrUpdateJobApplication) => {
      return api.patch<JobApplication>(
        `/api/jobs/${jobApplication.id}`,
        jobApplication
      );
    },
    onSuccess: (jobApplication) => {
      optimisticUpdates.jobsApplications(qc, jobApplication);
      invalidationPatterns.jobsApplications(qc);
      toast.success("Job application updated successfully");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to update job application");
    },
  });
}

export function useUpdateJobStatus() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: JobStatus }) => {
      return api.patch<JobApplication>(`/api/jobs/${id}`, { status });
    },
    onMutate: async ({ id, status }) => {
      // Cancel any outgoing refetches
      await qc.cancelQueries({ queryKey: queryKeys.jobsApplications });

      // Snapshot the previous value
      const previousJobs = qc.getQueryData<JobApplication[]>(
        queryKeys.jobsApplications
      );

      // Optimistically update to the new status
      if (previousJobs) {
        qc.setQueryData<JobApplication[]>(
          queryKeys.jobsApplications,
          previousJobs.map((job) => (job.id === id ? { ...job, status } : job))
        );
      }

      // Return context with the previous value
      return { previousJobs };
    },
    onError: (error, variables, context) => {
      // Rollback to previous value on error
      if (context?.previousJobs) {
        qc.setQueryData(queryKeys.jobsApplications, context.previousJobs);
      }
      console.error(error);
    },
    onSuccess: (updatedJob) => {
      // Update with the actual response from the server
      optimisticUpdates.jobsApplications(qc, updatedJob);
      invalidationPatterns.jobsApplications(qc);
    },
  });
}

export function useDeleteJobApplication() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return api.delete<JobApplication>(`/api/jobs/${id}`);
    },
    onSuccess: () => {
      invalidationPatterns.jobsApplications(qc);
      toast.success("Job application deleted successfully");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to delete job application");
    },
  });
}
