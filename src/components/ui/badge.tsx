import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1.5 overflow-hidden rounded-full border px-3 py-0.5 text-xs font-semibold whitespace-nowrap transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-ring has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3.5!",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-primary/90 to-blue-500/90 text-primary-foreground border-primary/30 shadow-sm",
        secondary:
          "bg-gradient-to-r from-secondary/90 to-cyan-500/90 text-secondary-foreground border-secondary/30 shadow-sm",
        tertiary:
          "bg-gradient-to-r from-accent/90 to-orange-500/90 text-accent-foreground border-accent/30 shadow-sm",
        success:
          "bg-gradient-to-r from-success/90 to-green-500/90 text-success-foreground border-success/30 shadow-sm",
        warning:
          "bg-gradient-to-r from-warning/90 to-amber-500/90 text-warning-foreground border-warning/30 shadow-sm",
        destructive:
          "bg-gradient-to-r from-destructive/90 to-red-500/90 text-destructive-foreground border-destructive/30 shadow-sm",
        outline:
          "border-border/80 text-foreground bg-background/50 hover:bg-muted/50 hover:border-border/60",
        ghost:
          "text-muted-foreground hover:bg-muted hover:text-foreground border-transparent dark:hover:bg-muted/50",
        link: "text-primary font-semibold underline-offset-2 hover:underline border-transparent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  render,
  ...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
  return useRender({
    defaultTagName: "span",
    props: mergeProps<"span">(
      {
        className: cn(badgeVariants({ variant }), className),
      },
      props
    ),
    render,
    state: {
      slot: "badge",
      variant,
    },
  })
}

export { Badge, badgeVariants }
