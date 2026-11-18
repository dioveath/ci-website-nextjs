import * as React from "react"
import { Search } from "lucide-react"

import { Input } from "./input"
import { Label } from "./label"

/**
 * A labelled search box with a leading icon.
 *
 * The icon needs the field to carry extra left padding, which `<Input>` owns.
 * Rather than every call site reaching in with `pl-9`, the composition lives
 * here once.
 */
function SearchField({
  id,
  label,
  className,
  ...props
}: Omit<React.ComponentProps<typeof Input>, "type"> & {
  id: string
  label: string
}) {
  return (
    <div className={className}>
      <Label htmlFor={id} className="sr-only">
        {label}
      </Label>
      <div className="relative">
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input id={id} type="search" className="pl-9" {...props} />
      </div>
    </div>
  )
}

export { SearchField }
