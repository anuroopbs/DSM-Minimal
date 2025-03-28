"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useEffect, useState } from "react"

export default function HomePage() {
  const [mounted, setMounted] = useState(false)

  // Only run on client-side
  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything until client-side
  if (!mounted) {
    return null
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="py-6 border-b border-gray-100">
        <div className="container flex items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">Dublin Sports Mentor</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-900 hover:text-gray-900 hover:bg-gray-100">
                Log In
              </Button>
            </Link>
            <Link href="/register">
              <Button className="bg-gray-900 text-white hover:bg-gray-800">Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-16 md:py-20">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-12">
              <div className="flex flex-col gap-6 w-full max-w-md">
                <Link href="/dashboard/booking">
                  <Button size="lg" className="w-full py-7 text-lg bg-gray-900 hover:bg-gray-800 text-white">
                    Book a Squash Session
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full py-6 text-gray-900 border-gray-200 hover:bg-gray-50"
                >
                  Download App
                </Button>
              </div>

              <div className="max-w-3xl space-y-6">
                <h2 className="text-sm uppercase tracking-widest text-gray-500">Our Vision</h2>
                <h1 className="text-3xl font-bold tracking-tight sm:text-3xl md:text-4xl text-gray-900">
                  To Energize 1% into sports with gameplay driving the Pulse of thriving and well-being.
                </h1>
              </div>

              <Card className="w-full max-w-4xl bg-gray-50 border border-gray-100 shadow-sm overflow-hidden">
                <CardContent className="p-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                    <div className="p-8 text-center">
                      <div className="text-5xl font-bold mb-2 text-gray-900 tabular-nums">833</div>
                      <p className="text-sm text-gray-500">People introduced so far</p>
                    </div>

                    <div className="p-8 text-center">
                      <div className="text-5xl font-bold mb-2 text-gray-900 tabular-nums">14,167</div>
                      <p className="text-sm text-gray-500">Remaining to reach 1% of Dublin</p>
                    </div>

                    <div className="p-8 text-center">
                      <div className="text-5xl font-bold mb-2 text-gray-900 tabular-nums">9.2B</div>
                      <p className="text-sm text-gray-500">Remaining to reach 1% of the world</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="community" className="w-full py-16 bg-gray-50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold text-gray-900">Join Our Community</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="flex flex-col items-center p-6">
                <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-900"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900">Connect</h3>
              </div>

              <div className="flex flex-col items-center p-6">
                <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-900"
                  >
                    <path d="M16 18l-8-8 8-8"></path>
                    <path d="M8 6l-8 8 8 8"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900">Find a Partner to Play With</h3>
              </div>

              <div className="flex flex-col items-center p-6">
                <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-6">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-900"
                  >
                    <path d="M12 2L20 7L12 12L4 7L12 2Z"></path>
                    <path d="M20 12L12 17L4 12"></path>
                    <path d="M20 17L12 22L4 17"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-900">Join the Ladder</h3>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="py-6 border-t border-gray-100">
        <div className="container text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Dublin Sports Mentor
        </div>
      </footer>
    </div>
  )
}

