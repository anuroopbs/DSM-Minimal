"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export default function BookingPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedCoach, setSelectedCoach] = useState<string | undefined>()
  const [selectedTime, setSelectedTime] = useState<string | undefined>()
  const [isBooking, setIsBooking] = useState(false)
  const [isBooked, setIsBooked] = useState(false)

  const coaches = [
    { id: "1", name: "Coach Smith", specialty: "Technique", availability: ["9:00 AM", "11:00 AM", "2:00 PM"] },
    { id: "2", name: "Coach Johnson", specialty: "Strategy", availability: ["10:00 AM", "1:00 PM", "4:00 PM"] },
    { id: "3", name: "Coach Williams", specialty: "Fitness", availability: ["8:00 AM", "12:00 PM", "3:00 PM"] },
  ]

  const handleBookSession = () => {
    if (!selectedCoach || !selectedTime || !date) return

    setIsBooking(true)
    // Simulate booking process
    setTimeout(() => {
      setIsBooking(false)
      setIsBooked(true)
    }, 1500)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 bg-background border-b">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">Squash Coach</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            <Link href="/dashboard" className="text-sm font-medium hover:underline underline-offset-4">
              Dashboard
            </Link>
            <Link href="/dashboard/booking" className="text-sm font-medium hover:underline underline-offset-4">
              Book Session
            </Link>
            <Link href="/dashboard/ladder" className="text-sm font-medium hover:underline underline-offset-4">
              Ladder
            </Link>
            <Link href="/dashboard/profile" className="text-sm font-medium hover:underline underline-offset-4">
              Profile
            </Link>
          </nav>
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            Log out
          </Button>
        </div>
      </header>
      <main className="flex-1 container px-4 md:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Book a Coaching Session</h1>
          <p className="text-muted-foreground">Select a coach, date, and time for your next session</p>
        </div>

        {isBooked ? (
          <Card>
            <CardHeader>
              <CardTitle className="text-center text-green-600">Booking Confirmed!</CardTitle>
              <CardDescription className="text-center">
                Your coaching session has been booked successfully
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center justify-center space-y-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-green-600"
                >
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                <div className="text-center">
                  <p className="font-medium">
                    You've booked a session with {coaches.find((c) => c.id === selectedCoach)?.name}
                  </p>
                  <p className="text-muted-foreground">
                    {date?.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })} at{" "}
                    {selectedTime}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center gap-4">
              <Button onClick={() => setIsBooked(false)}>Book Another Session</Button>
              <Button variant="outline" asChild>
                <Link href="/dashboard">Return to Dashboard</Link>
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Select a Coach</CardTitle>
                <CardDescription>Choose from our professional coaches</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {coaches.map((coach) => (
                  <div
                    key={coach.id}
                    className={`flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                      selectedCoach === coach.id ? "border-primary bg-primary/5" : "hover:bg-muted"
                    }`}
                    onClick={() => setSelectedCoach(coach.id)}
                  >
                    <div className="flex-1">
                      <h4 className="font-medium">{coach.name}</h4>
                      <p className="text-sm text-muted-foreground">Specializes in {coach.specialty}</p>
                    </div>
                    {selectedCoach === coach.id && (
                      <Badge variant="outline" className="ml-auto">
                        Selected
                      </Badge>
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Select a Date</CardTitle>
                  <CardDescription>Choose your preferred date</CardDescription>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-md border"
                    disabled={(date) => {
                      // Disable dates in the past
                      const today = new Date()
                      today.setHours(0, 0, 0, 0)
                      return date < today
                    }}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Select a Time</CardTitle>
                  <CardDescription>Choose your preferred time slot</CardDescription>
                </CardHeader>
                <CardContent>
                  <Select disabled={!selectedCoach} value={selectedTime} onValueChange={setSelectedTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a time" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedCoach ? (
                        coaches
                          .find((c) => c.id === selectedCoach)
                          ?.availability.map((time) => (
                            <SelectItem key={time} value={time}>
                              {time}
                            </SelectItem>
                          ))
                      ) : (
                        <SelectItem value="placeholder" disabled>
                          Select a coach first
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    disabled={!selectedCoach || !selectedTime || !date || isBooking}
                    onClick={handleBookSession}
                  >
                    {isBooking ? "Booking..." : "Book Session"}
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        )}
      </main>
      <footer className="border-t bg-muted">
        <div className="container py-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Squash Coach. All rights reserved.
        </div>
      </footer>
    </div>
  )
}

