"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedGradient } from "@/components/shared/animated-gradient";

const words = [
  "University Admission",
  "Scholarship Search",
  "Course Selection",
  "Career Planning",
];

export function Hero() {
  return (
    <section className="relative flex min-h-dvh items-center justify-center overflow-hidden pt-16">
      <AnimatedGradient />

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium">
              <Sparkles className="size-3.5 text-brand" />
              <span className="text-muted-foreground">
                AI-Powered Admission Guidance
              </span>
              <ArrowRight className="size-3.5 text-muted-foreground" />
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mt-8 max-w-4xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Your AI-Powered{" "}
            <span className="gradient-text">University Admission</span>{" "}
            Companion
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl"
          >
            Navigate the complex world of university admissions in Bangladesh
            with AI-driven insights, personalized recommendations, and
            real-time admission updates.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <Link href="/chat">
              <Button
                size="lg"
                className="h-12 gap-2 rounded-xl bg-brand px-8 text-base text-brand-foreground shadow-lg shadow-brand/25 hover:bg-brand/90 hover:shadow-xl hover:shadow-brand/30 transition-all duration-300"
              >
                <MessageSquare className="size-4" />
                Start Chatting with AI
              </Button>
            </Link>
            <Link href="/universities">
              <Button
                size="lg"
                variant="outline"
                className="h-12 gap-2 rounded-xl px-8 text-base transition-all duration-300 hover:bg-accent"
              >
                Browse Universities
                <ArrowRight className="size-4" />
              </Button>
            </Link>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 grid grid-cols-2 gap-8 sm:grid-cols-4"
          >
            {[
              { label: "Universities", value: "150+" },
              { label: "Students Helped", value: "25K+" },
              { label: "AI Conversations", value: "100K+" },
              { label: "Success Rate", value: "94%" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <span className="text-2xl font-bold gradient-text sm:text-3xl">
                  {stat.value}
                </span>
                <span className="mt-1 text-xs text-muted-foreground sm:text-sm">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>

          {/* Floating mockup cards */}
          <div className="relative mt-20 w-full max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="glass glow rounded-2xl p-1"
            >
              <div className="rounded-xl bg-card/80 p-6 sm:p-8">
                {/* Mock chat interface */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-brand/10">
                      <Sparkles className="size-4 text-brand" />
                    </div>
                    <span className="text-sm font-medium">UAT AI Assistant</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-end">
                      <div className="max-w-xs rounded-2xl rounded-br-md bg-brand px-4 py-2.5 text-sm text-brand-foreground">
                        What are the top engineering universities in Bangladesh?
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="max-w-md rounded-2xl rounded-bl-md bg-muted px-4 py-2.5 text-sm">
                        Based on rankings and student outcomes, here are the top engineering
                        universities: <strong>1. BUET</strong> — the premier
                        engineering institution, <strong>2. KUET</strong>,{" "}
                        <strong>3. RUET</strong>, <strong>4. CUET</strong>...
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating cards around the mockup */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -top-6 -left-6 hidden glass rounded-xl px-4 py-3 shadow-lg lg:block"
            >
              <div className="flex items-center gap-2 text-sm">
                <div className="size-2 rounded-full bg-green-500" />
                <span className="font-medium">DU Admission Open</span>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1,
              }}
              className="absolute -right-6 -bottom-4 hidden glass rounded-xl px-4 py-3 shadow-lg lg:block"
            >
              <div className="flex items-center gap-2 text-sm">
                <span className="text-2xl">🎓</span>
                <div>
                  <p className="font-medium">GPA: 5.00</p>
                  <p className="text-xs text-muted-foreground">Eligible for 45 universities</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
