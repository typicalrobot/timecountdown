import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ColorblindToggle } from "@/components/colorblind-toggle"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Countdown Timer",
  description: "Create and share countdown timers with Minecraft styling",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <div className="colorblind-toggle-container">
          <ColorblindToggle />
        </div>
      </body>
    </html>
  )
}
