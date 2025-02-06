"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState("");

  const handleStartChat = async () => {
    if (!user.trim()) return;

    const session = await fetch(`/api/chat/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user }),
    }).then((res) => res.json());

    router.push(`/chat/${session.id}`);
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Welcome to ChatBot</h1>
      <input
        type="text"
        placeholder="Enter your name"
        value={user}
        onChange={(e) => setUser(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleStartChat();
          }
        }}
        className="border p-2 rounded"
      />
      <button
        onClick={handleStartChat}
        className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Start Chat
      </button>
    </div>
  );
}
