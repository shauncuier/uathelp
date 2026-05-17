// src/app/unauthorized/page.tsx
import Link from "next/link";
import { ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
          <ShieldX className="h-10 w-10 text-red-500" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-6">
          You don&apos;t have permission to view this page. Admin or Editor access is required.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/"><Button variant="outline">Go Home</Button></Link>
          <Link href="/login"><Button>Login as Admin</Button></Link>
        </div>
      </div>
    </div>
  );
}
