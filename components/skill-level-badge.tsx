import { Badge } from "@/components/ui/badge"

// Define skill level type
export type SkillLevel =
  | "premier" // Professional-level players
  | "division1" // Advanced 2
  | "division2" // Advanced 1
  | "division3" // Intermediate 2
  | "division4" // Intermediate 1
  | "division5" // Beginner 2
  | "division6" // Beginner 1

interface SkillLevelBadgeProps {
  skillLevel: SkillLevel
  small?: boolean
  showLabel?: boolean
}

export default function SkillLevelBadge({ skillLevel, small = false, showLabel = false }: SkillLevelBadgeProps) {
  let badgeVariant: "outline" | "secondary" | "default" | "destructive"
  let displayText: string
  let label: string

  switch (skillLevel) {
    case "premier":
      badgeVariant = "destructive"
      displayText = small ? "P" : "Premier"
      label = "Professional"
      break
    case "division1":
      badgeVariant = "destructive"
      displayText = small ? "D1" : "Division 1"
      label = "Advanced 2"
      break
    case "division2":
      badgeVariant = "default"
      displayText = small ? "D2" : "Division 2"
      label = "Advanced 1"
      break
    case "division3":
      badgeVariant = "default"
      displayText = small ? "D3" : "Division 3"
      label = "Intermediate 2"
      break
    case "division4":
      badgeVariant = "secondary"
      displayText = small ? "D4" : "Division 4"
      label = "Intermediate 1"
      break
    case "division5":
      badgeVariant = "secondary"
      displayText = small ? "D5" : "Division 5"
      label = "Beginner 2"
      break
    case "division6":
      badgeVariant = "outline"
      displayText = small ? "D6" : "Division 6"
      label = "Beginner 1"
      break
  }

  const className = small ? "text-[10px] px-1 py-0" : "text-xs"

  return (
    <div className="flex items-center gap-1">
      <Badge variant={badgeVariant} className={className}>
        {displayText}
      </Badge>
      {showLabel && <span className="text-xs text-muted-foreground">{label}</span>}
    </div>
  )
}

