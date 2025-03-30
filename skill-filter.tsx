"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"

export type SkillLevel = string;

interface SkillFilterProps {
  onFilterChange?: (skillLevel: SkillLevel | null) => void
}

export function SkillFilter({ onFilterChange = () => {} }: SkillFilterProps) {
  const [open, setOpen] = useState(false)
  const [selectedSkill, setSelectedSkill] = useState<SkillLevel | null>(null)
  
  const skillLevelOptions = [
    {
      value: "premier",
      label: "Premier",
      description: "Professional-level players with elite skill, fitness, and tactical mastery",
      badge: "Professional",
      badgeVariant: "destructive" as const,
    },
    {
      value: "division1",
      label: "Division 1",
      description: "Top national players with strong tournament results and advanced gameplay",
      badge: "Advanced 2",
      badgeVariant: "destructive" as const,
    },
    {
      value: "division2",
      label: "Division 2",
      description: "High-level club and top regional players with consistent wins and control",
      badge: "Advanced 1",
      badgeVariant: "default" as const,
    },
    {
      value: "division3",
      label: "Division 3",
      description: "Competitive intermediates with solid match performance and improving strategy",
      badge: "Intermediate 2",
      badgeVariant: "default" as const,
    },
    {
      value: "division4",
      label: "Division 4",
      description: "Players developing match tactics, movement, and shot variety",
      badge: "Intermediate 1",
      badgeVariant: "secondary" as const,
    },
    {
      value: "division5",
      label: "Division 5",
      description: "Newer players (4–12 months) building technique, consistency, and confidence in games",
      badge: "Beginner 2",
      badgeVariant: "secondary" as const,
    },
    {
      value: "division6",
      label: "Division 6",
      description: "Brand new to squash (0–3 months); learning rules, strokes, and basic movement",
      badge: "Beginner 1",
      badgeVariant: "outline" as const,
    },
  ]
  
  const handleSelect = (value: string) => {
    const skill = value as SkillLevel
    setSelectedSkill(skill)
    onFilterChange(skill)
    setOpen(false)
  }
  
  const handleClear = () => {
    setSelectedSkill(null)
    onFilterChange(null)
  }
  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-9">
          <Filter className="h-4 w-4 mr-2" />
          {selectedSkill ? (
            <>
              Filter:
              <Badge
                variant={skillLevelOptions.find((opt) => opt.value === selectedSkill)?.badgeVariant || "default"}
                className="ml-2"
              >
                {skillLevelOptions.find((opt) => opt.value === selectedSkill)?.label}
              </Badge>
            </>
          ) : (
            "Filter by Skill"
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Command>
          <CommandInput placeholder="Search division..." />
          <CommandList>
            <CommandEmpty>No division found.</CommandEmpty>
            <CommandGroup>
              {skillLevelOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={handleSelect}
                  className="flex flex-col items-start py-3"
                >
                  <div className="flex items-center gap-2">
                    <Badge variant={option.badgeVariant}>{option.label}</Badge>
                    <span className="font-medium">{option.badge}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{option.description}</p>
                </CommandItem>
              ))}
            </CommandGroup>
            {selectedSkill && (
              <div className="border-t p-2">
                <Button variant="ghost" size="sm" className="w-full" onClick={handleClear}>
                  Clear Filter
                </Button>
              </div>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default SkillFilter;
