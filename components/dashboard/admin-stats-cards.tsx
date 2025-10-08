"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Activity, Clock, TrendingUp } from "lucide-react"
import { useState, useEffect } from "react"
import { fetchAllUserActivities } from "@/lib/user-activity"

interface StatsData {
  totalUsers: number
  totalActivities: number
  avgActivitiesPerUser: number
  totalTimeSpent: number
}

export function AdminStatsCards() {
  const [stats, setStats] = useState<StatsData>({
    totalUsers: 0,
    totalActivities: 0,
    avgActivitiesPerUser: 0,
    totalTimeSpent: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true)
        const response = await fetchAllUserActivities()
        
        if (response.success && response.activities) {
          const uniqueUsers = new Set(response.activities.map(a => a.userUuid))
          const totalActivities = response.activities.length
          
          // Calculate total time spent
          let totalTime = 0
          response.activities
            .filter(a => a.eventType === 'TIME_SPENT')
            .forEach(activity => {
              try {
                const details = JSON.parse(activity.details)
                const timeMatch = details.data?.match(/time:\s*(\d+)/)
                if (timeMatch) {
                  totalTime += parseInt(timeMatch[1])
                }
              } catch (e) {
                // Skip invalid JSON
              }
            })

          setStats({
            totalUsers: uniqueUsers.size,
            totalActivities,
            avgActivitiesPerUser: uniqueUsers.size > 0 ? Math.round(totalActivities / uniqueUsers.size) : 0,
            totalTimeSpent: totalTime,
          })
        }
      } catch (error) {
        console.error("Error loading stats:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const cards = [
    {
      title: "Total Users",
      value: loading ? "..." : stats.totalUsers.toLocaleString(),
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Total Activities",
      value: loading ? "..." : stats.totalActivities.toLocaleString(),
      icon: Activity,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Avg Activities/User",
      value: loading ? "..." : stats.avgActivitiesPerUser.toLocaleString(),
      icon: TrendingUp,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Total Time Spent",
      value: loading ? "..." : formatTime(stats.totalTimeSpent),
      icon: Clock,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {card.title}
            </CardTitle>
            <div className={`p-2 rounded-lg ${card.bgColor}`}>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
