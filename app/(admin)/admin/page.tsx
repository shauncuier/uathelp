"use client";

import { useEffect, useState } from "react";
import { universities } from "@/config/universities";
import { AdminManagementPage } from "@/components/admin/admin-management-page";
import { queryDocuments } from "@/lib/firebase/database";

export default function AdminDashboardPage() {
  const [userCount, setUserCount] = useState(0);
  const [conversationCount, setConversationCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCounts = async () => {
      try {
        const [profiles, conversations] = await Promise.all([
          queryDocuments("profiles"),
          queryDocuments("conversations"),
        ]);
        setUserCount(profiles.length);
        setConversationCount(conversations.length);
      } catch (error) {
        console.error("Failed to load admin counts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadCounts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted-foreground">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <AdminManagementPage
      userCount={userCount}
      conversationCount={conversationCount}
      universityCount={universities.length}
    />
  );
}
