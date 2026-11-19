import { cn } from "cn"

function Skeleton({
  className,
  shape = "block",
  ...props
}: React.ComponentProps<"div"> & {
  /** `circle` is for avatar placeholders. */
  shape?: "block" | "circle"
}) {
  return (
    <div
      data-slot="skeleton"
      data-shape={shape}
      className={cn(
        "animate-pulse bg-muted",
        shape === "circle" ? "rounded-full" : "rounded-md",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
