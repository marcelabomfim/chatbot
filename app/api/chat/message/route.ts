import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const randomMessages = [
  "Interesting! Tell me more about it.",
  "That sounds cool! What else would you like to know?",
  "Very good! Keep going...",
  "I'm intrigued! Can you elaborate?",
  "Fascinating! What happened next?",
  "Great! Do you have more details?",
];

const validateParams = (expectedParams: string[], providedParams: Record<string, string>) => {
  for (const param of expectedParams) {
    if (!providedParams[param]) {
      return NextResponse.json({ error: `Invalid parameter, "${param}" should be provided.` }, { status: 400 });
    }
  }
}

export async function POST(request: Request) {
  const { sessionId, text } = await request.json();

  validateParams(["sessionId", "text"], { sessionId, text });

  const session = await prisma.chatSession.findUnique({ where: { id: sessionId } });

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  await prisma.chatMessage.create({
    data: {
      sessionId: session.id,
      author: session.user,
      text,
    },
  });

  const botMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)];

  await prisma.chatMessage.create({
    data: {
      sessionId: session.id,
      author: "Bot",
      text: botMessage,
    },
  });

  return NextResponse.json({ response: botMessage });
}
