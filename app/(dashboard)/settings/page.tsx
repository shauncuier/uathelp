"use client";

import { useState } from "react";
import { User, BellRing, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  const [name, setName] = useState("Student");
  const [email, setEmail] = useState("student@example.com");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        <p className="mt-1 text-muted-foreground">Update your account details and notification preferences.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-brand/10">
              <User className="size-5 text-brand" />
            </div>
            <div>
              <h2 className="font-semibold">Profile</h2>
              <p className="text-sm text-muted-foreground">Basic account details.</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="settings-name">Full Name</Label>
              <Input id="settings-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="settings-email">Email</Label>
              <Input id="settings-email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <Button className="bg-brand text-brand-foreground hover:bg-brand/90">Save Changes</Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-brand/10">
                <BellRing className="size-5 text-brand" />
              </div>
              <div>
                <h2 className="font-semibold">Notifications</h2>
                <p className="text-sm text-muted-foreground">Deadline reminders and product updates.</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-brand/10">
                <ShieldCheck className="size-5 text-brand" />
              </div>
              <div>
                <h2 className="font-semibold">Security</h2>
                <p className="text-sm text-muted-foreground">Supabase session security and route protection are enabled.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
