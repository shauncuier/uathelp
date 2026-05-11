import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SettingsForm } from "@/components/dashboard/settings-form";

export const metadata: Metadata = { title: "Settings" };

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirectTo=/dashboard/settings");
  }

  const [{ data: profile }, { data: preferences }] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("user_preferences").select("*").eq("user_id", user.id).maybeSingle(),
  ]);

  return (
    <SettingsForm
      userId={user.id}
      initialEmail={profile?.email ?? user.email ?? ""}
      initialProfile={{
        fullName: profile?.full_name ?? user.user_metadata?.full_name ?? "Student",
        avatarUrl: profile?.avatar_url ?? user.user_metadata?.avatar_url ?? "",
        role: profile?.role ?? "student",
        isVerified: profile?.is_verified ?? false,
        isBlocked: profile?.is_blocked ?? false,
      }}
      initialPreferences={{
        emailNotifications: preferences?.email_notifications ?? true,
        deadlineReminders: preferences?.deadline_reminders ?? true,
        productUpdates: preferences?.product_updates ?? false,
        weeklyDigest: preferences?.weekly_digest ?? false,
        themePreference: preferences?.theme_preference ?? "system",
      }}
    />
  );
}
