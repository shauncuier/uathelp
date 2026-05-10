"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Plus, Loader2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

const suggestedPrompts = [
  "What are the top 5 public universities in Bangladesh?",
  "How do I prepare for the BUET admission test?",
  "What scholarships are available for HSC students?",
  "Compare DU and BRAC University for CSE",
];

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (text?: string) => {
    const content = text || input.trim();
    if (!content || isStreaming) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsStreaming(true);

    // Simulate streaming response
    const assistantId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
      createdAt: new Date(),
    };
    setMessages((prev) => [...prev, assistantMessage]);

    const mockResponse = getMockResponse(content);
    for (let i = 0; i < mockResponse.length; i++) {
      await new Promise((r) => setTimeout(r, 15));
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId ? { ...m, content: mockResponse.slice(0, i + 1) } : m
        )
      );
    }
    setIsStreaming(false);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex h-[calc(100dvh-4rem)] flex-col">
      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="flex size-16 items-center justify-center rounded-2xl bg-brand/10">
              <Sparkles className="size-8 text-brand" />
            </div>
            <h2 className="mt-6 text-2xl font-bold">UAT AI Assistant</h2>
            <p className="mt-2 max-w-md text-muted-foreground">
              Ask me anything about university admissions in Bangladesh. I&apos;m here to help!
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {suggestedPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => handleSend(prompt)}
                  className="rounded-xl border border-border bg-card p-4 text-left text-sm transition-all hover:border-brand/30 hover:bg-accent"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl space-y-6 pb-4">
            {messages.map((msg) => (
              <div key={msg.id} className={cn("flex gap-3", msg.role === "user" && "justify-end")}>
                {msg.role === "assistant" && (
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand/10">
                    <Sparkles className="size-4 text-brand" />
                  </div>
                )}
                <div className={cn("group relative max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  msg.role === "user"
                    ? "rounded-br-md bg-brand text-brand-foreground"
                    : "rounded-bl-md bg-muted"
                )}>
                  <div className="whitespace-pre-wrap">{msg.content}</div>
                  {msg.role === "assistant" && msg.content && (
                    <button
                      onClick={() => copyToClipboard(msg.content, msg.id)}
                      className="absolute -bottom-6 right-0 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      {copiedId === msg.id ? (
                        <Check className="size-3.5 text-green-500" />
                      ) : (
                        <Copy className="size-3.5 text-muted-foreground hover:text-foreground" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            ))}
            {isStreaming && (
              <div className="flex gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-brand/10">
                  <Sparkles className="size-4 text-brand animate-pulse" />
                </div>
              </div>
            )}
          </div>
        )}
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-border p-4">
        <div className="mx-auto max-w-3xl">
          <div className="flex items-end gap-2 rounded-xl border border-border bg-card p-2 focus-within:border-brand/50 transition-colors">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about admissions..."
              className="min-h-[44px] max-h-32 resize-none border-0 bg-transparent p-2 focus-visible:ring-0 focus-visible:ring-offset-0"
              rows={1}
            />
            <Button
              size="icon"
              onClick={() => handleSend()}
              disabled={!input.trim() || isStreaming}
              className="size-9 shrink-0 rounded-lg bg-brand text-brand-foreground hover:bg-brand/90 disabled:opacity-50"
            >
              {isStreaming ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
            </Button>
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            UAT AI can make mistakes. Verify important information with the university.
          </p>
        </div>
      </div>
    </div>
  );
}

function getMockResponse(query: string): string {
  const q = query.toLowerCase();
  if (q.includes("buet") && q.includes("prepar")) {
    return `Here's how to prepare for the BUET admission test:\n\n1. **Focus Areas**: Physics, Chemistry, and Mathematics from HSC syllabus\n2. **Practice**: Solve previous years' question papers (at least 10 years)\n3. **Negative Marking**: Be careful — wrong answers deduct 0.25 marks\n4. **Time Management**: 2 hours for 240 marks, plan accordingly\n5. **Resources**: Chayan Prokashoni BUET prep books are highly recommended\n\nThe exam is highly competitive with ~15,000 students competing for ~1,200 seats.`;
  }
  if (q.includes("top") && q.includes("public")) {
    return `Here are the top 5 public universities in Bangladesh:\n\n1. **University of Dhaka (DU)** — Ranked #1, established 1921\n2. **Bangladesh University of Engineering & Technology (BUET)** — Premier engineering\n3. **University of Chittagong (CU)** — Large, established 1966\n4. **Rajshahi University (RU)** — 2nd oldest university\n5. **Shahjalal University of Science & Tech (SUST)** — Top for science\n\nEach has different admission windows. Would you like details about any specific university?`;
  }
  if (q.includes("scholar")) {
    return `Scholarships available for Bangladeshi HSC students:\n\n1. **Government Merit Scholarship** — Based on SSC/HSC results\n2. **University-specific scholarships** — Each uni offers its own\n3. **Need-based financial aid** — Apply through university financial aid offices\n4. **Private organization scholarships** — Grameenphone, BRAC, etc.\n5. **International scholarships** — Commonwealth, Erasmus Mundus\n\nWould you like me to help you find scholarships matching your profile?`;
  }
  return `Thank you for your question about "${query.slice(0, 50)}..."\n\nBased on my knowledge of Bangladeshi university admissions:\n\n• I can provide information about admission requirements, deadlines, and processes\n• I have data on 150+ universities across Bangladesh\n• I can help compare universities and programs\n\nCould you please be more specific about what you'd like to know? For example:\n- Specific university admission requirements\n- GPA requirements for certain programs\n- Exam preparation strategies\n- Scholarship opportunities`;
}
