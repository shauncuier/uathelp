"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError("No verification token provided");
      setLoading(false);
      return;
    }

    const verifyEmail = async () => {
      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`);
        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Failed to verify email");
          setLoading(false);
          return;
        }

        setVerified(true);
        setLoading(false);

        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push("/dashboard");
        }, 3000);
      } catch (err) {
        setError("An error occurred during verification");
        setLoading(false);
      }
    };

    verifyEmail();
  }, [token, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <div className="glass rounded-2xl p-8 w-full max-w-md">
        <div className="flex flex-col items-center text-center">
          {loading && (
            <>
              <div className="flex size-12 items-center justify-center rounded-xl bg-brand/10 animate-pulse">
                <Sparkles className="size-6 text-brand" />
              </div>
              <h1 className="mt-4 text-2xl font-bold">Verifying Email</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Please wait while we verify your email...
              </p>
            </>
          )}

          {verified && !loading && (
            <>
              <div className="flex size-12 items-center justify-center rounded-xl bg-green-100">
                <CheckCircle2 className="size-6 text-green-600" />
              </div>
              <h1 className="mt-4 text-2xl font-bold text-green-600">Email Verified!</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Your email has been verified successfully. Redirecting to dashboard...
              </p>
              <Button
                onClick={() => router.push("/dashboard")}
                className="mt-6 w-full bg-brand text-brand-foreground hover:bg-brand/90"
              >
                Go to Dashboard
              </Button>
            </>
          )}

          {error && !loading && (
            <>
              <div className="flex size-12 items-center justify-center rounded-xl bg-destructive/10">
                <AlertCircle className="size-6 text-destructive" />
              </div>
              <h1 className="mt-4 text-2xl font-bold text-destructive">Verification Failed</h1>
              <p className="mt-2 text-sm text-destructive">{error}</p>
              <Button
                onClick={() => router.push("/login")}
                className="mt-6 w-full bg-brand text-brand-foreground hover:bg-brand/90"
              >
                Back to Login
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
