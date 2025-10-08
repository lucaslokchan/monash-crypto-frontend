"use client"

import { useEffect, useState } from "react"
import { StatCard } from "@/components/dashboard/stat-card"
import { PostsTable } from "@/components/dashboard/posts-table"
import { TimeSeriesChart } from "@/components/dashboard/time-series-chart"
import { UserActivityTable } from "@/components/dashboard/user-activity-table"
import { PremiumFeatureLock } from "@/components/premium-feature-lock"
import { Eye, Heart, MessageCircle, FileText } from "lucide-react"
import { getCurrentUser, isPremiumBlogger } from "@/lib/auth"

// Mock data
const mockStats = {
  totalViews: 12543,
  totalLikes: 89,
  totalComments: 34,
  totalPosts: 4,
}

const mockPosts = [
  {
    id: 1,
    title: "Understanding Bitcoin's Lightning Network",
    createdAt: "2024-01-15T10:30:00Z",
    views: 4200,
    likes: 24,
    comments: 8,
  },
  {
    id: 2,
    title: "DeFi Yield Farming: Opportunities and Risks",
    createdAt: "2024-01-12T14:20:00Z",
    views: 3800,
    likes: 18,
    comments: 12,
  },
  {
    id: 3,
    title: "NFTs Beyond Art: Real-World Applications",
    createdAt: "2024-01-10T09:15:00Z",
    views: 2900,
    likes: 31,
    comments: 6,
  },
  {
    id: 4,
    title: "Central Bank Digital Currencies: The Future of Money?",
    createdAt: "2024-01-08T16:45:00Z",
    views: 1643,
    likes: 42,
    comments: 15,
  },
]

export default function DashboardPage() {
  const [user, setUser] = useState<{ username: string; role: string } | null>(null)
  const [isPremium, setIsPremium] = useState(false)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    setIsPremium(isPremiumBlogger())
  }, [])

  if (!user) return null

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {user.username}!
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your blog performance.
        </p>
      </div>

      {/* Basic Analytics - Visible to All Bloggers */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground">
          Analytics Overview
        </h2>

        {/* User Activity Table - Available to All Users */}
        <UserActivityTable />
        
        {/* Stat Cards */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Views"
            value={mockStats.totalViews.toLocaleString()}
            icon={Eye}
            trend={{ value: 12.5, isPositive: true }}
          />
          <StatCard
            title="Total Likes"
            value={mockStats.totalLikes}
            icon={Heart}
            trend={{ value: 8.2, isPositive: true }}
          />
          <StatCard
            title="Total Comments"
            value={mockStats.totalComments}
            icon={MessageCircle}
            trend={{ value: -2.1, isPositive: false }}
          />
          <StatCard title="My Posts" value={mockStats.totalPosts} icon={FileText} />
        </div> */}

        {/* Posts Table */}
        <PostsTable posts={mockPosts} />
      </div>

      {/* Premium Analytics - Conditional Visibility */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-foreground">
          Advanced Analytics
        </h2>

        {/* Time Series Chart */}
        {isPremium ? (
          <TimeSeriesChart />
        ) : (
          <PremiumFeatureLock
            title="Upgrade to Premium"
            description="Unlock detailed time series statistics to track your post performance over time!"
          >
            <TimeSeriesChart />
          </PremiumFeatureLock>
        )}
      </div>
    </div>
  );
}
