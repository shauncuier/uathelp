import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all duration-200 outline-none select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring active:not-aria-[haspopup]:scale-95 disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: 
          "bg-gradient-to-r from-primary to-secondary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:brightness-110 active:shadow-md",
        outline:
          "glass-button border-white/15 bg-transparent text-foreground hover:border-primary/35 hover:bg-white/10 active:bg-white/5 aria-expanded:bg-muted aria-expanded:text-foreground",
        secondary:
          "bg-gradient-to-r from-secondary to-cyan-500 text-secondary-foreground shadow-lg shadow-secondary/25 hover:shadow-xl hover:shadow-secondary/35 hover:from-secondary/90 hover:to-cyan-500/90 active:shadow-md",
        tertiary:
          "bg-gradient-to-r from-accent to-primary text-accent-foreground shadow-lg shadow-accent/20 hover:shadow-xl hover:shadow-accent/30 hover:brightness-110 active:shadow-md",
        ghost:
          "text-foreground hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        success:
          "bg-gradient-to-r from-success to-green-500 text-success-foreground shadow-lg shadow-success/25 hover:shadow-xl hover:shadow-success/35 active:shadow-md",
        warning:
          "bg-gradient-to-r from-warning to-amber-600 text-warning-foreground shadow-lg shadow-warning/25 hover:shadow-xl hover:shadow-warning/35 active:shadow-md",
        destructive:
          "bg-gradient-to-r from-destructive to-red-600 text-destructive-foreground shadow-lg shadow-destructive/25 hover:shadow-xl hover:shadow-destructive/35 active:shadow-md",
        link: "text-primary font-semibold underline-offset-4 hover:underline hover:text-primary/80 no-underline",
        glass:
          "glass-button text-foreground shadow-lg shadow-white/10 dark:shadow-black/20 hover:bg-white/20 dark:hover:bg-white/10",
        "glass-secondary":
          "glass-button bg-white/15 dark:bg-white/8 text-foreground shadow-lg shadow-white/10 dark:shadow-black/20",
      },
      size: {
        default:
          "h-9 gap-2 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-7 gap-1 rounded-md px-2 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-md px-3 text-sm in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
        lg: "h-10 gap-2 px-5 rounded-lg has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4 text-base font-semibold",
        xl: "h-11 gap-2 px-6 rounded-xl has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5 text-base font-semibold",
        icon: "size-9 rounded-lg",
        "icon-xs":
          "size-7 rounded-md in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm":
          "size-8 rounded-md in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-4",
        "icon-lg": "size-10 rounded-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
