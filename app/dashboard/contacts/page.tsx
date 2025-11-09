import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { ContactListItem } from "@/components/contacts/ContactListItem";
import { AddContactDialog } from "@/components/modals/AddContactDialog";

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
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Contacts</h1>
        <AddContactDialog />
      </div>
      <div className="space-y-3">
        {contacts.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            You have not logged any contacts yet.
          </p>
        ) : (
          contacts.map((c) => (
            <ContactListItem
              key={c.id}
              id={c.id}
              name={c.name}
              role={c.role}
              email={c.email}
              phone={c.phone}
            />
          ))
        )}
      </div>
    </div>
  );
}
