"use client";

import { JobListItem } from "@/components/jobs/JobListItem";
import { LoadingScreen } from "@/components/LoadingScreen";
import { AddJobDialog } from "@/components/modals/AddJobDialog";
import { useJobApplications } from "@/hooks/useJobs";

export default function JobsPage() {
  const JobApplications = useJobApplications();

  if (JobApplications.isLoading) return <LoadingScreen />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Jobs</h1>
        <AddJobDialog />
      </div>
      <div className="space-y-3">
        {JobApplications.data?.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            You have not logged any jobs yet.
          </p>
        ) : (
          JobApplications.data?.map((jobApplication) => (
            <JobListItem key={jobApplication.id} job={jobApplication} />
          ))
        )}
      </div>
    </div>
  );
}
