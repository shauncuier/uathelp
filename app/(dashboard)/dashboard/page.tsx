import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { PremiumDashboard } from "@/components/dashboard/premium-dashboard";

export const metadata: Metadata = { title: "Dashboard | UAT Help" };

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = user
    ? await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()
    : { data: null };
  const displayName = profile?.full_name ?? user?.email?.split("@")[0] ?? "Student";

  return (
    <PremiumDashboard displayName={displayName} userRole={profile?.role} />
  );
}
