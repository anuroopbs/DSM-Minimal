"use client"

import type React from "react"

import "@/app/globals.css"
import { AuthProvider } from "@/components/auth-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { useEffect, useState } from "react"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  // Only run on client-side
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Dublin Sports Mentor</title>
        <meta name="description" content="Dublin Sports Mentor coaching platform" />
        <meta name="generator" content="v0.dev" />
      </head>
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>{mounted ? children : null}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
