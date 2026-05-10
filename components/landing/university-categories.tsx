"use client";

import { motion } from "framer-motion";
import { GraduationCap, Building2, Stethoscope, Cpu, Globe } from "lucide-react";

const categories = [
  { icon: Building2, title: "Public Universities", count: 46, color: "text-blue-500", bg: "bg-blue-500/10" },
  { icon: GraduationCap, title: "Private Universities", count: 108, color: "text-purple-500", bg: "bg-purple-500/10" },
  { icon: Globe, title: "National Universities", count: 3, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { icon: Stethoscope, title: "Medical Colleges", count: 37, color: "text-rose-500", bg: "bg-rose-500/10" },
  { icon: Cpu, title: "Engineering", count: 12, color: "text-cyan-500", bg: "bg-cyan-500/10" },
];

export function UniversityCategories() {
  return (
    <section className="py-24" id="universities">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Explore by <span className="gradient-text">category</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Browse universities by type to find the perfect fit for your academic goals.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group cursor-pointer rounded-2xl border border-border bg-card p-6 text-center transition-all duration-300 hover:border-brand/30 hover:shadow-lg hover:shadow-brand/5 hover:-translate-y-1"
            >
              <div className={`mx-auto flex size-14 items-center justify-center rounded-xl ${cat.bg} ${cat.color} transition-transform duration-300 group-hover:scale-110`}>
                <cat.icon className="size-7" />
              </div>
              <h3 className="mt-4 font-semibold">{cat.title}</h3>
              <p className="mt-1 text-2xl font-bold gradient-text">{cat.count}</p>
              <p className="text-xs text-muted-foreground">universities</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
