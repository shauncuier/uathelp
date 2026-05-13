"use client";

import { useAuth } from "@/lib/firebase/auth-context";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { PremiumChatbot } from "@/components/chat/premium-chatbot";
import { Loader2 } from "lucide-react";

export function ChatPageClient() {
  const { loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login?redirectTo=/chat");
    }
  }, [loading, isAuthenticated, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="flex h-[calc(100dvh-4rem)] items-center justify-center bg-background mt-16">
        <Loader2 className="size-8 animate-spin text-brand" />
      </div>
    );
  }

  return <PremiumChatbot />;
}
