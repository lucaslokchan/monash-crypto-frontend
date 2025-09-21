"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"

export default function NewPostPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const user = getCurrentUser()
      if (!user) {
        router.push("/login")
        return
      }

      const newPost = {
        id: Date.now(), // Simple ID generation
        title,
        content,
        author: user.username,
        createdAt: new Date().toISOString(),
        likesCount: 0,
        commentsCount: 0,
        views: 0,
        likes: 0,
        comments: 0,
      }

      // Get existing posts from localStorage
      const existingPosts = JSON.parse(localStorage.getItem("blog_posts") || "[]")
      existingPosts.unshift(newPost) // Add to beginning
      localStorage.setItem("blog_posts", JSON.stringify(existingPosts))

      // Redirect to posts page
      router.push("/dashboard/posts")
    } catch (error) {
      console.error("Error creating post:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/posts" className="flex items-center space-x-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Posts</span>
          </Link>
        </Button>
        <div className="space-y-1">
          <h1 className="text-3xl font-bold text-foreground">Create New Post</h1>
          <p className="text-muted-foreground">Share your insights with the crypto community.</p>
        </div>
      </div>

      {/* Post Creation Form */}
      <Card>
        <CardHeader>
          <CardTitle>Post Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter your post title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                placeholder="Write your post content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={15}
                className="resize-none"
              />
              <p className="text-sm text-muted-foreground">{content.length} characters</p>
            </div>

            <div className="flex items-center justify-between pt-4">
              <Button type="button" variant="outline" asChild>
                <Link href="/dashboard/posts">Cancel</Link>
              </Button>
              <Button type="submit" disabled={isSubmitting || !title.trim() || !content.trim()}>
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Publish Post
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
