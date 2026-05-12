"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, MessageCircle, Loader2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const SUGGESTED_PROMPTS = [
  "Which university is best for Engineering?",
  "How do I apply to DU?",
  "What are the admission requirements?",
  "Tell me about scholarship opportunities",
];

export function PremiumChatbot() {
  const [messages, setMessages] = useState<Array<Message>>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I'm your AI advisor for university admissions in Bangladesh. I can help you find the perfect university, understand admission requirements, and guide you through the entire process. What would you like to know?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (messageText?: string) => {
    const textToSend = messageText || input;
    if (!textToSend.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Simulate AI response (in production, this would call an API)
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `I understand you're asking about "${textToSend}". I have comprehensive information about Bangladeshi universities, admission processes, and academic programs. Would you like me to provide specific details about university rankings, admission timelines, required documents, or anything else?`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section className="relative py-24 lg:py-32">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/20 mb-6">
            <MessageCircle className="size-4 text-blue-400" />
            <span className="text-sm font-medium text-foreground">AI Chatbot</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">Meet Your AI Advisor</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Chat with our intelligent assistant trained on 270+ Bangladeshi universities. Get instant answers about admissions, requirements, and scholarships.
          </p>
        </motion.div>

        {/* Chat Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          {/* Gradient Border */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Chat Window */}
          <div className="relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm overflow-hidden shadow-2xl shadow-blue-500/5">
            {/* Messages Container */}
            <div className="h-96 overflow-y-auto space-y-4 p-6 scroll-smooth">
              <AnimatePresence>
                {messages.map((message, index) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                    className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {/* Avatar */}
                    {message.role === "assistant" && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                          <MessageCircle className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    )}

                    {/* Message Bubble */}
                    <div
                      className={`flex-1 max-w-xs lg:max-w-md group ${
                        message.role === "user" ? "text-right" : ""
                      }`}
                    >
                      <div
                        className={`inline-block rounded-2xl px-4 py-3 ${
                          message.role === "user"
                            ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-blue-500/30 text-foreground"
                            : "bg-muted/50 border border-border/50 text-muted-foreground"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                      </div>

                      {/* Copy Button for assistant messages */}
                      {message.role === "assistant" && (
                        <motion.button
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                          onClick={() => copyToClipboard(message.content, message.id)}
                          className="mt-2 p-1 rounded-lg hover:bg-muted/50 transition-colors opacity-0 group-hover:opacity-100"
                          title="Copy message"
                        >
                          {copiedId === message.id ? (
                            <Check className="w-4 h-4 text-green-400" />
                          ) : (
                            <Copy className="w-4 h-4 text-muted-foreground" />
                          )}
                        </motion.button>
                      )}
                    </div>

                    {/* User Avatar */}
                    {message.role === "user" && (
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center">
                          <span className="text-xs font-bold text-white">Y</span>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {/* Loading Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3 justify-start"
                >
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    </div>
                  </div>
                  <div className="bg-muted/50 border border-border/50 rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-100" />
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-200" />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-border/50 bg-card/50 p-4 backdrop-blur-sm">
              {/* Suggested Prompts */}
              {messages.length === 1 && (
                <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {SUGGESTED_PROMPTS.map((prompt, idx) => (
                    <motion.button
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => handleSendMessage(prompt)}
                      className="text-left text-xs p-2 rounded-lg border border-border/50 bg-muted/30 hover:bg-muted/60 transition-colors hover:border-blue-500/30"
                    >
                      {prompt}
                    </motion.button>
                  ))}
                </div>
              )}

              {/* Input Field */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Ask me anything about university admissions..."
                  className="flex-1 rounded-lg border border-border/50 bg-muted/30 px-4 py-2 text-sm placeholder-muted-foreground focus:outline-none focus:border-blue-500/50 focus:bg-muted/50 transition-all"
                  disabled={isLoading}
                />
                <Button
                  size="icon"
                  onClick={() => handleSendMessage()}
                  disabled={isLoading || !input.trim()}
                  className="rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Below Chat */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-12 grid gap-4 sm:grid-cols-3 text-center text-sm"
        >
          <div className="p-4 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm">
            <p className="font-semibold text-foreground mb-1">Instant Answers</p>
            <p className="text-muted-foreground text-xs">Get real-time responses about admissions and universities</p>
          </div>
          <div className="p-4 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm">
            <p className="font-semibold text-foreground mb-1">Personalized</p>
            <p className="text-muted-foreground text-xs">Tailored recommendations based on your profile</p>
          </div>
          <div className="p-4 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm">
            <p className="font-semibold text-foreground mb-1">Always Available</p>
            <p className="text-muted-foreground text-xs">24/7 support for all your admission questions</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
