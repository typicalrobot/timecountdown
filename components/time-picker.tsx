"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Clock } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface TimePickerProps {
  value: string
  onChange: (value: string) => void
}

export function TimePicker({ value, onChange }: TimePickerProps) {
  // Parse the initial time value
  const parseTimeValue = () => {
    const [hoursStr, minutesStr] = value.split(":")
    let hours = Number.parseInt(hoursStr, 10)
    const minutes = Number.parseInt(minutesStr, 10)

    // Convert 24h format to 12h format
    const period: "AM" | "PM" = hours >= 12 ? "PM" : "AM"
    if (hours > 12) hours -= 12
    else if (hours === 0) hours = 12

    return {
      hours: hours.toString(),
      minutes: minutes.toString().padStart(2, "0"),
      period,
    }
  }

  // Get the display values from the current time value
  const { hours: displayHours, minutes: displayMinutes, period: displayPeriod } = parseTimeValue()

  // Local state for the popover inputs only
  const [inputHours, setInputHours] = useState(displayHours)
  const [inputMinutes, setInputMinutes] = useState(displayMinutes)
  const [inputPeriod, setInputPeriod] = useState<"AM" | "PM">(displayPeriod)

  // Update the time when the popover closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Convert back to 24h format and update parent
      updateTimeValue(inputHours, inputMinutes, inputPeriod)
    } else {
      // When opening, reset the inputs to the current value
      setInputHours(displayHours)
      setInputMinutes(displayMinutes)
      setInputPeriod(displayPeriod)
    }
  }

  // Convert to 24h format and call onChange
  const updateTimeValue = (h: string, m: string, p: "AM" | "PM") => {
    let hours = Number.parseInt(h, 10)
    if (isNaN(hours)) hours = 12
    if (hours > 12) hours = 12
    if (hours < 1) hours = 1

    let minutes = Number.parseInt(m, 10)
    if (isNaN(minutes)) minutes = 0
    if (minutes > 59) minutes = 59

    // Convert to 24h format
    if (p === "PM" && hours < 12) hours += 12
    else if (p === "AM" && hours === 12) hours = 0

    const newValue = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
    if (newValue !== value) {
      onChange(newValue)
    }
  }

  const handleHoursChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    setInputHours(value)
  }

  const handleMinutesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    setInputMinutes(value)
  }

  const togglePeriod = () => {
    setInputPeriod((prev) => (prev === "AM" ? "PM" : "AM"))
  }

  return (
    <Popover onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button variant={"outline"} className={cn("w-full justify-start text-left font-normal")}>
          <Clock className="mr-2 h-4 w-4" />
          {displayHours}:{displayMinutes} {displayPeriod}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        <div className="flex gap-2 items-center">
          <Input className="w-12 text-center" value={inputHours} onChange={handleHoursChange} maxLength={2} />
          <span>:</span>
          <Input className="w-12 text-center" value={inputMinutes} onChange={handleMinutesChange} maxLength={2} />
          <Button variant="outline" className="w-16" onClick={togglePeriod}>
            {inputPeriod}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}
