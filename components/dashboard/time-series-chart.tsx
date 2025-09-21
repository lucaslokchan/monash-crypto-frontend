"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useState } from "react"

const mockData = [
  { date: "Jan 1", views: 120 },
  { date: "Jan 2", views: 150 },
  { date: "Jan 3", views: 180 },
  { date: "Jan 4", views: 220 },
  { date: "Jan 5", views: 190 },
  { date: "Jan 6", views: 250 },
  { date: "Jan 7", views: 280 },
  { date: "Jan 8", views: 320 },
  { date: "Jan 9", views: 290 },
  { date: "Jan 10", views: 350 },
  { date: "Jan 11", views: 380 },
  { date: "Jan 12", views: 420 },
  { date: "Jan 13", views: 390 },
  { date: "Jan 14", views: 450 },
  { date: "Jan 15", views: 480 },
]

interface TimeSeriesChartProps {
  isBlurred?: boolean
}

export function TimeSeriesChart({ isBlurred = false }: TimeSeriesChartProps) {
  const [selectedPost, setSelectedPost] = useState("all")

  return (
    <Card className={isBlurred ? "relative" : ""}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Post Views Over the Last 30 Days</CardTitle>
        <Select value={selectedPost} onValueChange={setSelectedPost}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by post" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Posts</SelectItem>
            <SelectItem value="1">Bitcoin Lightning Network</SelectItem>
            <SelectItem value="2">DeFi Yield Farming</SelectItem>
            <SelectItem value="3">NFTs Beyond Art</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockData}>
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
              <Line
                type="monotone"
                dataKey="views"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "hsl(var(--primary))", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
