import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ sessionId: string }> }
) {
  const sessionId = (await params).sessionId;

  const session = await prisma.chatSession.findUnique({
    where: { id: sessionId },
    include: { messages: true },
  });
  
  return NextResponse.json(session);
}
