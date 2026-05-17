"use client";
// src/app/admin/settings/page.tsx
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateSettingsSchema, UpdateSettingsInput } from "@/lib/validations/settings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/firebase/client";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const form = useForm<UpdateSettingsInput>({
    resolver: zodResolver(updateSettingsSchema),
    defaultValues: {
      siteName: "UAT Help", seoTitle: "", seoDescription: "",
      contactEmail: "", facebookUrl: "", youtubeUrl: "",
      allowRegistration: true, maintenanceMode: false,
    },
  });

  useEffect(() => {
    auth.currentUser?.getIdToken().then(async (token) => {
      const res = await fetch("/api/admin/settings", { headers: { Authorization: `Bearer ${token}` } });
      const data = await res.json();
      if (data.success && data.data) {
        form.reset(data.data);
      }
      setLoading(false);
    });
  }, [form]);

  const onSubmit = async (data: UpdateSettingsInput) => {
    setSaving(true);
    try {
      const token = await auth.currentUser?.getIdToken();
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.error?.message);
      toast.success("Settings updated");
    } catch (err: any) {
      toast.error(err.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="space-y-4"><Skeleton className="h-64 rounded-xl" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Site Settings</h1>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-3xl">
        <Card>
          <CardHeader><CardTitle className="text-lg">General Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5"><Label>Site Name</Label><Input {...form.register("siteName")} /></div>
            <div className="space-y-1.5"><Label>Contact Email</Label><Input {...form.register("contactEmail")} type="email" /></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">SEO & Meta</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5"><Label>Global SEO Title</Label><Input {...form.register("seoTitle")} /></div>
            <div className="space-y-1.5"><Label>Global SEO Description</Label><Textarea {...form.register("seoDescription")} rows={3} /></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">Social Links</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1.5"><Label>Facebook URL</Label><Input {...form.register("facebookUrl")} placeholder="https://facebook.com/..." /></div>
            <div className="space-y-1.5"><Label>YouTube URL</Label><Input {...form.register("youtubeUrl")} placeholder="https://youtube.com/..." /></div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle className="text-lg">System Status</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...form.register("allowRegistration")} className="rounded" />
              <span className="text-sm font-medium">Allow New User Registration</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" {...form.register("maintenanceMode")} className="rounded" />
              <span className="text-sm font-medium">Enable Maintenance Mode (Hides public site)</span>
            </label>
          </CardContent>
        </Card>
        <Button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Settings"}</Button>
      </form>
    </div>
  );
}
