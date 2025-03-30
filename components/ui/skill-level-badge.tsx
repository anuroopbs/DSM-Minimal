
import { Badge } from "@/components/ui/badge"
import { SkillLevel } from "@/lib/player-types"

interface SkillLevelBadgeProps {
  skillLevel: SkillLevel
}

export function SkillLevelBadge({ skillLevel }: SkillLevelBadgeProps) {
  const getVariant = () => {
    switch (skillLevel) {
      case "Beginner":
        return "secondary"
      case "Intermediate":
        return "default"
      case "Advanced":
        return "destructive"
      default:
        return "outline"
    }
  }

  return (
    <Badge variant={getVariant()}>
      {skillLevel}
    </Badge>
  )
}
