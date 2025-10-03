import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ConfirmDelete } from "@/components/ConfirmDelete";
import { EditContactDialog } from "@/components/modals/EditContactDialog";

export default async function ContactsPage() {
  const { userId } = await auth();
  if (!userId) return null;

  const contacts = await prisma.contact.findMany({
    where: { userId },
    include: { job: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Contacts</h1>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {contacts.length === 0 ? (
          <p className="text-sm text-gray-500">No contacts yet.</p>
        ) : (
          contacts.map((c) => (
            <div key={c.id} className="rounded-lg border bg-white p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="text-sm font-medium">{c.name}</div>
                  <div className="text-xs text-gray-500">
                    {c.role || "Contact"}
                  </div>
                  {c.email && <div className="mt-1 text-sm">{c.email}</div>}
                  {c.phone && <div className="text-sm">{c.phone}</div>}
                  {c.job && (
                    <div className="mt-2 text-xs text-gray-500">
                      Linked job:{" "}
                      <Link
                        className="underline"
                        href={`/dashboard/jobs/${c.job.id}`}
                      >
                        {c.job.title} · {c.job.company}
                      </Link>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  <EditContactDialog contact={c as any} />
                  <form
                    action={async () => {
                      "use server";
                      await fetch(
                        `${
                          process.env.NEXT_PUBLIC_BASE_URL || ""
                        }/api/contacts/${c.id}`,
                        { method: "DELETE" }
                      );
                    }}
                  >
                    <ConfirmDelete onConfirm={async () => {}}>
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-red-600"
                      >
                        Delete
                      </Button>
                    </ConfirmDelete>
                  </form>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
