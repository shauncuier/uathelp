"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, MessageSquare, Bookmark, Bell, ArrowRight, TrendingUp, Clock, Calendar, AlertCircle, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DashboardProps {
  displayName: string;
  userRole?: string;
}

const stats = [
  { label: "Saved Universities", value: "8", icon: GraduationCap, href: "/dashboard/saved", change: "+2 this week", color: "from-blue-500/20 to-blue-500/0" },
  { label: "AI Conversations", value: "23", icon: MessageSquare, href: "/chat", change: "+5 today", color: "from-purple-500/20 to-purple-500/0" },
  { label: "Bookmarked Articles", value: "12", icon: Bookmark, href: "/dashboard/bookmarks", change: "+1 this week", color: "from-emerald-500/20 to-emerald-500/0" },
  { label: "Notifications", value: "3", icon: Bell, href: "/dashboard/notifications", change: "3 unread", color: "from-amber-500/20 to-amber-500/0" },
];

const recentActivity = [
  { action: "Saved BUET to favorites", time: "2 hours ago", icon: GraduationCap, color: "bg-blue-500/20 text-blue-400" },
  { action: "Asked AI about DU admission dates", time: "5 hours ago", icon: MessageSquare, color: "bg-purple-500/20 text-purple-400" },
  { action: "Bookmarked \"BUET Preparation Guide\"", time: "1 day ago", icon: Bookmark, color: "bg-emerald-500/20 text-emerald-400" },
  { action: "Application deadline reminder: NSU", time: "2 days ago", icon: Bell, color: "bg-amber-500/20 text-amber-400" },
];

const upcomingDeadlines = [
  { university: "University of Dhaka", deadline: "2026-05-20", daysLeft: 7, status: "urgent" },
  { university: "BUET", deadline: "2026-05-25", daysLeft: 12, status: "soon" },
  { university: "NSU", deadline: "2026-06-10", daysLeft: 28, status: "ok" },
];

export function PremiumDashboard({ displayName, userRole }: DashboardProps) {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
            Welcome back, {displayName}! 👋
          </h1>
          <p className="mt-2 text-lg text-muted-foreground">Here's an overview of your admission journey.</p>
        </div>
        {userRole && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-300"
          >
            {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
          </motion.div>
        )}
      </motion.div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <Link href={stat.href}>
                <div className={`group relative rounded-2xl border border-border/50 bg-gradient-to-br ${stat.color} backdrop-blur-sm p-6 transition-all duration-500 hover:border-white/20 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-1 cursor-pointer`}>
                  {/* Hover overlay */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 rounded-lg bg-muted/50 group-hover:bg-muted transition-colors">
                        <Icon className="size-5 text-blue-400" />
                      </div>
                      <ArrowRight className="size-4 text-muted-foreground group-hover:text-foreground transition-all opacity-0 group-hover:opacity-100 group-hover:translate-x-1" />
                    </div>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                    <p className="mt-2 flex items-center gap-1 text-xs text-emerald-400 font-medium">
                      <TrendingUp className="size-3" />{stat.change}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </div>

      {/* Upcoming Deadlines Alert */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 to-amber-500/5 backdrop-blur-sm p-6"
      >
        <div className="flex items-start gap-4">
          <div className="p-2 rounded-lg bg-amber-500/20">
            <Calendar className="size-5 text-amber-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              Upcoming Deadlines
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-500/20 text-amber-400">{upcomingDeadlines.length}</span>
            </h3>
            <div className="mt-4 space-y-3">
              {upcomingDeadlines.map((deadline, idx) => (
                <motion.div
                  key={deadline.university}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + (idx * 0.1) }}
                  className="flex items-center justify-between p-3 rounded-lg bg-card/50 border border-border/50"
                >
                  <div>
                    <p className="font-medium text-foreground">{deadline.university}</p>
                    <p className="text-xs text-muted-foreground">Deadline: {new Date(deadline.deadline).toLocaleDateString()}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                    deadline.status === "urgent" ? "bg-red-500/20 text-red-400" :
                    deadline.status === "soon" ? "bg-amber-500/20 text-amber-400" :
                    "bg-emerald-500/20 text-emerald-400"
                  }`}>
                    {deadline.daysLeft} days left
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6"
      >
        <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
          <Zap className="size-5 text-blue-400" />
          Quick Actions
        </h2>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link href="/chat">
            <Button className="w-full rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white gap-2">
              <MessageSquare className="size-4" />Chat with AI
            </Button>
          </Link>
          <Link href="/universities">
            <Button variant="outline" className="w-full rounded-lg gap-2">
              <GraduationCap className="size-4" />Browse Universities
            </Button>
          </Link>
          <Link href="/blog">
            <Button variant="outline" className="w-full rounded-lg gap-2">
              <Bookmark className="size-4" />Read Guides
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Recent activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="rounded-2xl border border-border/50 bg-card/50 backdrop-blur-sm p-6"
      >
        <h2 className="font-semibold text-lg flex items-center gap-2 mb-4">
          <Clock className="size-5 text-purple-400" />
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
                transition={{ delay: 0.6 + (i * 0.05) }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className={`flex size-10 shrink-0 items-center justify-center rounded-lg ${item.color}`}>
                  <Icon className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground truncate">{item.action}</p>
                  <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="size-3" />{item.time}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Info card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="rounded-2xl border border-blue-500/30 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 backdrop-blur-sm p-6 flex gap-4"
      >
        <div className="p-2 rounded-lg bg-blue-500/20 flex-shrink-0">
          <AlertCircle className="size-5 text-blue-400" />
        </div>
        <div>
          <p className="font-semibold text-foreground mb-1">Pro Tip</p>
          <p className="text-sm text-muted-foreground">Use our AI chatbot to get personalized admission recommendations. It can analyze your profile and suggest the best universities for you.</p>
        </div>
      </motion.div>
    </div>
  );
}
