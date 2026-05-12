import type { Metadata } from "next";
import { PremiumChatbot } from "@/components/chat/premium-chatbot";

export const metadata: Metadata = {
  title: "AI Chat | UAT Help",
  description: "Chat with our AI assistant about university admissions in Bangladesh.",
};

export default function ChatPage() {
  return (
    <div className="min-h-screen bg-background">
      <PremiumChatbot />
    </div>
  );
}
