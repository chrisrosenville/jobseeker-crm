"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Job, JobStatus } from "@/lib/types";

type UseJobsOptions = { initialData?: Job[] };

export function useJobs(options?: UseJobsOptions) {
  return useQuery<Job[]>({
    queryKey: ["jobs"],
    queryFn: () => api.get<Job[]>("/api/jobs"),
    initialData: options?.initialData,
  });
}

export function useUpdateJobStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: JobStatus }) => {
      return api.patch<Job>(`/api/jobs/${id}`, { status });
    },
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: ["jobs"] });
      const prev = qc.getQueryData<Job[]>(["jobs"]);
      if (prev) {
        qc.setQueryData<Job[]>(
          ["jobs"],
          prev.map((j) => (j.id === id ? { ...j, status } : j))
        );
      }
      return { prev };
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData<Job[]>(["jobs"], ctx.prev);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["jobs"] });
    },
  });
}
