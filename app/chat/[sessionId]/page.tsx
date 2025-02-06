"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ChatMessage, ChatSession } from "@prisma/client";

interface Session extends ChatSession {
  messages: ChatMessage[];
}

export default function ChatPage() {
  const sessionId = useParams().sessionId;
  const [session, setSession] = useState<Session>();
  const [messages, setMessages] = useState<Partial<ChatMessage>[]>([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const fetchChat = async () => {
      const session = await fetch(`/api/chat/${sessionId}`).then((res) =>
        res.json()
      );
      setSession(session);
      setMessages(session?.messages || []);
    };

    fetchChat();
  }, [sessionId]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const message = await fetch("/api/chat/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, text: input }),
    }).then((res) => res.json());

    setMessages((prev) => [
      ...prev,
      { author: session?.user, text: input },
      { author: "Bot", text: message.response },
    ]);
    setInput("");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Chat</h1>
      <div className="border p-2 h-96 overflow-y-auto">
        {messages.map((msg, index) => (
          <p
            key={index}
            className={msg.author === "Bot" ? "text-blue-500" : "text-gray-700"}
          >
            <b>{msg.author}:</b> {msg.text}
          </p>
        ))}
      </div>
      <input
        type="text"
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage();
          }
        }}
        className="border p-2 rounded w-full mt-2"
      />
      <button
        onClick={sendMessage}
        className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
      >
        Send
      </button>
    </div>
  );
}
