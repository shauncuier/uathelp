"use client";
// src/components/layout/Header.tsx
import Link from "next/link";
import { Menu, GraduationCap, LogIn, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navLinks = [
  { href: "/notices", label: "Notices" },
  { href: "/universities", label: "Universities" },
  { href: "/tips", label: "Tips" },
];

export function Header() {
  const { appUser, loading } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary hover:opacity-80 transition-opacity">
          <GraduationCap className="h-5 w-5" />
          <span className="hidden sm:inline">UAT Help</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-slate-100/50 rounded transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {!loading && (
            <>
              {appUser ? (
                appUser.role === "admin" || appUser.role === "editor" ? (
                  <Link href="/admin">
                    <Button size="sm" variant="default" className="hidden sm:flex gap-2 h-8">
                      <LayoutDashboard className="h-3.5 w-3.5" />
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link href="/profile">
                    <Button size="sm" variant="outline" className="hidden sm:flex h-8">
                      My Account
                    </Button>
                  </Link>
                )
              ) : (
                <Link href="/login">
                  <Button size="sm" className="hidden sm:flex gap-2 h-8">
                    <LogIn className="h-3.5 w-3.5" />
                    Sign In
                  </Button>
                </Link>
              )}
            </>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden h-8 w-8" />}>
              <Menu className="h-4 w-4" />
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex items-center gap-2 mb-6">
                <GraduationCap className="h-5 w-5 text-primary" />
                <span className="font-bold text-primary">UAT Help</span>
              </div>
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-3 py-2 text-sm text-foreground hover:bg-slate-100 rounded transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t mt-4 pt-4">
                  {appUser ? (
                    appUser.role === "admin" || appUser.role === "editor" ? (
                      <Link href="/admin">
                        <Button className="w-full gap-2 h-9">
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/profile">
                        <Button className="w-full gap-2 h-9" variant="outline">
                          My Account
                        </Button>
                      </Link>
                    )
                  ) : (
                    <Link href="/login">
                      <Button className="w-full gap-2 h-9">
                        <LogIn className="h-4 w-4" />
                        Sign In
                      </Button>
                    </Link>
                  )}
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
