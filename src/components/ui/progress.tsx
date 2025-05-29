import * as React from "react"

import { cn } from "../../utils/cn"

const Progress = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    value?: number
    max?: number
    variant?: "default" | "success" | "warning" | "destructive"
  }
>(({ className, value, max = 100, variant = "default", ...props }, ref) => {
  const percentage = value !== undefined ? Math.min((value / max) * 100, 100) : 0

  const variantClassNames = {
    default: "bg-primary",
    success: "bg-success",
    warning: "bg-yellow-500",
    destructive: "bg-destructive"
  }

  return (
    <div
      ref={ref}
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-secondary", className)}
      {...props}
    >
      <div
        className={cn("h-full w-full flex-1 transition-all", variantClassNames[variant])}
        style={{ transform: `translateX(-${100 - percentage}%)` }}
      />
    </div>
  )
})
Progress.displayName = "Progress"

export { Progress }