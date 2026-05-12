import type { Metadata } from "next";
import { universities } from "@/config/universities";
import { createClient } from "@/lib/supabase/server";
import { AdminManagementPage } from "@/components/admin/admin-management-page";

export const metadata: Metadata = { title: "Admin Dashboard | UAT Help" };

export default async function AdminDashboardPage() {
  const supabase = await createClient();
  const { count: userCount } = await supabase.from("profiles").select("id", { count: "exact", head: true });
  const { count: conversationCount } = await supabase.from("conversations").select("id", { count: "exact", head: true });

  return (
    <AdminManagementPage
      userCount={userCount ?? 0}
      conversationCount={conversationCount ?? 0}
      universityCount={universities.length}
    />
  );
}
