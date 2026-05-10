import { AnimatedGradient } from "@/components/shared/animated-gradient";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-dvh items-center justify-center">
      <AnimatedGradient />
      <div className="relative z-10 w-full max-w-md px-4 py-12">{children}</div>
    </div>
  );
}
