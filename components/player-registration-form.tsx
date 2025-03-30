"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import type { SkillLevel } from "@/components/skill-level-badge"

interface PlayerRegistrationFormProps {
  onSubmit: (data: PlayerFormData) => void
  isLoading?: boolean
}

export interface PlayerFormData {
  firstName: string
  lastName: string
  email: string
  gender: "male" | "female" | "other"
  skillLevel: SkillLevel
  club: string
  availability: string
  bio: string
  phone?: string
}

export default function PlayerRegistrationForm({ onSubmit, isLoading = false }: PlayerRegistrationFormProps) {
  const [formData, setFormData] = useState<PlayerFormData>({
    firstName: "",
    lastName: "",
    email: "",
    gender: "female", // Default to female
    skillLevel: "division3", // Default to Intermediate 2
    club: "",
    availability: "",
    bio: "",
    phone: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  // Skill level options with detailed descriptions
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Player Registration</CardTitle>
        <CardDescription>Join the squash ladder by providing your information below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="space-y-2">
            <Label>Gender</Label>
            <RadioGroup
              value={formData.gender}
              onValueChange={(value) => handleSelectChange("gender", value)}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="female" id="female" />
                <Label htmlFor="female">Female</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="male" id="male" />
                <Label htmlFor="male">Male</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="other" id="other" />
                <Label htmlFor="other">Other</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-4">
            <Label htmlFor="skillLevel">Division / Skill Level</Label>
            <p className="text-sm text-muted-foreground -mt-2">
              Please select the division that best matches your current skill level
            </p>

            <RadioGroup
              value={formData.skillLevel}
              onValueChange={(value) => handleSelectChange("skillLevel", value)}
              className="flex flex-col space-y-3"
            >
              {skillLevelOptions.map((option) => (
                <div key={option.value} className="flex items-start space-x-3 rounded-md border p-3">
                  <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={option.value} className="font-medium">
                        {option.label}
                      </Label>
                      <Badge variant={option.badgeVariant}>{option.badge}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{option.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label htmlFor="club">Home Club (Optional)</Label>
            <Input
              id="club"
              name="club"
              placeholder="Where do you usually play?"
              value={formData.club}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (Optional)</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+1 (555) 123-4567"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="availability">Availability</Label>
            <Input
              id="availability"
              name="availability"
              placeholder="e.g., Weekday evenings, Weekend mornings"
              value={formData.availability}
              onChange={handleChange}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">About You (Optional)</Label>
            <Textarea
              id="bio"
              name="bio"
              placeholder="Tell others about your squash experience"
              value={formData.bio}
              onChange={handleChange}
              className="resize-none"
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Submitting..." : "Register for Ladder"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex justify-center text-sm text-muted-foreground">
        By registering, you agree to the ladder rules and code of conduct
      </CardFooter>
    </Card>
  )
}

