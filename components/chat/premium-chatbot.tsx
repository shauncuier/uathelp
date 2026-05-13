"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import {
  Send,
  Sparkles,
  Copy,
  Check,
  StopCircle,
  Bot,
  User,
  RotateCcw,
  Trash2,
  ChevronDown,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

const SUGGESTED_PROMPTS = [
  { text: "What are the top 5 public universities?", emoji: "🏛️" },
  { text: "How do I prepare for the BUET admission test?", emoji: "📐" },
  { text: "What scholarships are available for HSC students?", emoji: "🎓" },
  { text: "Compare DU and BRAC University for CSE", emoji: "⚖️" },
  { text: "What's the admission deadline for Dhaka University?", emoji: "📅" },
  { text: "Tell me about medical college admissions", emoji: "🩺" },
];

export function PremiumChatbot() {
  const { messages, stop, sendMessage, status, error, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest: ({ id, messages }) => ({
        body: {
          conversationId: id,
          messages,
          timestamp: new Date().toISOString(),
        },
      }),
    }),
  });

  const isLoading = status === "streaming" || status === "submitted";
  const [input, setInput] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll only when user is already near the bottom
  const isNearBottomRef = useRef(true);

  useEffect(() => {
    if (isNearBottomRef.current) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Track scroll position
  const handleScroll = useCallback(() => {
    const el = messagesContainerRef.current;
    if (!el) return;
    const fromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setShowScrollButton(fromBottom > 200);
    isNearBottomRef.current = fromBottom < 150;
  }, []);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "0px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = Math.min(scrollHeight, 160) + "px";
    }
  }, [input]);

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

  const handleSend = () => {
    const text = input.trim();
    if (!text || isLoading) return;
    void sendMessage({ text });
    setInput("");
  };

  const handlePromptClick = (prompt: string) => {
    if (!isLoading) {
      void sendMessage({ text: prompt });
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const getMessageText = (message: (typeof messages)[number]) =>
    message.parts
      .map((part) => (part.type === "text" ? part.text : ""))
      .join("");

  const isEmpty = messages.length === 0;

  return (
    <div className="chat-root">
      {/* Messages area */}
      <div
        ref={messagesContainerRef}
        onScroll={handleScroll}
        className="chat-messages"
      >
        {isEmpty ? (
          /* ── Empty state ── */
          <div className="chat-empty">
            <div className="chat-empty-icon">
              <div className="chat-empty-icon-ring" />
              <Sparkles className="size-8 text-brand relative z-10" />
            </div>
            <h1 className="chat-empty-title">UAT AI Advisor</h1>
            <p className="chat-empty-subtitle">
              Your intelligent guide to university admissions in Bangladesh.
              <br className="hidden sm:block" />
              Ask about deadlines, requirements, rankings, or scholarships.
            </p>
            <div className="chat-prompts">
              {SUGGESTED_PROMPTS.map((prompt) => (
                <button
                  key={prompt.text}
                  onClick={() => handlePromptClick(prompt.text)}
                  className="chat-prompt-card"
                >
                  <span className="chat-prompt-emoji">{prompt.emoji}</span>
                  <span className="chat-prompt-text">{prompt.text}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* ── Messages ── */
          <div className="chat-thread">
            {/* Clear button */}
            {messages.length > 0 && !isLoading && (
              <div className="chat-thread-actions">
                <button onClick={handleClearChat} className="chat-clear-btn">
                  <Trash2 className="size-3.5" />
                  Clear conversation
                </button>
              </div>
            )}

            {messages.map((msg) => {
              const text = getMessageText(msg);
              const isUser = msg.role === "user";

              return (
                <div key={msg.id} className={cn("chat-msg", isUser && "chat-msg-user")}>
                  {/* Avatar */}
                  <div className={cn("chat-avatar", isUser ? "chat-avatar-user" : "chat-avatar-ai")}>
                    {isUser ? (
                      <User className="size-4" />
                    ) : (
                      <Bot className="size-4" />
                    )}
                  </div>

                  {/* Bubble */}
                  <div className={cn("chat-bubble-wrap", isUser && "items-end")}>
                    <span className="chat-role-label">
                      {isUser ? "You" : "UAT AI"}
                    </span>
                    <div className={cn("chat-bubble", isUser ? "chat-bubble-user" : "chat-bubble-ai")}>
                      {isUser ? (
                        <p className="whitespace-pre-wrap">{text}</p>
                      ) : (
                        <div className="chat-markdown">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {text}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>

                    {/* Actions for AI messages */}
                    {!isUser && text.length > 0 && (
                      <div className="chat-msg-actions">
                        <button
                          onClick={() => copyToClipboard(text, msg.id)}
                          className="chat-action-btn"
                          title="Copy response"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="size-3.5 text-emerald-500" />
                              <span className="text-emerald-500">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="size-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Streaming indicator */}
            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="chat-msg">
                <div className="chat-avatar chat-avatar-ai">
                  <Bot className="size-4" />
                </div>
                <div className="chat-bubble-wrap">
                  <span className="chat-role-label">UAT AI</span>
                  <div className="chat-bubble chat-bubble-ai">
                    <div className="chat-thinking">
                      <div className="chat-thinking-dot" style={{ animationDelay: "0ms" }} />
                      <div className="chat-thinking-dot" style={{ animationDelay: "150ms" }} />
                      <div className="chat-thinking-dot" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} className="h-px" />
          </div>
        )}

        {/* Scroll to bottom FAB */}
        {showScrollButton && (
          <button onClick={scrollToBottom} className="chat-scroll-fab">
            <ChevronDown className="size-4" />
          </button>
        )}
      </div>

      {/* ── Input bar ── */}
      <div className="chat-input-bar">
        <div className="chat-input-container">
          <div className="chat-input-row">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about university admissions..."
              disabled={isLoading}
              rows={1}
              className="chat-textarea"
            />
            <div className="chat-input-actions">
              {isLoading ? (
                <Button
                  type="button"
                  size="icon"
                  onClick={stop}
                  className="chat-send-btn chat-stop-btn"
                  title="Stop generating"
                >
                  <StopCircle className="size-4" />
                </Button>
              ) : (
                <Button
                  type="button"
                  size="icon"
                  disabled={!input.trim()}
                  onClick={handleSend}
                  className="chat-send-btn"
                  title="Send message"
                >
                  <Send className="size-4" />
                </Button>
              )}
            </div>
          </div>
          {error && (
            <p className="chat-error">
              Something went wrong. Please try again.
            </p>
          )}
          <p className="chat-disclaimer">
            UAT AI can make mistakes. Always verify with the university directly.
          </p>
        </div>
      </div>
    </div>
  );
}
