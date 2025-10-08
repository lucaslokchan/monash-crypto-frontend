"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useState, useEffect } from "react"
import { fetchAllUserActivities, UserActivityData } from "@/lib/user-activity"

interface EngagementData {
  date: string
  users: number
  activities: number
}

export function AdminUserEngagementChart() {
  const [chartData, setChartData] = useState<EngagementData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadActivityData = async () => {
      try {
        setLoading(true)
        const response = await fetchAllUserActivities()
        
        if (response.success && response.activities) {
          // Group by date
          const dateGroups: { [date: string]: { users: Set<string>, activities: number } } = {}
          
          response.activities.forEach(activity => {
            const date = new Date(activity.creationTime).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            })
            
            if (!dateGroups[date]) {
              dateGroups[date] = {
                users: new Set<string>(),
                activities: 0,
              }
            }
            
            dateGroups[date].users.add(activity.userUuid)
            dateGroups[date].activities += 1
          })
          
          // Convert to chart format
          const data = Object.entries(dateGroups)
            .map(([date, stats]) => ({
              date,
              users: stats.users.size,
              activities: stats.activities,
            }))
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

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
        <CardTitle>User Engagement Trends</CardTitle>
        <p className="text-sm text-muted-foreground">
          Active users and total activities over time
        </p>
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
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorActivities" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
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
                <Area 
                  type="monotone" 
                  dataKey="users" 
                  stroke="#8b5cf6" 
                  fillOpacity={1} 
                  fill="url(#colorUsers)" 
                  name="Active Users"
                />
                <Area 
                  type="monotone" 
                  dataKey="activities" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorActivities)" 
                  name="Total Activities"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
