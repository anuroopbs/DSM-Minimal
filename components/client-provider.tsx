"use client"

import { useEffect, useState, type ReactNode } from "react"

export function ClientProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false)

  // Only run on client-side
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return <>{children}</>
}

