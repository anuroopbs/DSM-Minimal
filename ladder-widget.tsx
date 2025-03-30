"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SkillLevelBadge } from "@/components/skill-level-badge"
import { ChevronUp, ChevronDown, Minus, Trophy, ExternalLink } from "lucide-react"

interface Player {
  id: string
  name: string
  avatar: string
  skillLevel: string
  record: {
    wins: number
    losses: number
  }
  movement: "up" | "down" | "none"
  gender?: string
}

interface LadderWidgetProps {
  players: Player[]
  showSkillLevel?: boolean
  showChallengeButtons?: boolean
  maxPlayers?: number
}

export function LadderWidget({
  players,
  showSkillLevel = true,
  showChallengeButtons = true,
  maxPlayers = 10
}: LadderWidgetProps) {
  const [activeTab, setActiveTab] = useState("female")
  
  // Filter players by gender
  const femalePlayers = players.filter(p => p.gender === "female" || !p.gender)
  const malePlayers = players.filter(p => p.gender === "male")
  
  // Limit the number of players shown
  const limitedFemalePlayers = femalePlayers.slice(0, maxPlayers)
  const limitedMalePlayers = malePlayers.slice(0, maxPlayers)

  return (
    <Card>
      <CardContent className="p-4">
        <Tabs defaultValue="female" className="w-full" onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="female">Women's Ladder</TabsTrigger>
            <TabsTrigger value="male">Men's Ladder</TabsTrigger>
          </TabsList>
          <TabsContent value="female" className="space-y-3">
            {limitedFemalePlayers.map((player, index) => (
              <div
                key={player.id}
                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent/50"
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-muted font-bold text-sm">
                    {index + 1}
                    {index < 3 && (
                      <div className="absolute -top-1 -right-1">
                        <Trophy className="h-3 w-3 text-yellow-500" />
                      </div>
                    )}
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={player.avatar} alt={player.name} />
                    <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-sm">{player.name}</span>
                      {showSkillLevel && <SkillLevelBadge skillLevel={player.skillLevel} small />}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {player.record.wins}-{player.record.losses}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {player.movement === "up" && <ChevronUp className="h-4 w-4 text-green-500" />}
                    {player.movement === "down" && <ChevronDown className="h-4 w-4 text-red-500" />}
                    {player.movement === "none" && <Minus className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  {showChallengeButtons && (
                    <Button size="sm" variant="outline" className="h-7 text-xs">
                      Challenge
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="male" className="space-y-3">
            {limitedMalePlayers.map((player, index) => (
              <div
                key={player.id}
                className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent/50"
              >
                <div className="flex items-center gap-3">
                  <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-muted font-bold text-sm">
                    {index + 1}
                    {index < 3 && (
                      <div className="absolute -top-1 -right-1">
                        <Trophy className="h-3 w-3 text-yellow-500" />
                      </div>
                    )}
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={player.avatar} alt={player.name} />
                    <AvatarFallback>{player.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-sm">{player.name}</span>
                      {showSkillLevel && <SkillLevelBadge skillLevel={player.skillLevel} small />}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {player.record.wins}-{player.record.losses}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center">
                    {player.movement === "up" && <ChevronUp className="h-4 w-4 text-green-500" />}
                    {player.movement === "down" && <ChevronDown className="h-4 w-4 text-red-500" />}
                    {player.movement === "none" && <Minus className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  {showChallengeButtons && (
                    <Button size="sm" variant="outline" className="h-7 text-xs">
                      Challenge
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
        <div className="mt-4 text-center">
          <Button variant="link" size="sm" className="gap-1">
            <span>View Full Ladder</span>
            <ExternalLink className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default LadderWidget;
