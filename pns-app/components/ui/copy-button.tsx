"use client"

import * as React from "react"
import { CheckIcon, CopyIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CopyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  className?: string
  variant?: "default" | "ghost"
  iconSize?: number
}

export function CopyButton({
  value,
  className,
  variant = "ghost",
  iconSize = 16,
  ...props
}: CopyButtonProps) {
  const [hasCopied, setHasCopied] = React.useState(false)
  const buttonSize = iconSize + 16 // Add 16px padding (8px on each side)

  React.useEffect(() => {
    if (hasCopied) {
      const timeout = setTimeout(() => setHasCopied(false), 2000)
      return () => clearTimeout(timeout)
    }
  }, [hasCopied])

  return (
    <Button
      variant={variant}
      className={cn(
        "relative z-10 hover:bg-zinc-700 hover:text-zinc-50",
        className
      )}
      style={{ 
        width: buttonSize, 
        height: buttonSize,
        padding: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
      onClick={() => {
        navigator.clipboard.writeText(value)
        setHasCopied(true)
      }}
      {...props}
    >
      <span className="sr-only">Copy</span>
      {hasCopied ? (
        <CheckIcon style={{ width: iconSize, height: iconSize }} />
      ) : (
        <CopyIcon style={{ width: iconSize, height: iconSize }} />
      )}
    </Button>
  )
}
