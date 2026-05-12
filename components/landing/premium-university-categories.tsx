"use client";

import { motion } from "framer-motion";
import { GraduationCap, Building2, Stethoscope, Cpu, Globe, ArrowRight } from "lucide-react";
import Link from "next/link";

const categories = [
  { icon: Building2, title: "Public Universities", count: 46, color: "text-blue-500", bg: "bg-blue-500/10", gradient: "from-blue-500/20 to-blue-500/0" },
  { icon: GraduationCap, title: "Private Universities", count: 108, color: "text-purple-500", bg: "bg-purple-500/10", gradient: "from-purple-500/20 to-purple-500/0" },
  { icon: Globe, title: "National Universities", count: 3, color: "text-emerald-500", bg: "bg-emerald-500/10", gradient: "from-emerald-500/20 to-emerald-500/0" },
  { icon: Stethoscope, title: "Medical Colleges", count: 37, color: "text-rose-500", bg: "bg-rose-500/10", gradient: "from-rose-500/20 to-rose-500/0" },
  { icon: Cpu, title: "Engineering", count: 12, color: "text-cyan-500", bg: "bg-cyan-500/10", gradient: "from-cyan-500/20 to-cyan-500/0" },
];

const featuredUniversities = [
  { name: "University of Dhaka", category: "Public", rank: "#1", image: "🏛️" },
  { name: "Bangladesh University of Engineering and Technology", category: "Public", rank: "#2", image: "⚙️" },
  { name: "Jagannath University", category: "Public", rank: "#3", image: "📚" },
  { name: "North South University", category: "Private", rank: "#4", image: "🌍" },
];

export function PremiumUniversityCategories() {
  return (
    <section className="relative py-24 lg:py-32" id="universities">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 -left-40 w-80 h-80 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
          animate={{ x: [0, 40, 0], y: [0, -40, 0] }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-20 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-500/10 to-cyan-500/10 rounded-full blur-3xl"
          animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ duration: 10, repeat: Infinity, delay: 1 }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-sm font-medium text-foreground">270+ Universities & Colleges</span>
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Explore by Category</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find the perfect university across all academic disciplines and institution types
          </p>
        </motion.div>

        {/* Categories Grid */}
        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="group relative cursor-pointer"
            >
              {/* Gradient background on hover */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-b ${cat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`} />
              
              {/* Card */}
              <div className="relative rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 text-center transition-all duration-500 group-hover:border-white/20 group-hover:shadow-2xl group-hover:shadow-blue-500/10 group-hover:-translate-y-2">
                {/* Icon container */}
                <div className={`mx-auto flex size-16 items-center justify-center rounded-xl ${cat.bg} ${cat.color} transition-all duration-500 group-hover:scale-125 group-hover:shadow-lg group-hover:${cat.bg}/50`}>
                  <cat.icon className="size-8" strokeWidth={1.5} />
                </div>
                
                {/* Content */}
                <h3 className="mt-5 font-semibold text-lg transition-colors duration-300 group-hover:text-white">{cat.title}</h3>
                <div className="mt-3 flex flex-col items-center gap-1">
                  <p className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">{cat.count}</p>
                  <p className="text-xs text-muted-foreground">institutions</p>
                </div>

                {/* Hover arrow */}
                <motion.div
                  className="mt-4 flex justify-center"
                  initial={{ opacity: 0, x: -10 }}
                  whileHover={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ArrowRight className="size-4 text-blue-400" />
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Featured Universities */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-24 pt-16 border-t border-border/50"
        >
          <h3 className="text-2xl sm:text-3xl font-bold text-center mb-12">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">Featured Universities</span>
          </h3>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredUniversities.map((uni, i) => (
              <motion.div
                key={uni.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="group relative"
              >
                <Link href={`/universities/${uni.name.toLowerCase().replace(/\s+/g, '-')}`}>
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-lg" />
                  
                  <div className="relative rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 transition-all duration-500 group-hover:border-white/20 group-hover:shadow-xl group-hover:-translate-y-1">
                    {/* Icon */}
                    <div className="text-4xl mb-4">{uni.image}</div>
                    
                    {/* Badge */}
                    <div className="inline-block px-3 py-1 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/20 mb-3">
                      <span className="text-xs font-semibold text-blue-400">{uni.rank}</span>
                    </div>
                    
                    {/* Content */}
                    <h4 className="font-semibold line-clamp-2 group-hover:text-blue-400 transition-colors duration-300">{uni.name}</h4>
                    <p className="text-sm text-muted-foreground mt-2">{uni.category}</p>
                    
                    {/* CTA */}
                    <motion.div
                      className="mt-4 flex items-center gap-2 text-blue-400 text-sm font-medium"
                      initial={{ opacity: 0, x: -5 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      View Details
                      <ArrowRight className="size-3" />
                    </motion.div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* View All CTA */}
          <div className="text-center mt-12">
            <Link
              href="/universities"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 font-medium text-blue-400 hover:from-blue-500/30 hover:to-purple-500/30 hover:border-blue-500/50 transition-all duration-300"
            >
              Explore All Universities
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
