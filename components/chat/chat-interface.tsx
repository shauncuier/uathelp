"use client";

import { useRef, useEffect, useState } from "react";
import { Send, Sparkles, Copy, Check, StopCircle } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

const suggestedPrompts = [
  "What are the top 5 public universities in Bangladesh?",
  "How do I prepare for the BUET admission test?",
  "What scholarships are available for HSC students?",
  "Compare DU and BRAC University for CSE",
];

export function ChatInterface() {
  const { messages, stop, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });
  const isLoading = status === "streaming" || status === "submitted";
  const [input, setInput] = useState<string>("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && input.trim()) {
        void sendMessage({ text: input });
        setInput("");
      }
    }
  };

  const handlePromptClick = (prompt: string) => {
    if (!isLoading) {
      void sendMessage({ text: prompt });
    }
  };

  const getMessageText = (message: (typeof messages)[number]) =>
    message.parts
      .map((part) => (part.type === "text" ? part.text : ""))
      .join("");

  return (
    <div className="flex h-[calc(100dvh-4rem)] min-h-0 flex-col overflow-hidden">
      {/* Messages */}
      <ScrollArea className="min-h-0 flex-1 overflow-hidden p-4" ref={scrollRef}>
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
                  onClick={() => handlePromptClick(prompt)}
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
                <div className={cn(
                    "group relative max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                    msg.role === "user"
                      ? "rounded-br-md bg-brand text-brand-foreground"
                      : "rounded-bl-md bg-muted"
                  )}>
                  {msg.role === "assistant" ? (
                    <div className="prose prose-sm max-w-none prose-p:my-0 prose-ul:my-0 prose-ol:my-0 prose-li:my-0 prose-strong:text-foreground">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {getMessageText(msg)}
                      </ReactMarkdown>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap">{getMessageText(msg)}</div>
                  )}
                  {msg.role === "assistant" && getMessageText(msg).length > 0 && (
                    <button
                      onClick={() => copyToClipboard(getMessageText(msg), msg.id)}
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
            {isLoading && messages[messages.length - 1]?.role === "user" && (
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
      <div className="shrink-0 border-t border-border p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!isLoading && input.trim()) {
              void sendMessage({ text: input });
              setInput("");
            }
          }}
          className="mx-auto max-w-3xl"
        >
          <div className="flex items-end gap-2 rounded-xl border border-border bg-card p-2 focus-within:border-brand/50 transition-colors">
            <Textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about admissions..."
              disabled={status !== "ready"}
              className="min-h-[44px] max-h-32 resize-none border-0 bg-transparent p-2 focus-visible:ring-0 focus-visible:ring-offset-0"
              rows={1}
            />
            {isLoading ? (
              <Button
                type="button"
                size="icon"
                onClick={stop}
                className="size-9 shrink-0 rounded-lg bg-brand text-brand-foreground hover:bg-brand/90"
              >
                <StopCircle className="size-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="icon"
                disabled={!input.trim()}
                className="size-9 shrink-0 rounded-lg bg-brand text-brand-foreground hover:bg-brand/90 disabled:opacity-50"
              >
                <Send className="size-4" />
              </Button>
            )}
          </div>
          {error && <p className="mt-2 text-center text-xs text-destructive">Something went wrong.</p>}
          <p className="mt-2 text-center text-xs text-muted-foreground">
            UAT AI can make mistakes. Verify important information with the university.
          </p>
        </form>
      </div>
    </div>
  );
}
