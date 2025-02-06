"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ChatMessage } from "@prisma/client";

export default function ChatPage() {
  const sessionId = useParams().sessionId;
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    const fetchChat = async () => {
      const session = await fetch(`/api/chat/${sessionId}`).then((res) =>
        res.json()
      );
      setMessages(session?.messages || []);
    };

    fetchChat();
  }, [sessionId]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Chat</h1>
      <div className="border p-2 h-96 overflow-y-auto">
        {messages.map((msg, index) => (
          <p key={index}>
            <b>{msg.author}:</b> {msg.text}
          </p>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type your message..."
        className="border p-2 rounded w-full mt-2"
      />
      <button className="mt-2 bg-green-500 text-white px-4 py-2 rounded">
        Send
      </button>
    </div>
  );
}
