"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { BellRing, Loader2, Palette, ShieldCheck, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type SettingsProfile = {
  fullName: string;
  avatarUrl: string;
  role: string;
  isVerified: boolean;
  isBlocked: boolean;
};

type SettingsPreferences = {
  emailNotifications: boolean;
  deadlineReminders: boolean;
  productUpdates: boolean;
  weeklyDigest: boolean;
  themePreference: string;
};

type SettingsFormProps = {
  userId: string;
  initialEmail: string;
  initialProfile: SettingsProfile;
  initialPreferences: SettingsPreferences;
};

const themeOptions = [
  { label: "System", value: "system" },
  { label: "Light", value: "light" },
  { label: "Dark", value: "dark" },
] as const;

function statusClass(isActive: boolean) {
  return isActive
    ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
    : "border-border bg-muted text-muted-foreground";
}

export function SettingsForm({
  userId,
  initialEmail,
  initialProfile,
  initialPreferences,
}: SettingsFormProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const { setTheme } = useTheme();

  const [fullName, setFullName] = useState(initialProfile.fullName);
  const [avatarUrl, setAvatarUrl] = useState(initialProfile.avatarUrl);
  const [emailAddress] = useState(initialEmail);
  const [emailNotifications, setEmailNotifications] = useState(initialPreferences.emailNotifications);
  const [deadlineReminders, setDeadlineReminders] = useState(initialPreferences.deadlineReminders);
  const [productUpdates, setProductUpdates] = useState(initialPreferences.productUpdates);
  const [weeklyDigest, setWeeklyDigest] = useState(initialPreferences.weeklyDigest);
  const [themePreference, setThemePreference] = useState(initialPreferences.themePreference);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setMessage(null);
    setError(null);

    const normalizedName = fullName.trim();
    const normalizedAvatar = avatarUrl.trim();
    const timestamp = new Date().toISOString();

    const { error: authError } = await supabase.auth.updateUser({
      data: {
        full_name: normalizedName,
        avatar_url: normalizedAvatar || null,
      },
    });

    if (authError) {
      setError(authError.message);
      setSaving(false);
      return;
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name: normalizedName,
        avatar_url: normalizedAvatar || null,
        updated_at: timestamp,
      })
      .eq("id", userId);

    if (profileError) {
      setError(profileError.message);
      setSaving(false);
      return;
    }

    const { error: preferencesError } = await supabase.from("user_preferences").upsert(
      {
        user_id: userId,
        email_notifications: emailNotifications,
        deadline_reminders: deadlineReminders,
        product_updates: productUpdates,
        weekly_digest: weeklyDigest,
        theme_preference: themePreference,
        updated_at: timestamp,
      },
      { onConflict: "user_id" }
    );

    if (preferencesError) {
      setError(preferencesError.message);
      setSaving(false);
      return;
    }

    setTheme(themePreference);
    setMessage("Settings saved.");
    setSaving(false);
    router.refresh();
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  const initials = useMemo(() => {
    const source = fullName || emailAddress;
    return source
      .split(" ")
      .map((part) => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [emailAddress, fullName]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-1 text-muted-foreground">Manage your profile, notifications, and account security.</p>
      </div>

      <form onSubmit={handleSave} className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-brand/10">
                <User className="size-5 text-brand" />
              </div>
              <div>
                <h2 className="font-semibold">Profile</h2>
                <p className="text-sm text-muted-foreground">Update the basics for your account.</p>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-4">
              <Avatar className="size-14">
                <AvatarImage src={avatarUrl || undefined} alt={fullName} />
                <AvatarFallback>{initials}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <p className="text-sm font-medium">{fullName}</p>
                <p className="text-xs text-muted-foreground">{emailAddress}</p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <Badge variant="outline" className={cn("capitalize", statusClass(initialProfile.isVerified))}>
                    {initialProfile.isVerified ? "Verified" : "Unverified"}
                  </Badge>
                  <Badge variant="outline" className={cn("capitalize", statusClass(!initialProfile.isBlocked))}>
                    {initialProfile.isBlocked ? "Blocked" : "Active"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="settings-name">Full name</Label>
                <Input id="settings-name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-avatar">Avatar URL</Label>
                <Input
                  id="settings-avatar"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="settings-email">Email</Label>
                <Input id="settings-email" value={emailAddress} readOnly className="bg-muted/50" />
                <p className="text-xs text-muted-foreground">Email changes are managed through your sign-in provider.</p>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-brand/10">
                <Palette className="size-5 text-brand" />
              </div>
              <div>
                <h2 className="font-semibold">Appearance</h2>
                <p className="text-sm text-muted-foreground">Choose your preferred color mode.</p>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <Label htmlFor="settings-theme">Theme preference</Label>
              <Select value={themePreference} onValueChange={(value) => setThemePreference(value || "system")}>
                <SelectTrigger id="settings-theme" className="w-full">
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  {themeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-brand/10">
                <BellRing className="size-5 text-brand" />
              </div>
              <div>
                <h2 className="font-semibold">Notifications</h2>
                <p className="text-sm text-muted-foreground">Control the updates you want to receive.</p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <SettingRow
                title="Email notifications"
                description="Receive account and product emails."
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
              />
              <Separator />
              <SettingRow
                title="Deadline reminders"
                description="Get reminders for university deadlines."
                checked={deadlineReminders}
                onCheckedChange={setDeadlineReminders}
              />
              <Separator />
              <SettingRow
                title="Product updates"
                description="Hear about new features and improvements."
                checked={productUpdates}
                onCheckedChange={setProductUpdates}
              />
              <Separator />
              <SettingRow
                title="Weekly digest"
                description="Get a weekly summary of saved items and alerts."
                checked={weeklyDigest}
                onCheckedChange={setWeeklyDigest}
              />
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-xl bg-brand/10">
                <ShieldCheck className="size-5 text-brand" />
              </div>
              <div>
                <h2 className="font-semibold">Security</h2>
                <p className="text-sm text-muted-foreground">Your account is protected by Supabase sessions.</p>
              </div>
            </div>

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4 rounded-xl border border-border px-4 py-3">
                <span className="text-muted-foreground">Session security</span>
                <span className="font-medium">Enabled</span>
              </div>
              <div className="flex items-center justify-between gap-4 rounded-xl border border-border px-4 py-3">
                <span className="text-muted-foreground">Role</span>
                <span className="font-medium capitalize">{initialProfile.role.replace("_", " ")}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button type="submit" className="bg-brand text-brand-foreground hover:bg-brand/90" disabled={saving}>
                {saving ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save changes"
                )}
              </Button>
              <Button type="button" variant="outline" onClick={handleLogout} disabled={loggingOut}>
                {loggingOut ? "Signing out..." : "Sign out"}
              </Button>
            </div>

            {message && <p className="mt-4 text-sm text-emerald-600 dark:text-emerald-400">{message}</p>}
            {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
          </section>
        </div>
      </form>
    </div>
  );
}

function SettingRow({
  title,
  description,
  checked,
  onCheckedChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="space-y-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}
