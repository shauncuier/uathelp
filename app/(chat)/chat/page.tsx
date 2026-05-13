import type { Metadata } from "next";
import { ChatPageClient } from "./chat-client";

export const metadata: Metadata = {
  title: "AI Chat | UAT Help",
  description: "Chat with our AI assistant about university admissions in Bangladesh.",
};

export default function ChatPage() {
  return <ChatPageClient />;
}
