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
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 border-b border-slate-200/50 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-blue-600 hover:opacity-80 transition-opacity">
          <GraduationCap className="h-6 w-6" />
          <span className="hidden sm:inline bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">UAT Help</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-blue-600 hover:bg-blue-50/50 rounded-lg transition-all duration-200"
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
                    <Button size="sm" className="hidden sm:flex gap-2 h-9 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link href="/profile">
                    <Button size="sm" className="hidden sm:flex h-9 border-2 border-blue-200 text-blue-600 hover:bg-blue-50 font-semibold rounded-lg">
                      My Account
                    </Button>
                  </Link>
                )
              ) : (
                <Link href="/login">
                  <Button size="sm" className="hidden sm:flex gap-2 h-9 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
              )}
            </>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden h-9 w-9" />}>
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex items-center gap-2 mb-8">
                <GraduationCap className="h-6 w-6 text-blue-600" />
                <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">UAT Help</span>
              </div>
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-4 py-2 text-sm font-medium text-foreground hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t border-slate-200 mt-6 pt-6">
                  {appUser ? (
                    appUser.role === "admin" || appUser.role === "editor" ? (
                      <Link href="/admin">
                        <Button className="w-full gap-2 h-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/profile">
                        <Button className="w-full gap-2 h-10 border-2 border-blue-200 text-blue-600 hover:bg-blue-50 font-semibold rounded-lg" variant="outline">
                          My Account
                        </Button>
                      </Link>
                    )
                  ) : (
                    <Link href="/login">
                      <Button className="w-full gap-2 h-10 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg">
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
