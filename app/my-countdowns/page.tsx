"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2 } from "lucide-react"
import Link from "next/link"

interface CountdownData {
  id: string
  title: string
  targetDate: string
  createdAt: string
}

export default function MyCountdowns() {
  const [countdowns, setCountdowns] = useState<CountdownData[]>([])

  useEffect(() => {
    // Load countdowns from localStorage
    const savedCountdowns = JSON.parse(localStorage.getItem("countdowns") || "[]")
    setCountdowns(savedCountdowns)
  }, [])

  const handleDelete = (id: string) => {
    const updatedCountdowns = countdowns.filter((countdown) => countdown.id !== id)
    setCountdowns(updatedCountdowns)
    localStorage.setItem("countdowns", JSON.stringify(updatedCountdowns))
  }

  const calculateTimeRemaining = (targetDate: string) => {
    const target = new Date(targetDate)
    const now = new Date()
    const difference = target.getTime() - now.getTime()

    if (difference <= 0) {
      return "Expired"
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24))
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))

    return `${days}d ${hours}h ${minutes}m remaining`
  }

  // Function to generate URL with parameters for sharing
  const getShareableUrl = (countdown: CountdownData) => {
    const urlParams = new URLSearchParams()
    urlParams.set("title", countdown.title)
    urlParams.set("target", countdown.targetDate)
    return `/countdown/${countdown.id}?${urlParams.toString()}`
  }

  return (
    <div className="min-h-screen bg-gold-light p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl minecraft-font text-maroon">My Countdowns</h1>
          <Link href="/">
            <Button className="minecraft-font bg-maroon hover:bg-maroon-light text-white">Create New</Button>
          </Link>
        </div>

        {countdowns.length === 0 ? (
          <Card className="border-maroon">
            <CardContent className="pt-6">
              <p className="text-center minecraft-font py-8 text-maroon">
                You haven&apos;t created any countdowns yet.
              </p>
              <div className="text-center">
                <Link href="/">
                  <Button className="minecraft-font bg-maroon hover:bg-maroon-light text-white">
                    Create Your First Countdown
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {countdowns.map((countdown) => (
              <Card key={countdown.id} className="border-2 border-maroon">
                <CardHeader className="pb-2">
                  <CardTitle className="minecraft-font text-lg text-maroon">Countdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-maroon mb-4">{calculateTimeRemaining(countdown.targetDate)}</p>
                  <div className="flex justify-between">
                    <Link href={getShareableUrl(countdown)}>
                      <Button
                        variant="outline"
                        className="minecraft-font text-xs border-gold text-maroon hover:bg-gold-light"
                      >
                        View Countdown
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50 border-red-200"
                      onClick={() => handleDelete(countdown.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
