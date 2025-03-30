"use client"

import { useState } from "react"
import SkillFilter from "./skill-filter"
import type { SkillLevel } from "./skill-level-badge"

export default function SkillFilterWrapper() {
  const [skillLevel, setSkillLevel] = useState<SkillLevel | null>(null)

  const handleFilterChange = (level: SkillLevel | null) => {
    setSkillLevel(level)
    console.log("Filter by skill level:", level)
    // In a real implementation, you would filter the players array
  }

  return <SkillFilter onFilterChange={handleFilterChange} />
}

