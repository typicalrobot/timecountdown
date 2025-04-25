"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

export function ColorblindToggle() {
  const [isColorblind, setIsColorblind] = useState(false)

  // Initialize from localStorage on mount
  useEffect(() => {
    const savedMode = localStorage.getItem("colorblindMode")
    if (savedMode === "true") {
      setIsColorblind(true)
      document.body.classList.add("colorblind")
    }
  }, [])

  const toggleColorblindMode = () => {
    const newMode = !isColorblind
    setIsColorblind(newMode)

    if (newMode) {
      document.body.classList.add("colorblind")
    } else {
      document.body.classList.remove("colorblind")
    }

    localStorage.setItem("colorblindMode", newMode.toString())
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleColorblindMode}
      className="colorblind-toggle minecraft-font border-2 border-gold bg-maroon text-white hover:bg-maroon-light"
      title="Toggle colorblind mode"
      aria-label="Toggle colorblind mode"
    >
      <Eye className="h-4 w-4 mr-2" />
      {isColorblind ? "Standard Mode" : "Colorblind Mode"}
    </Button>
  )
}
