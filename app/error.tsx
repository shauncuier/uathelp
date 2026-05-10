"use client";

import { Button } from "@/components/ui/button";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center px-4 text-center">
      <div className="flex size-20 items-center justify-center rounded-2xl bg-destructive/10">
        <AlertTriangle className="size-10 text-destructive" />
      </div>
      <h1 className="mt-6 text-2xl font-bold">Something went wrong</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        An unexpected error occurred. Please try again.
      </p>
      <Button onClick={reset} className="mt-6 gap-2">
        <RotateCcw className="size-4" />
        Try Again
      </Button>
    </div>
  );
}
