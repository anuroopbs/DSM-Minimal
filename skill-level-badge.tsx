"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

interface SkillLevelBadgeProps {
  skillLevel: string
  small?: boolean
}

export function SkillLevelBadge({ skillLevel, small = false }: SkillLevelBadgeProps) {
  const getSkillLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return "bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-800/20 dark:text-green-400"
      case "intermediate":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100/80 dark:bg-blue-800/20 dark:text-blue-400"
      case "advanced":
        return "bg-purple-100 text-purple-800 hover:bg-purple-100/80 dark:bg-purple-800/20 dark:text-purple-400"
      case "elite":
        return "bg-red-100 text-red-800 hover:bg-red-100/80 dark:bg-red-800/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80 dark:bg-gray-800/20 dark:text-gray-400"
    }
  }

  const getSkillLevelLabel = (level: string) => {
    switch (level.toLowerCase()) {
      case "beginner":
        return "Beginner"
      case "intermediate":
        return "Intermediate"
      case "advanced":
        return "Advanced"
      case "elite":
        return "Elite"
      default:
        return level
    }
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        getSkillLevelColor(skillLevel),
        "border-transparent",
        small ? "text-xs px-1.5 py-0" : "text-xs"
      )}
    >
      {getSkillLevelLabel(skillLevel)}
    </Badge>
  )
}

export default SkillLevelBadge;
