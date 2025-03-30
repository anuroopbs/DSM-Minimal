"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

interface PlayerRegistrationFormProps {
  onRegister: () => void
  isRegistering: boolean
}

export function PlayerRegistrationForm({ onRegister, isRegistering }: PlayerRegistrationFormProps) {
  const [skillLevel, setSkillLevel] = useState("intermediate")
  
  return (
    <div className="space-y-4">
      <p>
        Our ladder ranking system allows you to challenge other players and track your progress. Register now
        to start competing and improving your skills.
      </p>
      <div className="space-y-2">
        <label className="text-sm font-medium">Your Skill Level</label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <Button
            type="button"
            variant={skillLevel === "beginner" ? "default" : "outline"}
            onClick={() => setSkillLevel("beginner")}
            className="justify-start"
          >
            Beginner
          </Button>
          <Button
            type="button"
            variant={skillLevel === "intermediate" ? "default" : "outline"}
            onClick={() => setSkillLevel("intermediate")}
            className="justify-start"
          >
            Intermediate
          </Button>
          <Button
            type="button"
            variant={skillLevel === "advanced" ? "default" : "outline"}
            onClick={() => setSkillLevel("advanced")}
            className="justify-start"
          >
            Advanced
          </Button>
          <Button
            type="button"
            variant={skillLevel === "elite" ? "default" : "outline"}
            onClick={() => setSkillLevel("elite")}
            className="justify-start"
          >
            Elite
          </Button>
        </div>
      </div>
      <Button onClick={onRegister} disabled={isRegistering} className="w-full">
        {isRegistering ? "Registering..." : "Register for Ladder"}
      </Button>
    </div>
  )
}

export default PlayerRegistrationForm;
