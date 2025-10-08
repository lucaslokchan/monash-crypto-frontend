"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { useState, useEffect } from "react"
import { fetchAllUserActivities, UserActivityData } from "@/lib/user-activity"

interface ActivityTypeData {
  name: string
  value: number
  color: string
}

const activityColors = {
  PAGE_VIEW: "#8b5cf6",
  LIKE: "#ef4444",
  COMMENT: "#22c55e",
  SHARE: "#3b82f6",
  TIME_SPENT: "#f59e0b",
}

export function AdminActivityPieChart() {
  const [chartData, setChartData] = useState<ActivityTypeData[]>([])
  const [loading, setLoading] = useState(true)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const loadActivityData = async () => {
      try {
        setLoading(true)
        const response = await fetchAllUserActivities()
        
        if (response.success && response.activities) {
          const activityCounts: { [key: string]: number } = {
            PAGE_VIEW: 0,
            LIKE: 0,
            COMMENT: 0,
            SHARE: 0,
            TIME_SPENT: 0,
          }

          response.activities.forEach(activity => {
            activityCounts[activity.eventType] = (activityCounts[activity.eventType] || 0) + 1
          })

          const totalActivities = Object.values(activityCounts).reduce((a, b) => a + b, 0)
          setTotal(totalActivities)

          const data: ActivityTypeData[] = Object.entries(activityCounts)
            .filter(([_, count]) => count > 0)
            .map(([type, count]) => ({
              name: type.replace('_', ' '),
              value: count,
              color: activityColors[type as keyof typeof activityColors],
            }))

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

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const percentage = ((payload[0].value / total) * 100).toFixed(1)
      return (
        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
          <p className="font-semibold">{payload[0].name}</p>
          <p className="text-sm">Count: {payload[0].value}</p>
          <p className="text-sm">Percentage: {percentage}%</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Distribution</CardTitle>
        <p className="text-sm text-muted-foreground">
          Total Activities: {total.toLocaleString()}
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
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
