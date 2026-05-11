"use client";

import { useState, useEffect } from "react";
import { Users, ShieldCheck, Mail, Lock, Unlock, Trash2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

interface User {
  id: string;
  full_name: string;
  email: string;
  role: "student" | "moderator" | "admin" | "super_admin";
  is_blocked: boolean;
  is_verified: boolean;
  created_at: string;
}

export default function AdminUsersPage() {
  const supabase = createClient();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setUsers(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const toggleBlockUser = async (userId: string, currentBlock: boolean) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ is_blocked: !currentBlock })
        .eq("id", userId);

      if (error) throw error;
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user");
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) throw error;
      await loadUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update role");
    }
  };

  const roleColors: Record<string, string> = {
    student: "bg-blue-500/20 text-blue-700 dark:text-blue-400",
    moderator: "bg-orange-500/20 text-orange-700 dark:text-orange-400",
    admin: "bg-red-500/20 text-red-700 dark:text-red-400",
    super_admin: "bg-purple-500/20 text-purple-700 dark:text-purple-400",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="mt-1 text-muted-foreground">Manage user roles, access, and account status.</p>
      </div>

      {error && (
        <div className="rounded-2xl border border-destructive/50 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="rounded-2xl border border-border bg-card">
        <div className="border-b border-border px-6 py-4">
          <h2 className="font-semibold">All Users ({users.length})</h2>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Email</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-border/50 hover:bg-accent/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-medium">{user.full_name}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(user.created_at).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm">{user.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={user.role}
                        onChange={(e) => updateUserRole(user.id, e.target.value)}
                        className={`text-xs px-3 py-1.5 rounded-lg font-medium border-0 cursor-pointer ${roleColors[user.role]}`}
                      >
                        <option value="student">Student</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs">
                        {user.is_verified ? (
                          <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                            <CheckCircle className="size-3.5" />
                            Verified
                          </div>
                        ) : (
                          <div className="text-yellow-600 dark:text-yellow-400">Unverified</div>
                        )}
                        {user.is_blocked && (
                          <div className="flex items-center gap-1 text-destructive">
                            <Lock className="size-3.5" />
                            Blocked
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleBlockUser(user.id, user.is_blocked)}
                          title={user.is_blocked ? "Unblock user" : "Block user"}
                        >
                          {user.is_blocked ? (
                            <Unlock className="size-4 text-green-600" />
                          ) : (
                            <Lock className="size-4 text-orange-600" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
