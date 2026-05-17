"use client";
// src/components/layout/AdminSidebar.tsx
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Bell, Building2, FileText, Users, Settings,
  ScrollText, GraduationCap, LogOut, ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { logout } from "@/lib/firebase/auth";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

const adminLinks = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/notices", label: "Notices", icon: Bell },
  { href: "/admin/universities", label: "Universities", icon: Building2 },
  { href: "/admin/posts", label: "Blog Posts", icon: FileText },
  { href: "/admin/users", label: "Users", icon: Users, adminOnly: true },
  { href: "/admin/settings", label: "Settings", icon: Settings, adminOnly: true },
  { href: "/admin/logs", label: "Admin Logs", icon: ScrollText, adminOnly: true },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { appUser } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      document.cookie = "__session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      router.push("/login");
      toast.success("Logged out successfully");
    } catch {
      toast.error("Logout failed");
    }
  };

  const isActive = (link: { href: string; exact?: boolean }) => {
    if (link.exact) return pathname === link.href;
    return pathname.startsWith(link.href);
  };

  return (
    <aside className="w-64 h-full bg-slate-900 text-slate-300 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-2 text-white font-bold text-lg">
          <GraduationCap className="h-6 w-6 text-blue-400" />
          <span>UAT Help</span>
        </Link>
        <p className="text-xs text-slate-500 mt-1">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {adminLinks.map((link) => {
          if (link.adminOnly && appUser?.role !== "admin") return null;
          const Icon = link.icon;
          const active = isActive(link);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                active
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              )}
            >
              <Icon className="h-4 w-4 flex-shrink-0" />
              <span className="flex-1">{link.label}</span>
              {active && <ChevronRight className="h-3 w-3 opacity-70" />}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="p-4 border-t border-slate-800">
        {appUser && (
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              {appUser.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{appUser.name}</p>
              <p className="text-xs text-slate-500 capitalize">{appUser.role}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-all w-full"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </aside>
  );
}
