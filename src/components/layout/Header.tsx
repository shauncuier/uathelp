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
    <header className="sticky top-0 z-50">
      {/* Ultra dark glass morphism background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/90 to-background/60 backdrop-blur-3xl supports-[backdrop-filter]:bg-background/75 border-b border-white/15 shadow-2xl shadow-black/40"></div>
      
      {/* Animated gradient overlay - Subtle for dark mode */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/25 to-transparent blur-3xl opacity-30"></div>
      </div>

      <div className="relative container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl hover:opacity-80 transition-opacity duration-200 group z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-lg blur opacity-35 group-hover:opacity-65 transition duration-300 group-hover:duration-200"></div>
            <div className="relative px-2 py-2 bg-gradient-to-br from-primary to-secondary rounded-lg shadow-lg shadow-primary/25">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
          </div>
          <span className="hidden sm:inline bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent font-bold text-lg">UAT Help</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg transition-all duration-200 relative group hover:bg-white/5 dark:hover:bg-white/10 backdrop-blur"
            >
              {link.label}
              <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-primary to-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></div>
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 z-10">
          {!loading && (
            <>
              {appUser ? (
                appUser.role === "admin" || appUser.role === "editor" ? (
                  <Link href="/admin">
                    <Button size="default" variant="default" className="hidden sm:flex gap-2 shadow-lg shadow-primary/30">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link href="/profile">
                    <Button size="default" variant="outline" className="hidden sm:flex backdrop-blur bg-white/10 dark:bg-white/5 border-white/20 dark:border-white/10 hover:bg-white/20 dark:hover:bg-white/10">
                      My Account
                    </Button>
                  </Link>
                )
              ) : (
                <Link href="/login">
                  <Button size="default" variant="default" className="hidden sm:flex gap-2 shadow-lg shadow-primary/30">
                    <LogIn className="h-4 w-4" />
                    Sign In
                  </Button>
                </Link>
              )}
            </>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden h-9 w-9 backdrop-blur" />}>
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-64 bg-gradient-to-b from-background/98 to-background/95 backdrop-blur-3xl border-l border-white/15 shadow-2xl shadow-black/50">
              <div className="flex items-center gap-2 mb-8">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary to-secondary rounded-lg blur opacity-45 transition duration-300"></div>
                  <div className="relative px-2 py-2 bg-gradient-to-br from-primary to-secondary rounded-lg">
                    <GraduationCap className="h-5 w-5 text-primary-foreground" />
                  </div>
                </div>
                <span className="font-bold text-lg bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">UAT Help</span>
              </div>
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-4 py-2 text-sm font-medium text-foreground hover:text-primary hover:bg-white/5 dark:hover:bg-white/10 rounded-lg transition-all duration-200"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t border-white/10 dark:border-white/5 mt-6 pt-6">
                  {appUser ? (
                    appUser.role === "admin" || appUser.role === "editor" ? (
                      <Link href="/admin">
                        <Button className="w-full gap-2 h-10 font-semibold" variant="default">
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/profile">
                        <Button className="w-full gap-2 h-10" variant="outline">
                          My Account
                        </Button>
                      </Link>
                    )
                  ) : (
                    <Link href="/login">
                      <Button className="w-full gap-2 h-10 font-semibold" variant="default">
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
