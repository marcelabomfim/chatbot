import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  const { user } = await request.json();

  const session = await prisma.chatSession.create({
    data: {
      user,
      messages: { 
        create: {
          author: "Bot",
          text: `Hi ${user}! How can I help you?`
        }
      }
    },
    include: { messages: true }
  });

  return NextResponse.json(session);
}
