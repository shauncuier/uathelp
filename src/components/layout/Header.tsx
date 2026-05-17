"use client";
// src/components/layout/Header.tsx
import Link from "next/link";
import { useState } from "react";
import { Menu, X, Search, GraduationCap, LogIn, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navLinks = [
  { href: "/notices", label: "Notices" },
  { href: "/universities", label: "Universities" },
  { href: "/tips", label: "Tips" },
  { href: "/guides", label: "Guides" },
];

export function Header() {
  const { appUser, loading } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
          <GraduationCap className="h-6 w-6" />
          <span>UAT Help</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <Link href="/notices?search=true">
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Search className="h-4 w-4" />
            </Button>
          </Link>

          {!loading && (
            <>
              {appUser ? (
                appUser.role === "admin" || appUser.role === "editor" ? (
                  <Link href="/admin">
                    <Button size="sm" className="hidden sm:flex gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link href="/profile">
                    <Button variant="outline" size="sm" className="hidden sm:flex">
                      My Account
                    </Button>
                  </Link>
                )
              ) : (
                <Link href="/login">
                  <Button size="sm" className="hidden sm:flex gap-2">
                    <LogIn className="h-4 w-4" />
                    Login
                  </Button>
                </Link>
              )}
            </>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger render={<Button variant="ghost" size="icon" className="md:hidden" />}>
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex items-center gap-2 mb-6 pt-2">
                <GraduationCap className="h-6 w-6 text-primary" />
                <span className="font-bold text-lg text-primary">UAT Help</span>
              </div>
              <nav className="flex flex-col gap-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="px-3 py-2.5 text-sm font-medium text-foreground hover:text-primary hover:bg-accent rounded-md transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="border-t mt-3 pt-3">
                  {appUser ? (
                    appUser.role === "admin" || appUser.role === "editor" ? (
                      <Link href="/admin">
                        <Button className="w-full gap-2">
                          <LayoutDashboard className="h-4 w-4" />
                          Admin Dashboard
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/profile">
                        <Button className="w-full gap-2" variant="outline">
                          My Account
                        </Button>
                      </Link>
                    )
                  ) : (
                    <Link href="/login">
                      <Button className="w-full gap-2">
                        <LogIn className="h-4 w-4" />
                        Login
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
