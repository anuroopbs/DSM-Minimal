
"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SkillLevelBadge } from "@/components/ui/skill-level-badge"
import { Button } from "@/components/ui/button"
import { PlayerRanking } from "@/lib/player-types"

interface LadderWidgetProps {
  players: PlayerRanking[]
  onChallenge?: (playerId: string) => void
}

export function LadderWidget({ players, onChallenge }: LadderWidgetProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Current Ladder Rankings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {players.map((player, index) => (
            <div key={player.id} className="flex items-center justify-between p-2 bg-secondary/20 rounded-lg">
              <div className="flex items-center gap-4">
                <span className="text-lg font-bold">{index + 1}</span>
                <div>
                  <p className="font-medium">{player.name}</p>
                  <SkillLevelBadge skillLevel={player.skillLevel} />
                </div>
              </div>
              {onChallenge && player.challengeEligible && (
                <Button variant="outline" size="sm" onClick={() => onChallenge(player.id)}>
                  Challenge
                </Button>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
