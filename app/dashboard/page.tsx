"use client"

import { useEffect, useState } from "react"
import { TimeSeriesChart } from "@/components/dashboard/time-series-chart"
import { UserActivityTable } from "@/components/dashboard/user-activity-table"
import { AdminActivityTable } from "@/components/dashboard/admin-activity-table"
import { AdminTimeSeriesChart } from "@/components/dashboard/admin-time-series-chart"
import { AdminActivityPieChart } from "@/components/dashboard/admin-activity-pie-chart"
import { AdminActivityBarChart } from "@/components/dashboard/admin-activity-bar-chart"
import { AdminUserEngagementChart } from "@/components/dashboard/admin-user-engagement-chart"
import { AdminTopPagesChart } from "@/components/dashboard/admin-top-pages-chart"
import { AdminStatsCards } from "@/components/dashboard/admin-stats-cards"
import { PremiumFeatureLock } from "@/components/premium-feature-lock"
import { getCurrentUser, isPremiumBlogger, isAdmin } from "@/lib/auth"


export default function DashboardPage() {
  const [user, setUser] = useState<{ username: string; role: string } | null>(null)
  const [isPremium, setIsPremium] = useState(false)
  const [isAdminUser, setIsAdminUser] = useState(false)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)
    setIsPremium(isPremiumBlogger())
    setIsAdminUser(isAdmin())
  }, [])

  if (!user) return null

  // Admin Dashboard View
  if (isAdminUser) {
    return (
      <div className="space-y-8">
        {/* Welcome Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Monitor all user activities across the platform.
          </p>
        </div>

        {/* Stats Cards */}
        <AdminStatsCards />

        {/* Activity Distribution and Top Pages */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AdminActivityPieChart />
          <AdminTopPagesChart />
        </div>

        {/* Time Series and Bar Chart */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-foreground">
            Activity Trends Over Time
          </h2>
          <AdminTimeSeriesChart />
        </div>

        {/* Daily Comparison and User Engagement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AdminActivityBarChart />
          <AdminUserEngagementChart />
        </div>

        {/* Admin Analytics */}
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-foreground">
            All User Activities
          </h2>

          {/* Admin Activity Table */}
          <AdminActivityTable />
        </div>
      </div>
    )
  }

  // Regular User Dashboard View
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
        {/* <PostsTable posts={mockPosts} /> */}
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
