"use client";

import { useState } from "react";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";

import { useDeleteJobApplication } from "@/hooks/useJobs";
import { useIsDemoUser } from "@/hooks/useUserRole";

import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { EditJobDialog } from "../modals/EditJobDialog";
import { ConfirmDelete } from "../ConfirmDelete";
import { JobApplication } from "@prisma/client";
import { toast } from "sonner";

export const KanbanCardOptions = ({ job }: { job: JobApplication }) => {
  const { isDemoUser } = useIsDemoUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const { mutateAsync: deleteJobApplication } = useDeleteJobApplication();

  const handleDelete = async () => {
    try {
      await deleteJobApplication(job.id);
      toast.success("Job application deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete job application");
    } finally {
      setDeleteOpen(false);
    }
  };

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 flex-shrink-0"
            disabled={isDemoUser}
            title={isDemoUser ? "Not available in demo mode" : undefined}
          >
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setEditOpen(true);
            }}
            className="cursor-pointer"
          >
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setDeleteOpen(true);
              setDropdownOpen(false);
            }}
            className="group cursor-pointer"
          >
            <Trash2 className="mr-2 h-4 w-4 text-red-600 group-data-[highlighted]:text-red-700" />
            <span className="text-red-600 group-data-[highlighted]:text-red-700">
              Delete
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditJobDialog job={job} open={editOpen} onOpenChange={setEditOpen} />
      <ConfirmDelete
        open={deleteOpen}
        setOpen={setDeleteOpen}
        onConfirm={handleDelete}
      />
    </>
  );
};
