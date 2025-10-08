"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { useState, useEffect } from "react"
import { fetchAllUserActivities, UserActivityData } from "@/lib/user-activity"

interface PageData {
  page: string
  views: number
  color: string
}

const COLORS = ['#8b5cf6', '#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#ec4899', '#14b8a6', '#f97316']

export function AdminTopPagesChart() {
  const [chartData, setChartData] = useState<PageData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadActivityData = async () => {
      try {
        setLoading(true)
        const response = await fetchAllUserActivities()
        
        if (response.success && response.activities) {
          // Count page views
          const pageCounts: { [page: string]: number } = {}
          
          response.activities
            .filter(activity => activity.eventType === 'PAGE_VIEW')
            .forEach(activity => {
              try {
                const details = JSON.parse(activity.details)
                if (details.data) {
                  // Extract path from "path: /dashboard"
                  const pathMatch = details.data.match(/path:\s*(.+)/)
                  if (pathMatch) {
                    const path = pathMatch[1].trim()
                    pageCounts[path] = (pageCounts[path] || 0) + 1
                  }
                }
              } catch (e) {
                // Skip invalid JSON
              }
            })
          
          // Convert to chart format and get top 8
          const data = Object.entries(pageCounts)
            .map(([page, views], index) => ({
              page: page.length > 25 ? page.substring(0, 25) + '...' : page,
              views,
              color: COLORS[index % COLORS.length],
            }))
            .sort((a, b) => b.views - a.views)
            .slice(0, 8)

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
        <CardTitle>Top Visited Pages</CardTitle>
        <p className="text-sm text-muted-foreground">
          Most popular pages by view count
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
              <div className="text-muted-foreground">No page view data available</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" className="text-xs fill-muted-foreground" />
                <YAxis 
                  dataKey="page" 
                  type="category" 
                  width={150}
                  className="text-xs fill-muted-foreground" 
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="views" name="Page Views" radius={[0, 8, 8, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
