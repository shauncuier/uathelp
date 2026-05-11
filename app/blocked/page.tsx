import Link from "next/link";
import { Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BlockedPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-4">
      <div className="glass rounded-2xl p-8 max-w-md">
        <div className="flex flex-col items-center text-center">
          <div className="flex size-16 items-center justify-center rounded-xl bg-destructive/10">
            <AlertCircle className="size-8 text-destructive" />
          </div>
          <h1 className="mt-6 text-2xl font-bold">Account Blocked</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account has been temporarily blocked. Please contact support for more information.
          </p>
        </div>

        <Link href="/" className="mt-8 block">
          <Button variant="outline" className="w-full">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
}
