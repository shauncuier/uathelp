import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, glass = false, ...props }: React.ComponentProps<"input"> & { glass?: boolean }) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-lg border px-3.5 py-2 text-base transition-all duration-200 outline-none placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-60 file:inline-flex file:h-7 file:border-0 file:bg-primary file:text-primary-foreground file:text-sm file:font-semibold file:rounded-md file:cursor-pointer file:transition-all file:hover:bg-primary/90",
        glass
          ? "glass-input border-white/20 aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive/30"
          : "border-border/80 bg-card focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:shadow-md disabled:bg-muted/50 aria-invalid:border-destructive/50 aria-invalid:ring-1 aria-invalid:ring-destructive/30",
        className
      )}
      {...props}
    />
  )
}

export { Input }
