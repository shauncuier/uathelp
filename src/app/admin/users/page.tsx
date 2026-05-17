"use client";
// src/app/admin/users/page.tsx
import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { auth } from "@/lib/firebase/client";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import type { UserRole, UserStatus } from "@/types";

type AdminUser = {
  id: string;
  name?: string;
  email?: string;
  role: UserRole;
  status?: UserStatus;
  createdAt?: unknown;
};

function toDate(val: unknown): Date | null {
  if (!val) return null;
  if (typeof val === "object" && "seconds" in val && typeof val.seconds === "number") return new Date(val.seconds * 1000);
  if (typeof val === "string") return new Date(val);
  return null;
}

function errorMessage(err: unknown, fallback: string) {
  return err instanceof Error ? err.message : fallback;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");

  const fetchUsers = async () => {
    const token = await auth.currentUser?.getIdToken();
    const params = new URLSearchParams({ limit: "50" });
    if (search) params.set("search", search);
    if (role !== "all") params.set("role", role);
    const res = await fetch(`/api/admin/users?${params}`, { headers: { Authorization: `Bearer ${token}` } });
    const data = await res.json();
    setUsers(data.data?.users || []);
    setLoading(false);
  };

  useEffect(() => { const t = setTimeout(fetchUsers, 300); return () => clearTimeout(t); }, [search, role]);

  const updateRole = async (id: string, newRole: string) => {
    toast(`Change user role to ${newRole}?`, {
      description: "This will alter the user's permissions.",
      action: {
        label: "Confirm",
        onClick: async () => {
          try {
            const token = await auth.currentUser?.getIdToken();
            const res = await fetch(`/api/admin/users/${id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
              body: JSON.stringify({ role: newRole }),
            });
            const result = await res.json();
            if (!result.success) throw new Error(result.error?.message);
            toast.success("Role updated");
            fetchUsers();
          } catch (err: unknown) {
            toast.error(errorMessage(err, "Failed to update role"));
          }
        }
      },
      cancel: { label: "Cancel", onClick: () => {} }
    });
  };

  const updateStatus = async (id: string, newStatus: UserStatus) => {
    toast(`${newStatus === "active" ? "Activate" : newStatus === "suspended" ? "Suspend" : "Disable"} user?`, {
      description: newStatus === "active" ? "This user will regain access." : "This user will no longer be able to sign in.",
      action: {
        label: "Confirm",
        onClick: async () => {
          try {
            const token = await auth.currentUser?.getIdToken();
            const res = await fetch(`/api/admin/users/${id}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
              body: JSON.stringify({ status: newStatus }),
            });
            const result = await res.json();
            if (!result.success) throw new Error(result.error?.message);
            toast.success("Status updated");
            fetchUsers();
          } catch (err: unknown) {
            toast.error(errorMessage(err, "Failed to update status"));
          }
        }
      },
      cancel: { label: "Cancel", onClick: () => {} }
    });
  };

  const statusClass = (status: UserStatus) => {
    if (status === "active") return "bg-green-100 text-green-700";
    if (status === "suspended") return "bg-amber-100 text-amber-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-muted-foreground text-sm">Manage platform users and access levels</p>
        </div>
      </div>
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search users by email or name..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="editor">Editor</SelectItem>
            <SelectItem value="student">Student</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="bg-white rounded-xl border overflow-hidden">
        {loading ? (
          <div className="p-4 space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
        ) : users.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">No users found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left px-5 py-3 font-medium text-muted-foreground">User</th>
                <th className="text-left px-3 py-3 font-medium text-muted-foreground">Joined</th>
                <th className="text-left px-3 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-right px-5 py-3 font-medium text-muted-foreground">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {users.map((u) => {
                const joined = toDate(u.createdAt);
                return (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-3 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">{u.name?.[0]?.toUpperCase() || "U"}</div>
                      <div>
                        <p className="font-medium text-foreground">{u.name || "Unknown"}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-muted-foreground text-xs">{joined ? format(joined, "dd MMM yyyy") : "Unknown"}</td>
                    <td className="px-3 py-3">
                      <Select value={u.status || "active"} onValueChange={(val) => updateStatus(u.id, val as UserStatus)}>
                        <SelectTrigger className={`w-32 h-8 text-xs capitalize ${statusClass(u.status || "active")}`}><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="suspended">Suspended</SelectItem>
                          <SelectItem value="disabled">Disabled</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Select value={u.role} onValueChange={(val) => updateRole(u.id, val)}>
                        <SelectTrigger className="w-28 h-8 text-xs ml-auto"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="student">Student</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
