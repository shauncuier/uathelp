"use client";

import { cn } from "@/lib/utils";

interface AnimatedGradientProps {
  className?: string;
}

export function AnimatedGradient({ className }: AnimatedGradientProps) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
    >
      {/* Primary blob */}
      <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-[oklch(0.65_0.22_265_/_15%)] blur-[120px] animate-blob" />

      {/* Secondary blob */}
      <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-[oklch(0.7_0.2_200_/_12%)] blur-[100px] animate-blob [animation-delay:2s]" />

      {/* Accent blob */}
      <div className="absolute top-1/2 left-1/2 h-[300px] w-[300px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[oklch(0.75_0.15_290_/_10%)] blur-[80px] animate-blob [animation-delay:4s]" />

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(oklch(0.5 0 0 / 100%) 1px, transparent 1px),
            linear-gradient(90deg, oklch(0.5 0 0 / 100%) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />
    </div>
  );
}
