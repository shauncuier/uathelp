import type { Metadata } from "next";
import { GraduationCap, MessageSquare, Bookmark, Bell, ArrowRight, TrendingUp, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = { title: "Dashboard" };

const stats = [
  { label: "Saved Universities", value: "8", icon: GraduationCap, href: "/dashboard/saved", change: "+2 this week" },
  { label: "AI Conversations", value: "23", icon: MessageSquare, href: "/chat", change: "+5 today" },
  { label: "Bookmarked Articles", value: "12", icon: Bookmark, href: "/dashboard/bookmarks", change: "+1 this week" },
  { label: "Notifications", value: "3", icon: Bell, href: "/dashboard/notifications", change: "3 unread" },
];

const recentActivity = [
  { action: "Saved BUET to favorites", time: "2 hours ago", icon: GraduationCap },
  { action: "Asked AI about DU admission dates", time: "5 hours ago", icon: MessageSquare },
  { action: "Bookmarked \"BUET Preparation Guide\"", time: "1 day ago", icon: Bookmark },
  { action: "Application deadline reminder: NSU", time: "2 days ago", icon: Bell },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Welcome back! 👋</h1>
        <p className="mt-1 text-muted-foreground">Here&apos;s an overview of your admission journey.</p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <div className="rounded-2xl border border-border bg-card p-5 transition-all hover:border-brand/30 hover:shadow-lg hover:-translate-y-0.5">
              <div className="flex items-center justify-between">
                <stat.icon className="size-5 text-brand" />
                <ArrowRight className="size-4 text-muted-foreground" />
              </div>
              <p className="mt-3 text-2xl font-bold">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="mt-1 flex items-center gap-1 text-xs text-emerald-500">
                <TrendingUp className="size-3" />{stat.change}
              </p>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-semibold">Quick Actions</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/chat"><Button className="bg-brand text-brand-foreground hover:bg-brand/90"><MessageSquare className="mr-2 size-4" />Chat with AI</Button></Link>
          <Link href="/universities"><Button variant="outline"><GraduationCap className="mr-2 size-4" />Browse Universities</Button></Link>
          <Link href="/blog"><Button variant="outline"><Bookmark className="mr-2 size-4" />Read Guides</Button></Link>
        </div>
      </div>

      {/* Recent activity */}
      <div className="rounded-2xl border border-border bg-card p-6">
        <h2 className="font-semibold">Recent Activity</h2>
        <div className="mt-4 space-y-4">
          {recentActivity.map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                <item.icon className="size-4 text-muted-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm truncate">{item.action}</p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="size-3" />{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
