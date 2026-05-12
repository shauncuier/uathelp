"use client";

import { motion } from "framer-motion";
import {
  Zap,
  Brain,
  Shield,
  TrendingUp,
  BookOpen,
  Users,
  Clock,
  Target,
} from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description: "Get personalized admission recommendations powered by advanced AI algorithms.",
    gradient: "from-indigo-500 to-purple-600",
    delay: 0,
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Instant search across 250+ universities with real-time filtering and sorting.",
    gradient: "from-cyan-500 to-blue-600",
    delay: 0.1,
  },
  {
    icon: BookOpen,
    title: "Complete Guides",
    description: "Access comprehensive admission guides, tips, and success stories from experts.",
    gradient: "from-emerald-500 to-teal-600",
    delay: 0.2,
  },
  {
    icon: TrendingUp,
    title: "Success Probability",
    description: "Calculate your chances of admission based on current requirements and trends.",
    gradient: "from-rose-500 to-pink-600",
    delay: 0.3,
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your data is encrypted and secure. We never share your personal information.",
    gradient: "from-amber-500 to-orange-600",
    delay: 0.4,
  },
  {
    icon: Clock,
    title: "Real-Time Updates",
    description: "Never miss important deadlines with instant admission circular notifications.",
    gradient: "from-violet-500 to-fuchsia-600",
    delay: 0.5,
  },
  {
    icon: Target,
    title: "Application Tracker",
    description: "Monitor all your applications in one place with detailed status updates.",
    gradient: "from-lime-500 to-green-600",
    delay: 0.6,
  },
  {
    icon: Users,
    title: "Community Support",
    description: "Connect with thousands of students sharing experiences and advice.",
    gradient: "from-sky-500 to-indigo-600",
    delay: 0.7,
  },
];

/**
 * Feature Card Component
 */
function FeatureCard({
  icon: Icon,
  title,
  description,
  gradient,
  delay,
}: (typeof features)[0]) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      className="group relative rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/10"
    >
      {/* Gradient background on hover */}
      <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-5 bg-gradient-to-br ${gradient} transition-opacity duration-300`} />

      {/* Icon */}
      <div className={`relative mb-6 inline-flex rounded-lg bg-gradient-to-br ${gradient} p-3`}>
        <Icon className="size-6 text-white" />
      </div>

      {/* Content */}
      <div className="relative space-y-3">
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>

      {/* Arrow indicator */}
      <motion.div
        className="relative mt-6 inline-block text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity"
        animate={{ x: [0, 4, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        →
      </motion.div>
    </motion.div>
  );
}

/**
 * Premium Features Section
 */
export function PremiumFeatures() {
  return (
    <section className="relative space-y-16 py-24 sm:py-32 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-1/3 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center space-y-4 max-w-3xl mx-auto px-4"
      >
        <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium bg-white/10 border border-white/20">
          <Zap className="size-4 text-indigo-400" />
          <span>Powerful Features</span>
        </div>
        <h2 className="text-4xl sm:text-5xl font-bold">
          Everything you need for success
        </h2>
        <p className="text-lg text-muted-foreground">
          Comprehensive tools and insights to make your university admission journey smooth and successful.
        </p>
      </motion.div>

      {/* Features grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
        {features.map((feature, i) => (
          <FeatureCard key={i} {...feature} />
        ))}
      </div>
    </section>
  );
}
