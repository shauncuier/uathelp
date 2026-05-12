"use client";

import { motion } from "framer-motion";
import { MessageSquare, Send, Zap, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

/**
 * Chat message animation
 */
function ChatMessage({
  role,
  content,
  delay,
}: {
  role: "user" | "assistant";
  content: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`flex gap-3 ${role === "user" ? "justify-end" : ""}`}
    >
      {role === "assistant" && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0">
          <Zap className="size-4 text-white" />
        </div>
      )}
      <div
        className={`max-w-xs rounded-2xl px-4 py-3 ${
          role === "user"
            ? "bg-indigo-600 text-white rounded-br-sm"
            : "bg-white/10 text-foreground rounded-bl-sm"
        }`}
      >
        <p className="text-sm leading-relaxed">{content}</p>
      </div>
    </motion.div>
  );
}

/**
 * Premium AI Showcase Section
 */
export function PremiumAIShowcase() {
  const messages: Array<{ role: "user" | "assistant"; content: string }> = [
    {
      role: "user",
      content:
        "I want to study engineering. Can you recommend universities that match my profile?",
    },
    {
      role: "assistant",
      content:
        "Based on your profile and preferences, I recommend these universities: BUET, RUET, and CUET. They have excellent engineering programs with 15-20% acceptance rates.",
    },
    {
      role: "user",
      content: "What are the admission requirements for BUET?",
    },
    {
      role: "assistant",
      content:
        "BUET requires: GPA 3.5+, Strong Math/Physics grades, and BUET admission test. Application deadline: June 30. I can provide detailed preparation tips if needed.",
    },
  ];

  const benefits = [
    "Personalized recommendations",
    "Real-time admission updates",
    "Success probability calculator",
    "24/7 instant responses",
  ];

  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium bg-white/10 border border-white/20 w-fit">
                <MessageSquare className="size-4 text-indigo-400" />
                <span>AI Assistant</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold">
                Meet your AI admission expert
              </h2>
              <p className="text-lg text-muted-foreground">
                Chat with our AI-powered assistant to get personalized university
                recommendations, check admission requirements, and track your
                application progress.
              </p>
            </div>

            {/* Benefits list */}
            <div className="space-y-3">
              {benefits.map((benefit, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3"
                >
                  <CheckCircle2 className="size-5 text-indigo-400 flex-shrink-0" />
                  <span className="text-foreground">{benefit}</span>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Link href="/chat">
                <Button
                  size="lg"
                  className="h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:scale-105 transition-transform duration-300"
                >
                  <MessageSquare className="size-5 mr-2" />
                  Start chatting now
                </Button>
              </Link>
            </motion.div>
          </motion.div>

          {/* Right: Chat preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative"
          >
            {/* Chat window */}
            <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl overflow-hidden shadow-2xl shadow-indigo-600/20">
              {/* Header */}
              <div className="border-b border-white/10 px-6 py-4 bg-gradient-to-r from-indigo-600/20 to-purple-600/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <Zap className="size-5 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">UAT Helper</p>
                      <p className="text-xs text-muted-foreground">Always online</p>
                    </div>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                </div>
              </div>

              {/* Messages */}
              <div className="p-6 space-y-4 h-80 overflow-hidden">
                {messages.map((message, i) => (
                  <ChatMessage
                    key={i}
                    role={message.role}
                    content={message.content}
                    delay={i * 0.2}
                  />
                ))}
              </div>

              {/* Input area */}
              <div className="border-t border-white/10 px-6 py-4 bg-gradient-to-r from-indigo-600/10 to-purple-600/10">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Ask about universities..."
                    className="flex-1 rounded-lg bg-white/10 px-4 py-2 text-sm border border-white/20 focus:outline-none focus:border-indigo-400/50 placeholder-muted-foreground"
                    disabled
                  />
                  <button className="rounded-lg bg-indigo-600 p-2 hover:bg-indigo-700 transition-colors">
                    <Send className="size-4 text-white" />
                  </button>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-lg"
            >
              Fast & Accurate
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
