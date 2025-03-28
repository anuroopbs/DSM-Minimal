import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { AuthProvider } from "@/components/auth-provider"
import { ThemeProvider } from "@/components/theme-provider"

export const metadata: Metadata = {
  title: "Dublin Sports Mentor - Login",
  description: "Login to Dublin Sports Mentor coaching platform",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>{children}</AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'