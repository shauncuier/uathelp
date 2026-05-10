"use client";

import { motion } from "framer-motion";
import {
  MessageSquare,
  GraduationCap,
  Megaphone,
  Search,
  BookOpen,
  Trophy,
} from "lucide-react";

const features = [
  {
    icon: MessageSquare,
    title: "AI Admission Assistant",
    description:
      "Get instant, personalized answers about admission requirements, eligibility, and application processes using advanced AI.",
    gradient: "from-indigo-500/10 to-blue-500/10",
    iconColor: "text-indigo-500",
  },
  {
    icon: GraduationCap,
    title: "University Database",
    description:
      "Browse 150+ universities with detailed profiles, admission criteria, seat availability, and ranking information.",
    gradient: "from-cyan-500/10 to-teal-500/10",
    iconColor: "text-cyan-500",
  },
  {
    icon: Megaphone,
    title: "Admission Circulars",
    description:
      "Never miss a deadline. Get real-time updates on admission circulars, exam dates, and application windows.",
    gradient: "from-purple-500/10 to-pink-500/10",
    iconColor: "text-purple-500",
  },
  {
    icon: Search,
    title: "Smart Search",
    description:
      "Find universities by GPA, location, program, or tuition. Our intelligent search understands what you need.",
    gradient: "from-amber-500/10 to-orange-500/10",
    iconColor: "text-amber-500",
  },
  {
    icon: BookOpen,
    title: "Guides & Resources",
    description:
      "Expert-written guides on exam preparation, application tips, scholarship opportunities, and career planning.",
    gradient: "from-emerald-500/10 to-green-500/10",
    iconColor: "text-emerald-500",
  },
  {
    icon: Trophy,
    title: "Scholarship Finder",
    description:
      "Discover scholarships you're eligible for. Our AI matches your profile with available financial aid opportunities.",
    gradient: "from-rose-500/10 to-red-500/10",
    iconColor: "text-rose-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function Features() {
  return (
    <section className="py-24" id="features">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need for{" "}
            <span className="gradient-text">admission success</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            From AI-powered guidance to real-time updates, we provide all the
            tools Bangladeshi students need to navigate university admissions
            with confidence.
          </p>
        </motion.div>

        {/* Feature grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:border-brand/30 hover:shadow-lg hover:shadow-brand/5"
            >
              {/* Gradient background */}
              <div
                className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
              />

              <div className="relative">
                <div
                  className={`flex size-12 items-center justify-center rounded-xl bg-muted ${feature.iconColor} transition-transform duration-300 group-hover:scale-110`}
                >
                  <feature.icon className="size-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
