"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { useState, useEffect } from "react"
import { fetchUserActivities, UserActivityData, UserActivityEnum } from "@/lib/user-activity"

interface ActivityChartData {
  date: string
  PAGE_VIEW: number
  LIKE: number
  COMMENT: number
  SHARE: number
  TIME_SPENT: number
}

interface TimeSeriesChartProps {
  isBlurred?: boolean
}

// Colors for different activity types
const activityColors = {
  PAGE_VIEW: "#8b5cf6", // purple
  LIKE: "#ef4444", // red
  COMMENT: "#22c55e", // green
  SHARE: "#3b82f6", // blue
  TIME_SPENT: "#f59e0b", // amber
}

export function TimeSeriesChart({ isBlurred = false }: TimeSeriesChartProps) {
  const [chartData, setChartData] = useState<ActivityChartData[]>([])
  const [loading, setLoading] = useState(true)
  const [yAxisMax, setYAxisMax] = useState<number>(0)
  const [selectedEventType, setSelectedEventType] = useState<string>("all")

  // Function to process raw activity data into chart format
  const processActivityData = (activities: UserActivityData[]): ActivityChartData[] => {
    // Group activities by date
    const dateGroups: { [date: string]: { [eventType: string]: number } } = {}
    
    activities.forEach(activity => {
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
    
    // Convert to chart data format and sort by date
    const chartData = Object.entries(dateGroups)
      .map(([date, counts]) => ({
        date,
        PAGE_VIEW: counts.PAGE_VIEW || 0,
        LIKE: counts.LIKE || 0,
        COMMENT: counts.COMMENT || 0,
        SHARE: counts.SHARE || 0,
        TIME_SPENT: counts.TIME_SPENT || 0,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    
    return chartData
  }

  // Function to calculate the maximum Y-axis value
  const calculateYAxisMax = (data: ActivityChartData[], eventType: string): number => {
    if (data.length === 0) return 10
    
    let maxValue = 0
    data.forEach(item => {
      if (eventType === "all") {
        const dayMax = Math.max(
          item.PAGE_VIEW,
          item.LIKE,
          item.COMMENT,
          item.SHARE,
          item.TIME_SPENT
        )
        maxValue = Math.max(maxValue, dayMax)
      } else {
        // For specific event type, just get that value
        maxValue = Math.max(maxValue, item[eventType as keyof ActivityChartData] as number)
      }
    })
    
    // Add 20% padding to the maximum value, with a minimum of 5
    return Math.max(Math.ceil(maxValue * 1.2), 5)
  }

  // Fetch activity data on component mount
  useEffect(() => {
    const loadActivityData = async () => {
      try {
        setLoading(true)
        const response = await fetchUserActivities({ limit: 1000 }) // Fetch more data for better chart
        
        if (response.success && response.activities) {
          const processedData = processActivityData(response.activities)
          setChartData(processedData)
          setYAxisMax(calculateYAxisMax(processedData, selectedEventType))
        } else {
          console.error("Failed to fetch activities:", response.message)
          setChartData([])
          setYAxisMax(10)
        }
      } catch (error) {
        console.error("Error loading activity data:", error)
        setChartData([])
        setYAxisMax(10)
      } finally {
        setLoading(false)
      }
    }

    loadActivityData()
  }, [])

  // Recalculate Y-axis when event type selection changes
  useEffect(() => {
    if (chartData.length > 0) {
      setYAxisMax(calculateYAxisMax(chartData, selectedEventType))
    }
  }, [selectedEventType, chartData])

  return (
    <Card className={isBlurred ? "relative" : ""}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>User Activity Over Time</CardTitle>
        <Select value={selectedEventType} onValueChange={setSelectedEventType}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select event type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Activities</SelectItem>
            <SelectItem value="PAGE_VIEW">Page Views</SelectItem>
            <SelectItem value="LIKE">Likes</SelectItem>
            <SelectItem value="COMMENT">Comments</SelectItem>
            <SelectItem value="SHARE">Shares</SelectItem>
            <SelectItem value="TIME_SPENT">Time Spent</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-muted-foreground">Loading activity data...</div>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" className="text-xs fill-muted-foreground" />
                <YAxis 
                  className="text-xs fill-muted-foreground" 
                  domain={[0, yAxisMax]}
                  allowDataOverflow={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                {/* Conditionally render lines based on selection */}
                {(selectedEventType === "all" || selectedEventType === "PAGE_VIEW") && (
                  <Line
                    type="monotone"
                    dataKey="PAGE_VIEW"
                    stroke={activityColors.PAGE_VIEW}
                    strokeWidth={3}
                    dot={{ fill: activityColors.PAGE_VIEW, strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: activityColors.PAGE_VIEW, strokeWidth: 2 }}
                    name="Page Views"
                  />
                )}
                {(selectedEventType === "all" || selectedEventType === "LIKE") && (
                  <Line
                    type="monotone"
                    dataKey="LIKE"
                    stroke={activityColors.LIKE}
                    strokeWidth={2}
                    dot={{ fill: activityColors.LIKE, strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5, stroke: activityColors.LIKE, strokeWidth: 2 }}
                    name="Likes"
                  />
                )}
                {(selectedEventType === "all" || selectedEventType === "COMMENT") && (
                  <Line
                    type="monotone"
                    dataKey="COMMENT"
                    stroke={activityColors.COMMENT}
                    strokeWidth={2}
                    dot={{ fill: activityColors.COMMENT, strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5, stroke: activityColors.COMMENT, strokeWidth: 2 }}
                    name="Comments"
                  />
                )}
                {(selectedEventType === "all" || selectedEventType === "SHARE") && (
                  <Line
                    type="monotone"
                    dataKey="SHARE"
                    stroke={activityColors.SHARE}
                    strokeWidth={2}
                    dot={{ fill: activityColors.SHARE, strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5, stroke: activityColors.SHARE, strokeWidth: 2 }}
                    name="Shares"
                  />
                )}
                {(selectedEventType === "all" || selectedEventType === "TIME_SPENT") && (
                  <Line
                    type="monotone"
                    dataKey="TIME_SPENT"
                    stroke={activityColors.TIME_SPENT}
                    strokeWidth={2}
                    dot={{ fill: activityColors.TIME_SPENT, strokeWidth: 2, r: 3 }}
                    activeDot={{ r: 5, stroke: activityColors.TIME_SPENT, strokeWidth: 2 }}
                    name="Time Spent Events"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
