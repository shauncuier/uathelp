"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

/**
 * Premium CTA Section
 */
export function PremiumCTA() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient blobs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-600/30 to-purple-600/30 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 0.8, 1],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-cyan-400/20 to-blue-500/20 rounded-full blur-3xl"
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="rounded-3xl border border-white/20 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl overflow-hidden"
        >
          {/* Content */}
          <div className="relative px-8 sm:px-12 py-16 sm:py-20 text-center space-y-8">
            {/* Badge */}
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium bg-gradient-to-r from-indigo-500/20 to-purple-600/20 border border-indigo-400/30">
                <Sparkles className="size-4 text-indigo-400" />
                <span className="bg-gradient-to-r from-indigo-300 to-cyan-300 bg-clip-text text-transparent">
                  Ready to get started?
                </span>
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              className="text-4xl sm:text-5xl font-bold"
            >
              Your dream university is just one
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                conversation away
              </span>
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="text-lg text-muted-foreground max-w-xl mx-auto"
            >
              Chat with our AI admission expert today and get personalized
              recommendations for your perfect university match.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            >
              <Link href="/chat" className="flex-1 sm:flex-initial">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-12 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-600/25 hover:shadow-xl hover:shadow-indigo-600/40 hover:scale-105 transition-all duration-300"
                >
                  <MessageSquare className="size-5 mr-2" />
                  Chat Now
                </Button>
              </Link>
              <Link href="/universities" className="flex-1 sm:flex-initial">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto h-12 rounded-xl border-white/20 hover:bg-white/10 transition-all duration-300 group"
                >
                  Explore Universities
                  <motion.div
                    className="ml-2"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ArrowRight className="size-5" />
                  </motion.div>
                </Button>
              </Link>
            </motion.div>

            {/* Trust indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-8 border-t border-white/10"
            >
              {[
                { label: "Secure", icon: "🔒" },
                { label: "Free to use", icon: "✨" },
                { label: "No signup required", icon: "⚡" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="text-lg">{item.icon}</span>
                  {item.label}
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
