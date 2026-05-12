"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, ArrowRight, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const categories = [
  { name: "Guide", color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  { name: "Rankings", color: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
  { name: "Scholarships", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30" },
  { name: "Preparation", color: "bg-amber-500/20 text-amber-300 border-amber-500/30" },
];

const posts = [
  { slug: "complete-admission-guide-2026", title: "Complete University Admission Guide 2026", excerpt: "Everything you need to know about applying to universities in Bangladesh — from eligibility to exam preparation.", category: "Guide", date: "2026-04-15", readTime: "12 min", featured: true },
  { slug: "top-10-engineering-universities", title: "Top 10 Engineering Universities in Bangladesh", excerpt: "A detailed comparison of the best engineering institutions including BUET, KUET, RUET, and more.", category: "Rankings", date: "2026-04-10", readTime: "8 min" },
  { slug: "scholarship-opportunities-2026", title: "Scholarship Opportunities for 2026", excerpt: "Comprehensive list of scholarships available for Bangladeshi students, both domestic and international.", category: "Scholarships", date: "2026-04-05", readTime: "10 min" },
  { slug: "buet-admission-preparation", title: "How to Prepare for BUET Admission Test", excerpt: "Step-by-step preparation guide for the most competitive engineering admission test in Bangladesh.", category: "Preparation", date: "2026-03-28", readTime: "15 min" },
  { slug: "private-vs-public-university", title: "Private vs Public University: Which is Right for You?", excerpt: "An honest comparison of private and public universities in terms of education quality, cost, and career outcomes.", category: "Guide", date: "2026-03-20", readTime: "9 min" },
  { slug: "medical-admission-guide", title: "Medical Admission Guide: MBBS in Bangladesh", excerpt: "Complete guide to medical college admissions including eligibility, exam pattern, and top colleges.", category: "Guide", date: "2026-03-15", readTime: "14 min" },
];

export function BlogPageContent() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="relative py-12 lg:py-20 border-b border-border/50 overflow-hidden">
        {/* Animated background blobs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-1/2 left-1/4 w-96 h-96 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-full blur-3xl"
            animate={{ y: [0, -40, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"
            animate={{ y: [0, 40, 0] }}
            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4 max-w-3xl"
          >
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">Blog & Guides</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Expert insights, comprehensive guides, and practical tips to help you navigate your university admission journey successfully.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 space-y-4"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 size-5 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search blog posts..."
              className="pl-12 h-12 rounded-xl border-border/50 bg-card/50 backdrop-blur-sm"
            />
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="rounded-full cursor-pointer hover:bg-muted">All Posts</Badge>
            {categories.map((cat) => (
              <Badge
                key={cat.name}
                variant="outline"
                className={`rounded-full cursor-pointer hover:bg-muted ${cat.color}`}
              >
                {cat.name}
              </Badge>
            ))}
          </div>
        </motion.div>

        {/* Featured Post */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-16"
        >
          {posts.filter(p => p.featured).map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <div className="group relative rounded-2xl border border-border/50 bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm overflow-hidden p-8 lg:p-12 hover:border-white/20 transition-all duration-500">
                {/* Hover effect background */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <Badge className={`${categories.find(c => c.name === post.category)?.color}`}>
                      {post.category}
                    </Badge>
                    <ArrowRight className="size-5 text-muted-foreground group-hover:text-foreground transition-colors group-hover:translate-x-2" />
                  </div>

                  <h2 className="text-3xl lg:text-4xl font-bold mb-4 group-hover:text-blue-400 transition-colors line-clamp-2">
                    {post.title}
                  </h2>

                  <p className="text-lg text-muted-foreground mb-6 line-clamp-2">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="size-4" />{new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                    <span className="flex items-center gap-1"><Clock className="size-4" />{post.readTime}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </motion.div>

        {/* Blog Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.filter(p => !p.featured).map((post, idx) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
            >
              <Link href={`/blog/${post.slug}`}>
                <article className="group h-full flex flex-col rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6 hover:border-white/20 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500 hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-3">
                    <Badge className={`${categories.find(c => c.name === post.category)?.color} text-xs`}>
                      {post.category}
                    </Badge>
                    <ArrowRight className="size-4 text-muted-foreground group-hover:text-blue-400 transition-all opacity-0 group-hover:opacity-100" />
                  </div>

                  <h3 className="text-lg font-semibold group-hover:text-blue-400 transition-colors line-clamp-2 flex-1 mb-3">
                    {post.title}
                  </h3>

                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1"><Calendar className="size-3" />{new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                      <span className="flex items-center gap-1"><Clock className="size-3" />{post.readTime}</span>
                    </div>
                  </div>
                </article>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
