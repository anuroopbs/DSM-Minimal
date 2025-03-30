
"use client"

import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"

export function BackButton({ href = "/" }: { href?: string }) {
  const router = useRouter()
  const pathname = usePathname()
  
  // Don't show back button on home page
  if (pathname === "/") return null

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-1"
      onClick={() => router.push(href)}
    >
      <ChevronLeft className="h-4 w-4" />
      <span>Back</span>
    </Button>
  )
}
