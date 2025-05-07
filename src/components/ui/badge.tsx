
import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gold-500/40 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-gold-500/20 text-gold-300 hover:bg-gold-500/30",
        secondary:
          "border-transparent bg-midnight-800 text-gold-400 hover:bg-midnight-700",
        destructive:
          "border-transparent bg-midnight-900 text-gold-300 hover:bg-midnight-800",
        outline: "border-gold-500/30 text-gold-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
