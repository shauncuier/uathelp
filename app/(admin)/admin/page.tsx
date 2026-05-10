import type { Metadata } from "next";
import { Users, GraduationCap, FileText, Eye, TrendingUp, MessageSquare } from "lucide-react";

export const metadata: Metadata = { title: "Admin Dashboard" };

const stats = [
  { label: "Total Users", value: "2,847", change: "+12%", icon: Users },
  { label: "Universities", value: "156", change: "+3", icon: GraduationCap },
  { label: "Blog Posts", value: "42", change: "+5", icon: FileText },
  { label: "Page Views", value: "128K", change: "+18%", icon: Eye },
  { label: "AI Chats", value: "45K", change: "+32%", icon: MessageSquare },
  { label: "Conversion", value: "4.2%", change: "+0.5%", icon: TrendingUp },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Overview of platform analytics and management.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <stat.icon className="size-5 text-rose-500" />
              <span className="text-xs text-emerald-500 font-medium">{stat.change}</span>
            </div>
            <p className="mt-3 text-2xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-semibold">Recent Activity</h2>
        <div className="mt-4 space-y-3">
          {["New user registered: Rafiq Ahmed", "University updated: BUET deadlines", "Blog post published: Admission Guide 2026", "Circular added: DU CSE 2026"].map((activity, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg bg-muted/50 p-3 text-sm">
              <div className="size-2 rounded-full bg-rose-500" />
              {activity}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
