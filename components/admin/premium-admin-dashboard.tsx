"use client";

import { motion } from "framer-motion";
import { Users, GraduationCap, FileText, Eye, TrendingUp, MessageSquare, AlertTriangle, Lock, Activity } from "lucide-react";
import Link from "next/link";

interface AdminDashboardProps {
  userCount?: number;
  conversationCount?: number;
  universityCount?: number;
}

export function PremiumAdminDashboard({ userCount = 0, conversationCount = 0, universityCount = 270 }: AdminDashboardProps) {
  const stats = [
    { label: "Total Users", value: String(userCount), change: "live", icon: Users, color: "from-blue-500/20 to-blue-500/0", badge: "bg-blue-500/20 text-blue-400" },
    { label: "Universities", value: String(universityCount), change: "catalog", icon: GraduationCap, color: "from-purple-500/20 to-purple-500/0", badge: "bg-purple-500/20 text-purple-400" },
    { label: "Blog Posts", value: "6", change: "mdx-ready", icon: FileText, color: "from-emerald-500/20 to-emerald-500/0", badge: "bg-emerald-500/20 text-emerald-400" },
    { label: "Page Views", value: "128K", change: "+18%", icon: Eye, color: "from-amber-500/20 to-amber-500/0", badge: "bg-amber-500/20 text-amber-400" },
    { label: "AI Chats", value: String(conversationCount), change: "saved", icon: MessageSquare, color: "from-pink-500/20 to-pink-500/0", badge: "bg-pink-500/20 text-pink-400" },
    { label: "Conversion", value: "4.2%", change: "+0.5%", icon: TrendingUp, color: "from-cyan-500/20 to-cyan-500/0", badge: "bg-cyan-500/20 text-cyan-400" },
  ];

  const recentActivity = [
    { action: "New user registered: Rafiq Ahmed", time: "5 mins ago", type: "user", icon: Users },
    { action: "University updated: BUET deadlines", time: "1 hour ago", type: "university", icon: GraduationCap },
    { action: "Blog post published: Admission Guide 2026", time: "3 hours ago", type: "content", icon: FileText },
    { action: "Circular added: DU CSE 2026", time: "5 hours ago", type: "circular", icon: Activity },
  ];

  const adminSections = [
    { name: "Users", href: "/admin/users", icon: Users, description: "Manage user accounts and roles", color: "from-blue-400 to-cyan-400" },
    { name: "Universities", href: "/admin/universities", icon: GraduationCap, description: "Update university data", color: "from-purple-400 to-pink-400" },
    { name: "Blog", href: "/admin/blog", icon: FileText, description: "Create and manage posts", color: "from-emerald-400 to-teal-400" },
    { name: "Circulars", href: "/admin/circulars", icon: AlertTriangle, description: "Post admission circulars", color: "from-amber-400 to-orange-400" },
    { name: "Analytics", href: "/admin/analytics", icon: TrendingUp, description: "View platform analytics", color: "from-cyan-400 to-blue-400" },
    { name: "Security", href: "/admin/settings", icon: Lock, description: "Security & settings", color: "from-rose-400 to-pink-400" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-400 to-pink-400">
          Admin Dashboard
        </h1>
        <p className="mt-2 text-muted-foreground">Platform analytics, user management, and system overview.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <div className={`group relative rounded-2xl border border-border/50 bg-gradient-to-br ${stat.color} backdrop-blur-sm p-6 transition-all duration-500 hover:border-white/20 hover:shadow-lg hover:shadow-rose-500/10 hover:-translate-y-1`}>
                {/* Hover overlay */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-rose-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 rounded-lg bg-muted/50">
                      <Icon className="size-5 text-rose-400" />
                    </div>
                    <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.badge}`}>
                      {stat.change}
                    </span>
                  </div>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Admin Sections */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <h2 className="text-xl font-bold mb-4">Quick Access</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {adminSections.map((section, idx) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + (idx * 0.08) }}
              >
                <Link href={section.href}>
                  <div className="group relative rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm p-5 hover:border-white/20 transition-all duration-500 hover:shadow-lg cursor-pointer h-full">
                    <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${section.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                    <div className="relative z-10">
                      <div className="p-2.5 rounded-lg bg-gradient-to-br from-muted/50 to-muted/30 w-fit mb-3">
                        <Icon className="size-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </div>
                      <h3 className="font-semibold text-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r transition-colors" style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }}>
                        {section.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">{section.description}</p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6"
      >
        <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
          <Activity className="size-5 text-rose-400" />
          Recent Activity
        </h2>
        <div className="space-y-3">
          {recentActivity.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7 + (i * 0.05) }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted/50">
                  <Icon className="size-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{item.action}</p>
                  <p className="text-xs text-muted-foreground">{item.time}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* System Health */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 backdrop-blur-sm p-6"
      >
        <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
          <div className="flex items-center justify-center size-5 rounded-full bg-emerald-500/30">
            <div className="size-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>
          System Health
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">API Uptime</span>
            <span className="font-semibold text-emerald-400">99.9%</span>
          </div>
          <div className="w-full bg-muted/30 rounded-full h-1.5">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-1.5 rounded-full" style={{ width: "99.9%" }} />
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
            <span>Database Response: 45ms</span>
            <span className="text-emerald-400">Optimal</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
