"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { getCurrentUser, isBlogger } from "@/lib/auth"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthorized, setIsAuthorized] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const user = getCurrentUser()
    const authorized = isBlogger()

    if (!user || !authorized) {
      router.push("/login")
      return
    }

    setIsAuthorized(true)
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    )
  }

  if (!isAuthorized) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        <DashboardSidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-8">{children}</div>
        </main>
      </div>
    </div>
  )
}
