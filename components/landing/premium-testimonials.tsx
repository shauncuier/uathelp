"use client";

import { motion } from "framer-motion";
import { Star, Users } from "lucide-react";

const testimonials = [
  {
    name: "Ayesha Rahman",
    role: "BUET Student",
    university: "Bangladesh University of Engineering & Technology",
    content:
      "UAT Help's AI recommendations were spot-on. I got admitted to BUET on my first try. The platform made everything so clear!",
    avatar: "AR",
    rating: 5,
    gradient: "from-indigo-500 to-purple-600",
    delay: 0,
  },
  {
    name: "Mohammad Karim",
    role: "DU Medical Student",
    university: "University of Dhaka",
    content:
      "The success probability calculator helped me understand my realistic chances. Accurate predictions and great guidance throughout.",
    avatar: "MK",
    rating: 5,
    gradient: "from-cyan-500 to-blue-600",
    delay: 0.1,
  },
  {
    name: "Fatima Islam",
    role: "IBA Student",
    university: "Institute of Business Administration",
    content:
      "Best platform for admission guidance in Bangladesh. The AI chatbot answered all my questions instantly. Highly recommended!",
    avatar: "FI",
    rating: 5,
    gradient: "from-rose-500 to-pink-600",
    delay: 0.2,
  },
  {
    name: "Fahim Hassan",
    role: "SUST Student",
    university: "Shahjalal University of Science & Technology",
    content:
      "The real-time circular updates saved me from missing important deadlines. UAT Help is an absolute game-changer!",
    avatar: "FH",
    rating: 5,
    gradient: "from-emerald-500 to-teal-600",
    delay: 0.3,
  },
];

/**
 * Testimonial Card
 */
function TestimonialCard({
  name,
  role,
  university,
  content,
  avatar,
  rating,
  gradient,
  delay,
}: (typeof testimonials)[0]) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="group relative rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition-all duration-300 hover:border-white/20 hover:bg-white/10"
    >
      {/* Gradient overlay on hover */}
      <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-5 bg-gradient-to-br ${gradient} transition-opacity`} />

      {/* Rating */}
      <div className="relative flex gap-1 mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <Star
            key={i}
            className="size-4 fill-amber-400 text-amber-400"
          />
        ))}
      </div>

      {/* Content */}
      <p className="relative text-foreground leading-relaxed mb-6 italic">
        "{content}"
      </p>

      {/* Author */}
      <div className="relative flex items-center gap-4">
        <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-semibold text-sm`}>
          {avatar}
        </div>
        <div>
          <p className="font-semibold text-sm">{name}</p>
          <p className="text-xs text-muted-foreground">{role}</p>
          <p className="text-xs text-muted-foreground/70">{university}</p>
        </div>
      </div>
    </motion.div>
  );
}

/**
 * Premium Testimonials Section
 */
export function PremiumTestimonials() {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center space-y-4 mb-16"
        >
          <div className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium bg-white/10 border border-white/20">
            <Users className="size-4 text-indigo-400" />
            <span>Trusted by Students</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold">
            Join thousands of successful students
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hear from students who achieved their dream university admission
            with help from UAT Help.
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, i) => (
            <TestimonialCard key={i} {...testimonial} />
          ))}
        </div>

        {/* Stats Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center border-t border-white/10 pt-16"
        >
          {[
            { label: "Success Rate", value: "94%" },
            { label: "Universities", value: "250+" },
            { label: "Students Helped", value: "5K+" },
            { label: "Admissions", value: "4.7K" },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
