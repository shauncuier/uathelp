"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { createClient } from "@/lib/supabase/client";
import { loginSchema } from "@/lib/validations";
import { ZodError } from "zod";

export default function LoginPage() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/dashboard";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      // Validate input
      const validatedData = loginSchema.parse({ email, password });

      const { data, error } = await supabase.auth.signInWithPassword({
        email: validatedData.email,
        password: validatedData.password,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      // Redirect on successful sign-in
      router.push(redirectTo);
    } catch (err) {
      if (err instanceof ZodError) {
        const errors: Record<string, string> = {};
        err.issues.forEach((issue) => {
          const path = issue.path.join(".");
          errors[path] = issue.message;
        });
        setFieldErrors(errors);
        setError("Please fix the errors below");
      } else {
        setError("An unexpected error occurred");
      }
      setLoading(false);
    }
  };

  return (
    <div className="glass rounded-2xl p-8">
      <div className="flex flex-col items-center text-center">
        <div className="flex size-12 items-center justify-center rounded-xl bg-brand/10">
          <Sparkles className="size-6 text-brand" />
        </div>
        <h1 className="mt-4 text-2xl font-bold">Welcome back</h1>
        <p className="mt-1 text-sm text-muted-foreground">Sign in to your UAT Help account</p>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
         <div className="space-y-2">
           <Label htmlFor="email">Email</Label>
           <Input
             id="email"
             type="email"
             placeholder="you@example.com"
             value={email}
             onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
             className={fieldErrors.email ? "border-destructive" : ""}
           />
           {fieldErrors.email && <p className="text-sm text-destructive">{fieldErrors.email}</p>}
         </div>
         <div className="space-y-2">
           <div className="flex items-center justify-between">
             <Label htmlFor="password">Password</Label>
             <Link href="/reset-password" className="text-xs text-brand hover:underline">Forgot password?</Link>
           </div>
           <Input
             id="password"
             type="password"
             placeholder="••••••••"
             value={password}
             onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
             className={fieldErrors.password ? "border-destructive" : ""}
           />
           {fieldErrors.password && <p className="text-sm text-destructive">{fieldErrors.password}</p>}
         </div>
         {error && <p className="text-sm text-destructive">{error}</p>}
         <Button type="submit" className="w-full bg-brand text-brand-foreground hover:bg-brand/90" disabled={loading}>
           {loading ? "Signing in..." : "Sign In"}
         </Button>
       </form>

      <div className="my-6 flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">or</span>
        <Separator className="flex-1" />
      </div>

      <Button variant="outline" className="w-full gap-2" onClick={() => supabase.auth.signInWithOAuth({ provider: 'google' })}>
        <Mail className="size-4" />
        Continue with Google
      </Button>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-brand hover:underline">Sign up</Link>
      </p>
    </div>
  );
}
