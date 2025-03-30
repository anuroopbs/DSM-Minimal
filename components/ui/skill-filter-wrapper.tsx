
"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SkillLevel } from "@/lib/player-types"

interface SkillFilterWrapperProps {
  value: SkillLevel | "All"
  onChange: (value: SkillLevel | "All") => void
}

export function SkillFilterWrapper({ value, onChange }: SkillFilterWrapperProps) {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Filter by skill level" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="All">All Levels</SelectItem>
        <SelectItem value="Beginner">Beginner</SelectItem>
        <SelectItem value="Intermediate">Intermediate</SelectItem>
        <SelectItem value="Advanced">Advanced</SelectItem>
      </SelectContent>
    </Select>
  )
}
