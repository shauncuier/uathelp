"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Building2,
  BookOpen,
  Megaphone,
  BarChart3,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UniversityManagement } from "@/components/admin/university-management";
import { BlogManagement } from "@/components/admin/blog-management";
import { CircularsManagement } from "@/components/admin/circulars-management";
import { PremiumAdminDashboard } from "@/components/admin/premium-admin-dashboard";

interface AdminManagementProps {
  userCount: number;
  conversationCount: number;
  universityCount: number;
}

export function AdminManagementPage({
  userCount,
  conversationCount,
  universityCount,
}: AdminManagementProps) {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage all content and system settings
          </p>
        </motion.div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="dashboard" className="gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="universities" className="gap-2">
              <Building2 className="w-4 h-4" />
              <span className="hidden sm:inline">Universities</span>
            </TabsTrigger>
            <TabsTrigger value="blog" className="gap-2">
              <BookOpen className="w-4 h-4" />
              <span className="hidden sm:inline">Blog</span>
            </TabsTrigger>
            <TabsTrigger value="circulars" className="gap-2">
              <Megaphone className="w-4 h-4" />
              <span className="hidden sm:inline">Circulars</span>
            </TabsTrigger>
          </TabsList>

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            <TabsContent value="dashboard">
              <PremiumAdminDashboard
                userCount={userCount}
                conversationCount={conversationCount}
                universityCount={universityCount}
              />
            </TabsContent>

            <TabsContent value="universities">
              <UniversityManagement />
            </TabsContent>

            <TabsContent value="blog">
              <BlogManagement />
            </TabsContent>

            <TabsContent value="circulars">
              <CircularsManagement />
            </TabsContent>
          </motion.div>
        </Tabs>
      </div>
    </div>
  );
}
