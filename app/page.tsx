"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function CreateCountdown() {
  const router = useRouter()
  const [title, setTitle] = useState<string>("Countdown")
  const [days, setDays] = useState<number>(0)
  const [hours, setHours] = useState<number>(0)
  const [minutes, setMinutes] = useState<number>(0)
  const [seconds, setSeconds] = useState<number>(0)

  const handleCreateCountdown = async () => {
    // Calculate target date based on the duration
    const now = new Date()
    const targetDate = new Date(now)
    targetDate.setDate(now.getDate() + days)
    targetDate.setHours(now.getHours() + hours)
    targetDate.setMinutes(now.getMinutes() + minutes)
    targetDate.setSeconds(now.getSeconds() + seconds)

    // Create a unique ID based on timestamp
    const countdownId = Date.now().toString(36)

    // Store countdown data in localStorage
    const countdownData = {
      id: countdownId,
      title,
      targetDate: targetDate.toISOString(),
      createdAt: new Date().toISOString(),
    }

    // Save to localStorage
    const existingCountdowns = JSON.parse(localStorage.getItem("countdowns") || "[]")
    localStorage.setItem("countdowns", JSON.stringify([...existingCountdowns, countdownData]))

    // Create URL-safe data for sharing
    const urlParams = new URLSearchParams()
    urlParams.set("title", title)
    urlParams.set("target", targetDate.toISOString())

    // Redirect to the countdown page with data in URL
    router.push(`/countdown/${countdownId}?${urlParams.toString()}`)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gold-light p-4">
      <Card className="w-full max-w-md border-2 border-maroon bg-white shadow-lg">
        <CardHeader className="border-b border-gold">
          <CardTitle className="text-center minecraft-font text-maroon">Countdown</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            {/* Duration Inputs */}
            <div className="grid grid-cols-4 gap-2">
              <div className="space-y-2">
                <Label htmlFor="days" className="minecraft-font text-maroon">
                  Days
                </Label>
                <Input
                  id="days"
                  type="number"
                  min="0"
                  value={days}
                  onChange={(e) => setDays(Number.parseInt(e.target.value) || 0)}
                  className="border-gold focus-visible:ring-gold"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hours" className="minecraft-font text-maroon">
                  Hours
                </Label>
                <Input
                  id="hours"
                  type="number"
                  min="0"
                  max="23"
                  value={hours}
                  onChange={(e) => setHours(Number.parseInt(e.target.value) || 0)}
                  className="border-gold focus-visible:ring-gold"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="minutes" className="minecraft-font text-maroon">
                  Minutes
                </Label>
                <Input
                  id="minutes"
                  type="number"
                  min="0"
                  max="59"
                  value={minutes}
                  onChange={(e) => setMinutes(Number.parseInt(e.target.value) || 0)}
                  className="border-gold focus-visible:ring-gold"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="seconds" className="minecraft-font text-maroon">
                  Seconds
                </Label>
                <Input
                  id="seconds"
                  type="number"
                  min="0"
                  max="59"
                  value={seconds}
                  onChange={(e) => setSeconds(Number.parseInt(e.target.value) || 0)}
                  className="border-gold focus-visible:ring-gold"
                />
              </div>
            </div>

            {/* Create Button */}
            <Button
              onClick={handleCreateCountdown}
              className="w-full minecraft-font bg-maroon hover:bg-maroon-light text-white"
              disabled={days === 0 && hours === 0 && minutes === 0 && seconds === 0}
            >
              Create Countdown
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <Button variant="link" onClick={() => router.push("/my-countdowns")} className="minecraft-font text-maroon">
          View My Countdowns
        </Button>
      </div>
    </div>
  )
}
