"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Sparkles, LayoutDashboard, GraduationCap, Megaphone, FileText, Users, BarChart3, ArrowLeft, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/shared/theme-toggle";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { logOut } from "@/lib/firebase/auth";

const navItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Universities", href: "/admin/universities", icon: GraduationCap },
  { title: "Circulars", href: "/admin/circulars", icon: Megaphone },
  { title: "Blog Posts", href: "/admin/blog", icon: FileText },
  { title: "Users", href: "/admin/users", icon: Users },
  { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logOut();
    router.push("/login");
  };

  return (
    <div className="flex min-h-dvh">
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card transition-transform lg:static lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <Link href="/admin" className="flex items-center gap-2 font-bold">
            <div className="flex size-8 items-center justify-center rounded-lg bg-rose-500 text-white">
              <Sparkles className="size-4" />
            </div>
            Admin Panel
          </Link>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="size-5" />
          </Button>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
              className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                pathname === item.href ? "bg-rose-500/10 text-rose-500" : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}>
              <item.icon className="size-4" />{item.title}
            </Link>
          ))}
        </nav>
        <div className="border-t border-border p-3">
          <Link href="/" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground">
            <ArrowLeft className="size-4" />Back to Site
          </Link>
          <button
            className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-muted-foreground hover:bg-accent hover:text-foreground"
            onClick={handleLogout}
          >
            <ArrowLeft className="size-4 rotate-180" />
            Log out
          </button>
        </div>
      </aside>

      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border px-4 lg:px-8">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="size-5" />
          </Button>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <div className="flex size-8 items-center justify-center rounded-full bg-rose-500/10 text-sm font-bold text-rose-500">A</div>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
