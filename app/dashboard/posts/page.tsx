"use client"

import { useState, useEffect } from "react"
import { PostsTable } from "@/components/dashboard/posts-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import Link from "next/link"

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

export default function DashboardPostsPage() {
  const [user, setUser] = useState<{ username: string; role: string } | null>(null)
  const [posts, setPosts] = useState(mockPosts)

  useEffect(() => {
    setUser(getCurrentUser())

    const storedPosts = JSON.parse(localStorage.getItem("blog_posts") || "[]")
    const allPosts = [...storedPosts, ...mockPosts]
    setPosts(allPosts)
  }, [])

  if (!user) return null

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">My Posts</h1>
          <p className="text-muted-foreground">Manage and track your blog posts performance.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/posts/new" className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>New Post</span>
          </Link>
        </Button>
      </div>

      {/* Posts Table */}
      <PostsTable posts={posts} />
    </div>
  )
}
