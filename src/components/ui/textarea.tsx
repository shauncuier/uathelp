import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, glass = false, ...props }: React.ComponentProps<"textarea"> & { glass?: boolean }) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-24 w-full rounded-lg border px-3.5 py-2.5 text-base transition-all duration-200 outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-60 resize-vertical md:text-sm",
        glass
          ? "glass-input border-white/20 aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive/30"
          : "border-border/80 bg-card focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:shadow-md disabled:bg-muted/50 aria-invalid:border-destructive/50 aria-invalid:ring-1 aria-invalid:ring-destructive/30",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
