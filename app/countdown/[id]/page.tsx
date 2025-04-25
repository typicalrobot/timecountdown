"use client"

import { useEffect, useState } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Share2 } from "lucide-react"
import Link from "next/link"

interface CountdownData {
  id: string
  title: string
  targetDate: string
  createdAt?: string
}

export default function CountdownPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const countdownId = params.id as string

  const [countdown, setCountdown] = useState<CountdownData | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number
    hours: number
    minutes: number
    seconds: number
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isExpired, setIsExpired] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Extract countdown data from URL or localStorage only once on mount
  useEffect(() => {
    // Prevent multiple executions
    if (isLoaded) return

    // Get data from URL parameters
    const title = searchParams.get("title")
    const targetDate = searchParams.get("target")

    if (title && targetDate) {
      // If URL has the data, use it
      setCountdown({
        id: countdownId,
        title,
        targetDate,
      })
      setIsLoaded(true)
    } else {
      // Otherwise, try to load from localStorage as fallback
      try {
        const countdowns = JSON.parse(localStorage.getItem("countdowns") || "[]")
        const foundCountdown = countdowns.find((c: CountdownData) => c.id === countdownId)

        if (foundCountdown) {
          setCountdown(foundCountdown)
        }
        setIsLoaded(true)
      } catch (error) {
        console.error("Error loading countdown data:", error)
        setIsLoaded(true)
      }
    }
  }, [countdownId, searchParams, isLoaded])

  // Setup timer effect
  useEffect(() => {
    if (!countdown) return

    const targetDate = new Date(countdown.targetDate)
    let intervalId: NodeJS.Timeout

    const calculateTimeRemaining = () => {
      const now = new Date()
      const difference = targetDate.getTime() - now.getTime()

      if (difference <= 0) {
        setIsExpired(true)
        setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        clearInterval(intervalId)
        return
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24))
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((difference % (1000 * 60)) / 1000)

      setTimeRemaining({ days, hours, minutes, seconds })
    }

    // Calculate immediately
    calculateTimeRemaining()

    // Then set up interval
    intervalId = setInterval(calculateTimeRemaining, 1000)

    // Cleanup
    return () => {
      clearInterval(intervalId)
    }
  }, [countdown])

  const handleShare = async () => {
    try {
      // Get current URL with all parameters
      const shareUrl = window.location.href

      // Check if Web Share API is supported AND available
      if (navigator.share && typeof navigator.share === "function") {
        try {
          await navigator.share({
            title: countdown?.title || "Countdown",
            url: shareUrl,
          })
          // Success message could be added here
        } catch (error) {
          // If share fails (user cancels or API rejects), fall back to clipboard
          await navigator.clipboard.writeText(shareUrl)
          alert("Link copied to clipboard!")
        }
      } else {
        // Fallback for browsers without Web Share API
        await navigator.clipboard.writeText(shareUrl)
        alert("Link copied to clipboard!")
      }
    } catch (error) {
      // Final fallback if even clipboard fails
      console.error("Sharing failed:", error)
      alert("Please copy this URL manually: " + window.location.href)
    }
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gold-light">
        <p className="minecraft-font text-maroon">Loading...</p>
      </div>
    )
  }

  if (!countdown) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gold-light">
        <Card className="w-full max-w-md border-maroon">
          <CardContent className="pt-6">
            <p className="text-center minecraft-font text-maroon">Countdown not found</p>
            <div className="mt-4 text-center">
              <Link href="/">
                <Button className="minecraft-font bg-maroon hover:bg-maroon-light text-white">
                  Create a new countdown
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gold-light p-4">
      <Card className="w-full max-w-md border-2 border-maroon bg-white shadow-lg">
        <CardContent className="pt-6">
          <div className="space-y-8">
            {/* Title */}
            <h1 className="text-3xl text-center minecraft-font text-maroon">Countdown</h1>

            {/* Countdown Display */}
            {isExpired ? (
              <div className="text-center minecraft-font text-4xl text-maroon">It&apos;s time!</div>
            ) : (
              <div className="text-center">
                <p className="minecraft-font text-2xl md:text-3xl text-maroon">
                  {timeRemaining.days} days, {timeRemaining.hours} hours, {timeRemaining.minutes} minutes,{" "}
                  {timeRemaining.seconds} seconds
                </p>
              </div>
            )}

            {/* Share Button */}
            <Button
              onClick={handleShare}
              className="w-full minecraft-font flex items-center justify-center gap-2 bg-maroon hover:bg-maroon-light text-white"
            >
              <Share2 className="h-4 w-4" />
              Share This Countdown
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="absolute bottom-4 right-4 text-center">
        <Link href="/" className="minecraft-font text-sm text-maroon hover:text-maroon-light">
          Create your own countdown
        </Link>
      </div>
    </div>
  )
}
