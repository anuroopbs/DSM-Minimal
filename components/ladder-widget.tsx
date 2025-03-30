import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Trophy, ChevronUp, ChevronDown, Minus, ExternalLink } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SkillLevelBadge, { type SkillLevel } from "@/components/skill-level-badge"

interface Player {
  id: string
  name: string
  avatar: string
  gender: "male" | "female"
  skillLevel: SkillLevel
  record: {
    wins: number
    losses: number
  }
  movement: "up" | "down" | "none"
  lastMatch: string
}

interface LadderWidgetProps {
  title?: string
  showHeader?: boolean
  limit?: number
  showChallengeButtons?: boolean
  showSkillLevel?: boolean
}

export function LadderWidget({
  title = "Ladder Rankings",
  showHeader = true,
  limit = 5,
  showChallengeButtons = false,
  showSkillLevel = true,
}: LadderWidgetProps) {
  // Sample data - in a real implementation, this would come from an API or database
  const malePlayers: Player[] = [
    {
      id: "1",
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      gender: "male",
      skillLevel: "premier",
      record: { wins: 24, losses: 3 },
      movement: "none",
      lastMatch: "2 days ago",
    },
    {
      id: "2",
      name: "David Kim",
      avatar: "/placeholder.svg?height=40&width=40",
      gender: "male",
      skillLevel: "division1",
      record: { wins: 22, losses: 5 },
      movement: "up",
      lastMatch: "Yesterday",
    },
    {
      id: "3",
      name: "James Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
      gender: "male",
      skillLevel: "division2",
      record: { wins: 19, losses: 7 },
      movement: "down",
      lastMatch: "3 days ago",
    },
    {
      id: "4",
      name: "Robert Taylor",
      avatar: "/placeholder.svg?height=40&width=40",
      gender: "male",
      skillLevel: "division3",
      record: { wins: 18, losses: 8 },
      movement: "up",
      lastMatch: "1 week ago",
    },
    {
      id: "5",
      name: "John Smith",
      avatar: "/placeholder.svg?height=40&width=40",
      gender: "male",
      skillLevel: "division4",
      record: { wins: 16, losses: 9 },
      movement: "none",
      lastMatch: "5 days ago",
    },
  ]

  const femalePlayers: Player[] = [
    {
      id: "6",
      name: "Emma Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      gender: "female",
      skillLevel: "premier",
      record: { wins: 21, losses: 4 },
      movement: "up",
      lastMatch: "Yesterday",
    },
    {
      id: "7",
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      gender: "female",
      skillLevel: "division1",
      record: { wins: 19, losses: 6 },
      movement: "none",
      lastMatch: "3 days ago",
    },
    {
      id: "8",
      name: "Maria Garcia",
      avatar: "/placeholder.svg?height=40&width=40",
      gender: "female",
      skillLevel: "division2",
      record: { wins: 17, losses: 7 },
      movement: "up",
      lastMatch: "4 days ago",
    },
    {
      id: "9",
      name: "Jennifer Lee",
      avatar: "/placeholder.svg?height=40&width=40",
      gender: "female",
      skillLevel: "division4",
      record: { wins: 15, losses: 8 },
      movement: "down",
      lastMatch: "1 week ago",
    },
    {
      id: "10",
      name: "Lisa Wong",
      avatar: "/placeholder.svg?height=40&width=40",
      gender: "female",
      skillLevel: "division5",
      record: { wins: 14, losses: 9 },
      movement: "none",
      lastMatch: "2 weeks ago",
    },
  ]

  // Limit the number of players shown
  const limitedMalePlayers = malePlayers.slice(0, limit)
  const limitedFemalePlayers = femalePlayers.slice(0, limit)

  return (
    <Card className="w-full">
      {showHeader && (
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
      )}
      <CardContent>
        <Tabs defaultValue="female">
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

import { LadderWidget as UI_LadderWidget } from "./ui/ladder-widget"
export { UI_LadderWidget }
export { LadderWidget }