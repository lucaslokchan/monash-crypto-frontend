"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus, Save } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { useRouter } from "next/navigation"

interface CreatePostModalProps {
  onPostCreated?: () => void
}

export function CreatePostModal({ onPostCreated }: CreatePostModalProps) {
  const [isOpen, setIsOpen] = useState(false)
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

      // Reset form and close modal
      setTitle("")
      setContent("")
      setIsOpen(false)

      // Notify parent component to refresh posts
      if (onPostCreated) {
        onPostCreated()
      }
    } catch (error) {
      console.error("Error creating post:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setIsOpen(false)
      setTitle("")
      setContent("")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogTrigger asChild>
        <Button className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Create New Post</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background border border-border shadow-lg">
        <DialogHeader>
          <DialogTitle>Create New Post</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="modal-title">Title</Label>
            <Input
              id="modal-title"
              placeholder="Enter your post title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="text-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="modal-content">Content</Label>
            <Textarea
              id="modal-content"
              placeholder="Write your post content here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={12}
              className="resize-none"
            />
            <p className="text-sm text-muted-foreground">{content.length} characters</p>
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isSubmitting}>
              Cancel
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
      </DialogContent>
    </Dialog>
  )
}
