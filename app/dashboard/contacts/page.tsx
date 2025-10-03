import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { ContactCard } from "@/components/contacts/ContactCard";

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
            <ContactCard
              key={c.id}
              id={c.id}
              name={c.name}
              role={c.role}
              email={c.email}
              phone={c.phone}
              company={c.job?.company}
              jobTitle={c.job?.title}
            />
          ))
        )}
      </div>
    </div>
  );
}
