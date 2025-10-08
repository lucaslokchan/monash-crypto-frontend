"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useState, useEffect } from "react"
import { fetchAllUserActivities, UserActivityData } from "@/lib/user-activity"

interface DailyActivityData {
  date: string
  PAGE_VIEW: number
  LIKE: number
  COMMENT: number
  SHARE: number
  TIME_SPENT: number
}

const activityColors = {
  PAGE_VIEW: "#8b5cf6",
  LIKE: "#ef4444",
  COMMENT: "#22c55e",
  SHARE: "#3b82f6",
  TIME_SPENT: "#f59e0b",
}

export function AdminActivityBarChart() {
  const [chartData, setChartData] = useState<DailyActivityData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadActivityData = async () => {
      try {
        setLoading(true)
        const response = await fetchAllUserActivities()
        
        if (response.success && response.activities) {
          // Group by date
          const dateGroups: { [date: string]: { [eventType: string]: number } } = {}
          
          response.activities.forEach(activity => {
            const date = new Date(activity.creationTime).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            })
            
            if (!dateGroups[date]) {
              dateGroups[date] = {
                PAGE_VIEW: 0,
                LIKE: 0,
                COMMENT: 0,
                SHARE: 0,
                TIME_SPENT: 0,
              }
            }
            
            dateGroups[date][activity.eventType] = (dateGroups[date][activity.eventType] || 0) + 1
          })
          
          // Convert to chart format and get last 7 days
          const data = Object.entries(dateGroups)
            .map(([date, counts]) => ({
              date,
              PAGE_VIEW: counts.PAGE_VIEW || 0,
              LIKE: counts.LIKE || 0,
              COMMENT: counts.COMMENT || 0,
              SHARE: counts.SHARE || 0,
              TIME_SPENT: counts.TIME_SPENT || 0,
            }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .slice(-7) // Last 7 days

          setChartData(data)
        }
      } catch (error) {
        console.error("Error loading activity data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadActivityData()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Activity Comparison (Last 7 Days)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-muted-foreground">Loading data...</div>
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-muted-foreground">No data available</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs fill-muted-foreground" />
                <YAxis className="text-xs fill-muted-foreground" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="PAGE_VIEW" fill={activityColors.PAGE_VIEW} name="Page Views" />
                <Bar dataKey="LIKE" fill={activityColors.LIKE} name="Likes" />
                <Bar dataKey="COMMENT" fill={activityColors.COMMENT} name="Comments" />
                <Bar dataKey="SHARE" fill={activityColors.SHARE} name="Shares" />
                <Bar dataKey="TIME_SPENT" fill={activityColors.TIME_SPENT} name="Time Spent" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
