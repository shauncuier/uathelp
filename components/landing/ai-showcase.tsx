"use client";

import { motion } from "framer-motion";
import { Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockMessages = [
  { role: "user" as const, content: "What GPA do I need for DU CSE?" },
  { role: "assistant" as const, content: "For Dhaka University CSE:\n\n• SSC GPA: Min 4.00\n• HSC GPA: Min 4.00\n• Total: Min 8.00 combined\n\nAdmission test: MCQ on Physics, Chemistry, Math, English." },
  { role: "user" as const, content: "What about BUET?" },
  { role: "assistant" as const, content: "BUET requires GPA 5.00 in both SSC & HSC (Science). Applications open in October via buet.ac.bd." },
];

export function AIShowcase() {
  return (
    <section className="relative overflow-hidden py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-sm font-medium text-brand">
              <Sparkles className="size-3.5" />
              AI-Powered
            </div>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Ask anything about <span className="gradient-text">admissions</span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Our AI assistant is trained on the latest admission data from 150+ Bangladeshi universities.
            </p>
            <ul className="mt-8 space-y-3">
              {["Real-time admission data & deadlines", "Personalized university recommendations", "Exam preparation tips & strategies", "Scholarship matching & financial aid"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-sm">
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-brand/10">
                    <div className="size-1.5 rounded-full bg-brand" />
                  </div>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-8">
              <Button size="lg" className="h-12 gap-2 rounded-xl bg-brand px-8 text-brand-foreground shadow-lg shadow-brand/25 hover:bg-brand/90">
                <Sparkles className="size-4" />
                Try AI Assistant
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="glass glow rounded-2xl p-1">
              <div className="rounded-xl bg-card p-4">
                <div className="flex items-center gap-3 border-b border-border pb-3">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-brand/10">
                    <Sparkles className="size-4 text-brand" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">UAT AI Assistant</p>
                    <p className="text-xs text-muted-foreground">Always online</p>
                  </div>
                  <div className="ml-auto size-2 rounded-full bg-green-500" />
                </div>
                <div className="mt-4 space-y-3 max-h-72 overflow-hidden">
                  {mockMessages.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.role === "user" ? "rounded-br-md bg-brand text-brand-foreground" : "rounded-bl-md bg-muted"}`}
                        dangerouslySetInnerHTML={{ __html: msg.content.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>") }}
                      />
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-muted/50 p-2">
                  <input type="text" placeholder="Ask about admissions..." className="flex-1 bg-transparent px-2 text-sm outline-none placeholder:text-muted-foreground" readOnly />
                  <Button size="icon" className="size-8 rounded-lg bg-brand text-brand-foreground">
                    <Send className="size-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
