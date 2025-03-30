
"use client"

import { usePathname, useRouter } from "next/navigation"
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
      className="absolute top-6 left-4 md:left-6"
      onClick={() => router.push(href)}
    >
      <ChevronLeft className="h-4 w-4 mr-1" />
      Back
    </Button>
  )
}
