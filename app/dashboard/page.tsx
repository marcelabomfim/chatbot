import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function Dashboard() {
  // Here I added an alternative to fetch data directly on the page, without reaching an API
  // We can use Next.js Server Side Rendering to fetch data before render the page
  const sessions = await prisma.chatSession.findMany({
    include: { messages: true },
  });

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Chat Dashboard</h1>
      <ul className="mt-4">
        {sessions.map((session) => (
          <li key={session.id} className="border p-2 rounded my-2">
            <h2 className="font-semibold">
              {session.createdAt.toLocaleString()} - User: {session.user}
            </h2>
            <ul>
              {session.messages.map((msg) => (
                <li key={msg.id} className="ml-4">
                  <b>{msg.author}:</b> {msg.text}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
