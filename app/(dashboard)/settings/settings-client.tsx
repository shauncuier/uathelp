"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/firebase/auth-context";
import { getDocument } from "@/lib/firebase/database";
import { SettingsForm } from "@/components/dashboard/settings-form";

export function SettingsFormClient() {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [preferences, setPreferences] = useState<any>(null);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated || !user) {
      router.push("/login?redirectTo=/dashboard/settings");
      return;
    }

    const loadData = async () => {
      try {
        const [profileData, preferencesData] = await Promise.all([
          getDocument("profiles", user.uid),
          getDocument("userPreferences", user.uid),
        ]);

        setProfile(profileData);
        setPreferences(preferencesData);
      } catch (error) {
        console.error("Failed to load settings data:", error);
      } finally {
        setDataLoading(false);
      }
    };

    loadData();
  }, [user, loading, isAuthenticated, router]);

  if (loading || dataLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading settings...</p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <SettingsForm
      userId={user.uid}
      initialEmail={user.email ?? ""}
      initialProfile={{
        fullName: profile?.displayName ?? user.displayName ?? "Student",
        avatarUrl: profile?.photoURL ?? user.photoURL ?? "",
        role: profile?.role ?? "student",
        isVerified: profile?.isVerified ?? false,
        isBlocked: profile?.isBlocked ?? false,
      }}
      initialPreferences={{
        emailNotifications: preferences?.emailNotifications ?? true,
        deadlineReminders: preferences?.deadlineReminders ?? true,
        productUpdates: preferences?.productUpdates ?? false,
        weeklyDigest: preferences?.weeklyDigest ?? false,
        themePreference: preferences?.themePreference ?? "system",
      }}
    />
  );
}
