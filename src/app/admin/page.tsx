"use client";
// src/app/admin/page.tsx
import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, Building2, FileText, Users, AlertTriangle, Plus, Clock } from "lucide-react";
import { StatsCard } from "@/components/admin/StatsCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CategoryBadge } from "@/components/shared/CategoryBadge";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase/client";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";

function toDate(val: any): Date | null {
  if (!val) return null;
  if (val?.seconds) return new Date(val.seconds * 1000);
  if (typeof val === "string") return new Date(val);
  return null;
}

async function fetchDashboard(token: string) {
  const res = await fetch("/api/admin/dashboard", {
    headers: { Authorization: `Bearer ${token}` },
  });
  const data = await res.json();
  return data.success ? data.data : null;
}

export default function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      user.getIdToken().then((token) => {
        fetchDashboard(token).then((data) => {
          setStats(data);
          setLoading(false);
        });
      });
    }
  }, [user]);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-28 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <div className="flex gap-2">
          <Link href="/admin/notices/new"><Button size="sm" className="gap-1.5"><Plus className="h-4 w-4" />Add Notice</Button></Link>
          <Link href="/admin/universities/new"><Button size="sm" variant="outline" className="gap-1.5"><Plus className="h-4 w-4" />Add University</Button></Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard title="Total Notices" value={stats?.totalNotices || 0} icon={Bell} color="blue" />
        <StatsCard title="Published" value={stats?.publishedNotices || 0} icon={Bell} color="green" description="Live notices" />
        <StatsCard title="Drafts" value={stats?.draftNotices || 0} icon={Bell} color="orange" />
        <StatsCard title="Urgent" value={stats?.urgentNotices || 0} icon={AlertTriangle} color="red" />
        <StatsCard title="Universities" value={stats?.totalUniversities || 0} icon={Building2} color="purple" />
        <StatsCard title="Blog Posts" value={stats?.totalBlogPosts || 0} icon={FileText} color="blue" />
        <StatsCard title="Total Users" value={stats?.totalUsers || 0} icon={Users} color="green" />
        <StatsCard title="Archived" value={stats?.archivedNotices || 0} icon={Bell} color="orange" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Notices */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Latest Notices</CardTitle>
            <Link href="/admin/notices" className="text-xs text-primary hover:underline">View all</Link>
          </CardHeader>
          <CardContent className="p-0">
            {stats?.latestNotices?.length > 0 ? (
              <div className="divide-y">
                {stats.latestNotices.map((n: any) => (
                  <div key={n.id} className="px-5 py-3 flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{n.title}</p>
                      <p className="text-xs text-muted-foreground">{n.universityName}</p>
                    </div>
                    <CategoryBadge category={n.category} />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No notices yet</p>
            )}
          </CardContent>
        </Card>

        {/* Upcoming Deadlines */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-base">Upcoming Deadlines</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="p-0">
            {stats?.upcomingDeadlines?.length > 0 ? (
              <div className="divide-y">
                {stats.upcomingDeadlines.map((n: any) => {
                  const deadline = toDate(n.applicationEnd);
                  return (
                    <div key={n.id} className="px-5 py-3 flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{n.title}</p>
                        <p className="text-xs text-muted-foreground">{n.universityName}</p>
                      </div>
                      {deadline && (
                        <span className="text-xs font-medium text-red-600 flex-shrink-0">
                          {format(deadline, "dd MMM")}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">No upcoming deadlines</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Logs */}
        {stats?.recentAdminLogs?.length > 0 && (
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-base">Recent Activity</CardTitle>
              <Link href="/admin/logs" className="text-xs text-primary hover:underline">View all</Link>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {stats.recentAdminLogs.slice(0, 8).map((log: any) => {
                  const date = toDate(log.createdAt);
                  return (
                    <div key={log.id} className="px-5 py-2.5 flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-mono mr-2">{log.action}</span>
                        <span className="text-xs text-muted-foreground">{log.entityTitle}</span>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-muted-foreground">{log.performedByEmail}</p>
                        {date && <p className="text-xs text-muted-foreground">{format(date, "dd MMM HH:mm")}</p>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
