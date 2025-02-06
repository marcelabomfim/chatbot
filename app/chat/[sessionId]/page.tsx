"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { ChatMessage, ChatSession } from "@prisma/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

interface Session extends ChatSession {
  messages: ChatMessage[];
}

const fetchChatSession = async (sessionId: string) => {
  const session = await fetch(`/api/chat/${sessionId}`).then((res) =>
    res.json()
  );
  return session;
}

const postChatMessage = async ({ sessionId, text }: { sessionId: string, text: string }) => {
  const message = await fetch("/api/chat/message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sessionId, text }),
  }).then((res) => res.json());

  return message;
}

export default function ChatPage() {
  const sessionId = useParams().sessionId as string;
  const [input, setInput] = useState("");

  const queryClient = useQueryClient()

  const { data: session } = useQuery<Session>({
    queryKey: ["chat", sessionId],
    queryFn: () => fetchChatSession(sessionId),
  });

  const message = useMutation({
    mutationFn: postChatMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat", sessionId] })
    },
  })

  const sendMessage = async () => {
    if (!input.trim()) return;

    message.mutate({ sessionId, text: input });

    setInput("");
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Chat</h1>
      <div className="border p-2 h-96 overflow-y-auto">
        {session?.messages.map((msg, index) => (
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
