
import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "art-deco-input flex h-10 w-full rounded-md border border-gold-500/30 bg-midnight-800 px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gold-400/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/40 focus-visible:ring-offset-2 focus-visible:shadow-[0_0_10px_rgba(255,199,0,0.3)] transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
