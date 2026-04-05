"use client"

import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "@/lib/utils"

function Textarea({
  className,
  ...props
}: useRender.ComponentProps<"textarea">) {
  return useRender({
    defaultTagName: "textarea",
    props: mergeProps<"textarea">(
      {
        className: cn(
          "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        ),
      },
      props
    ),
    state: {
      slot: "textarea",
    },
  })
}

export { Textarea }
