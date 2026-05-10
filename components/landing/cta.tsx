"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AnimatedGradient } from "@/components/shared/animated-gradient";

export function CTA() {
  return (
    <section className="relative overflow-hidden py-24">
      <AnimatedGradient />
      <div className="relative z-10 mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full bg-brand/10 px-3 py-1 text-sm font-medium text-brand">
            <Sparkles className="size-3.5" />
            Start your journey today
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Ready to ace your{" "}
            <span className="gradient-text">admission?</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
            Join thousands of Bangladeshi students who are already using
            UAT Help to navigate their university admission journey.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/signup">
              <Button
                size="lg"
                className="h-12 gap-2 rounded-xl bg-brand px-8 text-base text-brand-foreground shadow-lg shadow-brand/25 hover:bg-brand/90"
              >
                Get Started Free
                <ArrowRight className="size-4" />
              </Button>
            </Link>
            <Link href="/chat">
              <Button
                size="lg"
                variant="outline"
                className="h-12 gap-2 rounded-xl px-8 text-base"
              >
                <Sparkles className="size-4" />
                Try AI Chat
              </Button>
            </Link>
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Free forever for core features. No credit card required.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
