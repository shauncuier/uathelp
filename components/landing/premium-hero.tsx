"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Sparkles, MessageSquare, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Animated background with moving gradient mesh
 */
function AnimatedBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Gradient blobs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.4 }}
        transition={{ duration: 1 }}
        className="absolute top-0 left-1/4 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-500/30 to-purple-600/30 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="absolute top-1/3 right-1/4 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl"
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.25 }}
        transition={{ duration: 1, delay: 0.4 }}
        className="absolute -bottom-32 left-1/3 w-96 h-96 bg-gradient-to-br from-rose-400/20 to-pink-500/20 rounded-full blur-3xl"
      />

      {/* Animated grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80caff_1px,transparent_1px),linear-gradient(to_bottom,#80caff_1px,transparent_1px)] bg-[size:14rem_14rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-5" />
    </div>
  );
}

/**
 * Floating card component
 */
function FloatingCard({
  delay = 0,
  offset = 30,
}: {
  delay?: number;
  offset?: number;
}) {
  return (
    <motion.div
      className="absolute glass rounded-2xl border border-white/10 p-4 backdrop-blur-xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: [0, -offset, 0],
      }}
      transition={{
        opacity: { duration: 0.6, delay },
        y: { duration: 4, repeat: Infinity, delay, ease: "easeInOut" },
      }}
    >
      <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-indigo-500/20 to-purple-600/20" />
    </motion.div>
  );
}

/**
 * Premium Hero Section with Glassmorphism
 */
export function PremiumHero() {
  return (
    <section className="relative flex min-h-dvh items-center justify-center overflow-hidden pt-20 pb-12">
      {/* Animated background */}
      <AnimatedBackground />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div className="flex flex-col space-y-8">
            {/* Badge with animation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium backdrop-blur-xl bg-white/10 border border-white/20 w-fit">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="size-4 text-indigo-400" />
                </motion.div>
                <span className="bg-gradient-to-r from-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                  AI-Powered Guidance
                </span>
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <ArrowRight className="size-4 text-indigo-300" />
                </motion.div>
              </div>
            </motion.div>

            {/* Main headline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-tight">
                <span>Your AI-Powered</span>
                <br />
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  University Admission
                </span>
                <br />
                <span>Companion</span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed"
            >
              Navigate Bangladesh's university admissions with AI-driven insights, 
              personalized recommendations, and real-time admission updates. Your 
              success starts here.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Link href="/chat" className="flex-1 sm:flex-initial">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/25 hover:shadow-xl hover:shadow-indigo-600/40 hover:scale-105 transition-all duration-300"
                >
                  <MessageSquare className="size-5 mr-2" />
                  Chat with AI
                </Button>
              </Link>
              <Link href="/universities" className="flex-1 sm:flex-initial">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto h-12 rounded-xl border-white/20 hover:bg-white/10 transition-all duration-300"
                >
                  <Search className="size-5 mr-2" />
                  Browse Universities
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex gap-8 pt-8 border-t border-white/10"
            >
              {[
                { label: "Universities", value: "250+" },
                { label: "Active Students", value: "5K+" },
                { label: "Success Rate", value: "94%" },
              ].map((stat, i) => (
                <div key={i}>
                  <div className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Side - Floating Elements */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block h-96 md:h-full"
          >
            {/* Main showcase card */}
            <motion.div
              className="absolute inset-0 rounded-3xl overflow-hidden"
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="relative w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-white/20 rounded-3xl backdrop-blur-xl p-8">
                {/* Animated chat preview */}
                <div className="space-y-4">
                  <div className="h-3 w-24 rounded-full bg-white/10" />
                  <div className="space-y-2">
                    <div className="h-3 w-full rounded bg-white/10" />
                    <div className="h-3 w-5/6 rounded bg-white/10" />
                  </div>
                  <div className="h-10 rounded-lg bg-gradient-to-r from-indigo-500/30 to-purple-600/30" />
                </div>
              </div>
            </motion.div>

            {/* Floating accent cards */}
            <FloatingCard delay={0.1} offset={20} />
            <FloatingCard delay={0.3} offset={25} />
          </motion.div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
