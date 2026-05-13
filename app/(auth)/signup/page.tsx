"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Sparkles, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { signUp, signInWithGoogle, updateUserProfile } from "@/lib/firebase/auth";
import { setDocument } from "@/lib/firebase/database";
import { signupSchema } from "@/lib/validations";
import { ZodError } from "zod";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "/dashboard";
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);
    setFieldErrors({});

    try {
      // Validate input
      const validatedData = signupSchema.parse({
        fullName,
        email,
        password,
        confirmPassword,
        agreeToTerms,
      });

      // Create user in Firebase Auth
      const userCredential = await signUp(validatedData.email, validatedData.password);

      // Update user profile with full name
      await updateUserProfile(validatedData.fullName);

      // Create user profile document in Firestore
      if (userCredential.user) {
        await setDocument(
          "profiles",
          userCredential.user.uid,
          {
            id: userCredential.user.uid,
            email: userCredential.user.email ?? validatedData.email,
            displayName: validatedData.fullName,
            role: "student",
            isVerified: false,
            isBlocked: false,
            photoURL: userCredential.user.photoURL ?? null,
            createdAt: new Date().toISOString(),
          }
        );

        // Create user preferences document
        await setDocument(
          "userPreferences",
          userCredential.user.uid,
          {
            userId: userCredential.user.uid,
            emailNotifications: true,
            deadlineReminders: true,
            productUpdates: false,
            weeklyDigest: false,
            themePreference: "system",
          }
        );
      }

      // Redirect on successful sign-up
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
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      const userCredential = await signInWithGoogle();

      // Create user profile document if it doesn't exist
      if (userCredential.user) {
        await setDocument(
          "profiles",
          userCredential.user.uid,
          {
            id: userCredential.user.uid,
            email: userCredential.user.email,
            displayName: userCredential.user.displayName,
            role: "student",
            isVerified: true, // Google sign-in is verified
            isBlocked: false,
            photoURL: userCredential.user.photoURL,
            createdAt: new Date().toISOString(),
          },
          true // merge to avoid overwriting if document exists
        );

        // Create user preferences document if it doesn't exist
        await setDocument(
          "userPreferences",
          userCredential.user.uid,
          {
            userId: userCredential.user.uid,
            emailNotifications: true,
            deadlineReminders: true,
            productUpdates: false,
            weeklyDigest: false,
            themePreference: "system",
          },
          true // merge to avoid overwriting if document exists
        );
      }

      // Redirect after successful Google sign-in
      router.push(redirectTo);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to sign in with Google");
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
        <h1 className="mt-4 text-2xl font-bold">Create your account</h1>
        <p className="mt-1 text-sm text-muted-foreground">Start your admission journey with UAT Help</p>
      </div>

       <form onSubmit={handleSubmit} className="mt-8 space-y-4">
         <div className="space-y-2">
           <Label htmlFor="name">Full Name</Label>
           <Input
             id="name"
             placeholder="Your full name"
             value={fullName}
             onChange={(e) => setFullName(e.currentTarget.value)}
             className={fieldErrors.fullName ? "border-destructive" : ""}
           />
           {fieldErrors.fullName && <p className="text-sm text-destructive">{fieldErrors.fullName}</p>}
         </div>
         <div className="space-y-2">
           <Label htmlFor="email">Email</Label>
           <Input
             id="email"
             type="email"
             placeholder="you@example.com"
             value={email}
             onChange={(e) => setEmail(e.currentTarget.value)}
             className={fieldErrors.email ? "border-destructive" : ""}
           />
           {fieldErrors.email && <p className="text-sm text-destructive">{fieldErrors.email}</p>}
         </div>
         <div className="space-y-2">
           <Label htmlFor="password">Password</Label>
           <Input
             id="password"
             type="password"
             placeholder="••••••••"
             value={password}
             onChange={(e) => setPassword(e.currentTarget.value)}
             className={fieldErrors.password ? "border-destructive" : ""}
           />
           {fieldErrors.password && <p className="text-sm text-destructive">{fieldErrors.password}</p>}
           <p className="text-xs text-muted-foreground">
             Must contain uppercase, lowercase, number, and special character
           </p>
         </div>
         <div className="space-y-2">
           <Label htmlFor="confirmPassword">Confirm Password</Label>
           <Input
             id="confirmPassword"
             type="password"
             placeholder="••••••••"
             value={confirmPassword}
             onChange={(e) => setConfirmPassword(e.currentTarget.value)}
             className={fieldErrors.confirmPassword ? "border-destructive" : ""}
           />
           {fieldErrors.confirmPassword && <p className="text-sm text-destructive">{fieldErrors.confirmPassword}</p>}
         </div>
         <div className="flex items-center space-x-2">
           <input
             id="terms"
             type="checkbox"
             checked={agreeToTerms}
             onChange={(e) => setAgreeToTerms(e.currentTarget.checked)}
             className="h-4 w-4 rounded border-gray-300"
           />
           <Label htmlFor="terms" className="text-sm font-normal cursor-pointer">
             I agree to the terms and conditions
           </Label>
         </div>
         {fieldErrors.agreeToTerms && <p className="text-sm text-destructive">{fieldErrors.agreeToTerms}</p>}
         {error && <p className="text-sm text-destructive">{error}</p>}
         {message && <p className="text-sm text-green-600">{message}</p>}
         <Button type="submit" className="w-full bg-brand text-brand-foreground hover:bg-brand/90" disabled={loading}>
           {loading ? "Creating account..." : "Create Account"}
         </Button>
       </form>

      <div className="my-6 flex items-center gap-3">
        <Separator className="flex-1" />
        <span className="text-xs text-muted-foreground">or</span>
        <Separator className="flex-1" />
      </div>

      <Button variant="outline" className="w-full gap-2" onClick={handleGoogleSignIn} disabled={loading}>
        <Mail className="size-4" />
        Continue with Google
      </Button>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-brand hover:underline">Sign in</Link>
      </p>
    </div>
  );
}
