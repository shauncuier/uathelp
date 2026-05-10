import type { Metadata } from "next";
import { ChatInterface } from "@/components/chat/chat-interface";

export const metadata: Metadata = {
  title: "AI Chat",
  description: "Chat with our AI assistant about university admissions in Bangladesh.",
};

export default function ChatPage() {
  return (
    <div className="pt-16">
      <ChatInterface />
    </div>
  );
}
