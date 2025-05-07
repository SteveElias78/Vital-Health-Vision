
import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
import { Check } from "lucide-react"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>
>(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "art-deco-checkbox peer h-4 w-4 shrink-0 rounded-sm border border-gold-500/50 bg-midnight-800 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/40 focus-visible:ring-offset-2 data-[state=checked]:bg-gold-500/20 data-[state=checked]:border-gold-500 data-[state=checked]:text-gold-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-200",
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={cn("flex items-center justify-center text-gold-500")}
    >
      <Check className="h-3.5 w-3.5" />
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
