"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Contact } from "@prisma/client";

import { CreateContact } from "@/lib/types";
import { api } from "@/lib/api";
import {
  queryKeys,
  invalidationPatterns,
  optimisticUpdates,
} from "@/lib/queryUtils";

export function useContacts() {
  return useQuery<Contact[]>({
    queryKey: queryKeys.contacts,
    queryFn: () => api.get<Contact[]>("/api/contacts"),
  });
}

export function useCreateContact() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (contact: CreateContact) => {
      return api.post<Contact>("/api/contacts", contact);
    },
    onSuccess: (newContact) => {
      optimisticUpdates.contacts(qc, newContact);
      invalidationPatterns.contacts(qc);
      toast.success("Contact created successfully");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to create contact");
    },
  });
}

export function useUpdateContact() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, contact }: { id: string; contact: Contact }) => {
      return api.patch<Contact>(`/api/contacts/${id}`, contact);
    },
    onSuccess: (contact) => {
      optimisticUpdates.contacts(qc, contact);
      invalidationPatterns.contacts(qc);
      toast.success("Contact updated successfully");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to update contact");
    },
  });
}

export function useDeleteContact() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return api.delete<Contact>(`/api/contacts/${id}`);
    },
    onSuccess: () => {
      invalidationPatterns.contacts(qc);
      toast.success("Contact deleted successfully");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to delete contact");
    },
  });
}
