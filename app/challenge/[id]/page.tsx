
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SkillLevelBadge } from "@/components/skill-level-badge"
import { BackButton } from "@/components/back-button"

export default function ChallengePage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [player, setPlayer] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [message, setMessage] = useState("")

  // Mock data for demonstration
  const mockPlayer = {
    id: params.id,
    name: params.id === "1" ? "John Smith" : "Sarah Johnson",
    avatar: "",
    skillLevel: params.id === "1" ? "intermediate" : "advanced",
    record: { wins: params.id === "1" ? 8 : 12, losses: params.id === "1" ? 2 : 3 },
    movement: params.id === "1" ? "up" : "none",
    gender: params.id === "1" ? "male" : "female"
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setPlayer(mockPlayer)
      setLoading(false)
    }, 1000)
    
    return () => clearTimeout(timer)
  }, [params.id])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    
    setTimeout(() => {
      setSubmitting(false)
      router.push("/dashboard/ladder?challenge=success")
    }, 1500)
  }

  if (loading) {
    return (
      <div className="container py-8">
        <BackButton href="/dashboard/ladder" />
        <div className="flex justify-center items-center h-64">
          <p>Loading player details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <BackButton href="/dashboard/ladder" />
      
      <div className="max-w-2xl mx-auto mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Challenge Player</CardTitle>
            <CardDescription>Send a challenge request to this player</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-6 p-4 bg-muted rounded-lg">
              <Avatar className="h-16 w-16">
                <AvatarImage src={player.avatar} alt={player.name} />
                <AvatarFallback className="text-lg">{player.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-medium">{player.name}</h3>
                  <SkillLevelBadge skillLevel={player.skillLevel} />
                </div>
                <p className="text-sm text-muted-foreground">
                  Record: {player.record.wins}-{player.record.losses}
                </p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Proposed Dates</label>
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3].map((day) => (
                    <Button
                      key={day}
                      type="button"
                      variant={selectedDate === new Date(2025, 2, day + 15) ? "default" : "outline"}
                      onClick={() => setSelectedDate(new Date(2025, 2, day + 15))}
                      className="justify-start h-auto py-2"
                    >
                      <div className="text-left">
                        <div className="font-medium">{new Date(2025, 2, day + 15).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                        <div className="text-xs">{new Date(2025, 2, day + 15).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Proposed Times</label>
                <div className="grid grid-cols-3 gap-2">
                  {["18:00", "19:00", "20:00"].map((time) => (
                    <Button
                      key={time}
                      type="button"
                      variant={selectedTime === time ? "default" : "outline"}
                      onClick={() => setSelectedTime(time)}
                      className="justify-center"
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">Message (Optional)</label>
                <textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Add a message to your challenge request..."
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={!selectedDate || !selectedTime || submitting}>
                {submitting ? "Sending Challenge..." : "Send Challenge Request"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
