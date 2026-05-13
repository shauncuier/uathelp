"use client";

import { useAuth } from "@/lib/firebase/auth-context";
import { useEffect, useState } from "react";
import { getDocument } from "@/lib/firebase/database";
import { PremiumDashboard } from "@/components/dashboard/premium-dashboard";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [displayName, setDisplayName] = useState("Student");
  const [userRole, setUserRole] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      const profile = await getDocument("profiles", user.uid);
      setDisplayName(profile?.displayName ?? user.displayName ?? user.email?.split("@")[0] ?? "Student");
      setUserRole(profile?.role as string | undefined);
    };

    loadProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <PremiumDashboard displayName={displayName} userRole={userRole} />
  );
}
