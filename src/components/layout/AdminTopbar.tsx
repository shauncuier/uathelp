"use client";
// src/components/layout/AdminTopbar.tsx
import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

interface AdminTopbarProps {
  title: string;
  onMenuToggle?: () => void;
}

export function AdminTopbar({ title, onMenuToggle }: AdminTopbarProps) {
  const { appUser } = useAuth();

  return (
    <header className="h-16 border-b bg-white flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuToggle}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="font-semibold text-lg text-foreground">{title}</h1>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm text-muted-foreground hidden sm:block">
          {appUser?.email}
        </span>
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-sm font-bold">
          {appUser?.name?.charAt(0).toUpperCase() || "A"}
        </div>
      </div>
    </header>
  );
}
