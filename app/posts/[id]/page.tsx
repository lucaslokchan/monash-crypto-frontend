"use client"

import type React from "react"

import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Heart, Share2, Calendar, User, MessageCircle } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { notFound } from "next/navigation"
import { useState, useEffect } from "react"
import { getCurrentUser } from "@/lib/auth"

// Mock data - will be replaced with real database queries
const mockPosts = {
  1: {
    id: 1,
    title: "Understanding Bitcoin's Lightning Network",
    content: `The Lightning Network represents a significant advancement in Bitcoin's scalability solutions. This layer-2 protocol enables instant, low-cost transactions by creating payment channels between users.

## How the Lightning Network Works

The Lightning Network operates by creating payment channels between users, allowing them to transact directly without broadcasting every transaction to the Bitcoin blockchain. This approach significantly reduces transaction fees and confirmation times.

### Key Benefits

1. **Instant Transactions**: Payments are processed immediately without waiting for blockchain confirmations
2. **Low Fees**: Transaction costs are minimal compared to on-chain Bitcoin transactions
3. **Scalability**: The network can handle millions of transactions per second
4. **Privacy**: Transactions within channels are not publicly visible on the blockchain

### Challenges and Considerations

While the Lightning Network offers significant advantages, there are several challenges to consider:

- **Liquidity Requirements**: Users must lock up Bitcoin in channels
- **Channel Management**: Requires active management of payment channels
- **Network Effects**: The network becomes more useful as adoption increases

## Conclusion

The Lightning Network represents a crucial step forward in Bitcoin's evolution as a payment system. As the technology matures and adoption grows, we can expect to see more innovative applications and improved user experiences.`,
    author: "crypto_analyst",
    createdAt: "2024-01-15T10:30:00Z",
    likesCount: 24,
    commentsCount: 8,
  },
  2: {
    id: 2,
    title: "DeFi Yield Farming: Opportunities and Risks",
    content: `Decentralized Finance (DeFi) has revolutionized traditional financial services through yield farming mechanisms. This practice allows users to earn rewards by providing liquidity to various protocols.

## Understanding Yield Farming

Yield farming involves lending or staking cryptocurrency assets to earn rewards, typically in the form of additional tokens. Users provide liquidity to DeFi protocols and receive compensation for their participation.

### Popular Yield Farming Strategies

1. **Liquidity Mining**: Providing liquidity to decentralized exchanges
2. **Lending Protocols**: Earning interest by lending assets
3. **Staking**: Participating in network consensus mechanisms

## Risks to Consider

However, with great rewards come significant risks including impermanent loss, smart contract vulnerabilities, and market volatility that every investor should understand.`,
    author: "crypto_analyst",
    createdAt: "2024-01-12T14:20:00Z",
    likesCount: 18,
    commentsCount: 12,
  },
  3: {
    id: 3,
    title: "NFTs Beyond Art: Real-World Applications",
    content: `Non-Fungible Tokens (NFTs) have evolved far beyond digital art collections. From supply chain verification to academic credentials, NFTs are finding practical applications across various industries.

## Real-World Use Cases

### Supply Chain Verification
NFTs can track products from manufacturing to consumer, ensuring authenticity and preventing counterfeiting.

### Academic Credentials
Universities are exploring NFTs for issuing tamper-proof digital diplomas and certificates.

### Gaming and Virtual Worlds
NFTs enable true ownership of in-game assets that can be traded across different platforms.

## The Future of NFTs

This post explores innovative use cases that demonstrate the true potential of blockchain-based digital ownership and verification systems.`,
    author: "blockchain_student",
    createdAt: "2024-01-10T09:15:00Z",
    likesCount: 31,
    commentsCount: 6,
  },
  4: {
    id: 4,
    title: "Central Bank Digital Currencies: The Future of Money?",
    content: `As governments worldwide explore Central Bank Digital Currencies (CBDCs), we stand at a crossroads between traditional monetary systems and digital innovation.

## What are CBDCs?

Central Bank Digital Currencies are digital versions of a country's fiat currency, issued and regulated by the central bank. Unlike cryptocurrencies, CBDCs are centralized and government-controlled.

### Key Features

1. **Government Backing**: Full faith and credit of the issuing nation
2. **Digital Native**: Designed for digital transactions from the ground up
3. **Programmable Money**: Can include smart contract functionality

## Global Developments

This analysis examines the implications of CBDCs for privacy, monetary policy, and the broader cryptocurrency ecosystem, drawing insights from pilot programs across different nations.

### Privacy Concerns

The digital nature of CBDCs raises questions about financial privacy and government surveillance capabilities.`,
    author: "defi_researcher",
    createdAt: "2024-01-08T16:45:00Z",
    likesCount: 42,
    commentsCount: 15,
  },
}

const initialComments = [
  {
    id: 1,
    postId: 1,
    author: "blockchain_student",
    content:
      "Great explanation of the Lightning Network! The technical details really help understand the scalability benefits.",
    createdAt: "2024-01-15T12:45:00Z",
  },
  {
    id: 2,
    postId: 1,
    author: "defi_researcher",
    content:
      "I'd love to see more analysis on the adoption challenges you mentioned. What are the main barriers for everyday users?",
    createdAt: "2024-01-15T14:20:00Z",
  },
]

interface PageProps {
  params: {
    id: string
  }
}

export default function PostPage({ params }: PageProps) {
  const postId = Number.parseInt(params.id)
  const [post, setPost] = useState(mockPosts[postId as keyof typeof mockPosts])
  const [comments, setComments] = useState(initialComments)
  const [newComment, setNewComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [user, setUser] = useState<{ username: string; role: string } | null>(null)
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)

  useEffect(() => {
    const currentUser = getCurrentUser()
    setUser(currentUser)

    // Load comments from localStorage
    const storedComments = JSON.parse(localStorage.getItem(`comments_${postId}`) || "[]")
    const allComments = [...initialComments.filter((c) => c.postId === postId), ...storedComments]
    setComments(allComments)

    // Load likes from localStorage
    const storedLikes = JSON.parse(localStorage.getItem(`likes_${postId}`) || "[]")
    const userLiked = currentUser ? storedLikes.includes(currentUser.username) : false
    setIsLiked(userLiked)
    setLikesCount((post?.likesCount || 0) + storedLikes.length)

    // Check for user-created posts
    const storedPosts = JSON.parse(localStorage.getItem("blog_posts") || "[]")
    const userPost = storedPosts.find((p: any) => p.id === postId)
    if (userPost) {
      setPost(userPost)
    }
  }, [postId]) // Removed user from dependency array to prevent infinite loop

  if (!post) {
    notFound()
  }

  const timeAgo = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
  const postComments = comments.filter((comment) => comment.postId === postId)

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !user) return

    setIsSubmitting(true)

    try {
      const comment = {
        id: Date.now(),
        postId,
        author: user.username,
        content: newComment.trim(),
        createdAt: new Date().toISOString(),
      }

      // Save to localStorage
      const existingComments = JSON.parse(localStorage.getItem(`comments_${postId}`) || "[]")
      existingComments.push(comment)
      localStorage.setItem(`comments_${postId}`, JSON.stringify(existingComments))

      // Update state
      setComments((prev) => [...prev, comment])
      setNewComment("")
    } catch (error) {
      console.error("Error submitting comment:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLike = () => {
    if (!user) return

    const storedLikes = JSON.parse(localStorage.getItem(`likes_${postId}`) || "[]")

    if (isLiked) {
      // Unlike
      const updatedLikes = storedLikes.filter((username: string) => username !== user.username)
      localStorage.setItem(`likes_${postId}`, JSON.stringify(updatedLikes))
      setIsLiked(false)
      setLikesCount((prev) => prev - 1)
    } else {
      // Like
      storedLikes.push(user.username)
      localStorage.setItem(`likes_${postId}`, JSON.stringify(storedLikes))
      setIsLiked(true)
      setLikesCount((prev) => prev + 1)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <article className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          {/* Post Header */}
          <header className="space-y-6 mb-12">
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground text-balance">{post.title}</h1>

            <div className="flex items-center space-x-6 text-muted-foreground">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4" />
                <span className="font-medium">{post.author}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4" />
                <span>{timeAgo}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4 pt-4">
              <Button
                variant={isLiked ? "default" : "outline"}
                size="sm"
                className="flex items-center space-x-2"
                onClick={handleLike}
                disabled={!user}
              >
                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                <span>{likesCount}</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center space-x-2 bg-transparent">
                <Share2 className="h-4 w-4" />
                <span>Share</span>
              </Button>
            </div>
          </header>

          {/* Post Content */}
          <div className="prose prose-lg max-w-none mb-16">
            <div className="text-foreground leading-relaxed space-y-6">
              {post.content.split("\n\n").map((paragraph, index) => {
                if (paragraph.startsWith("## ")) {
                  return (
                    <h2 key={index} className="text-2xl font-bold text-foreground mt-8 mb-4">
                      {paragraph.replace("## ", "")}
                    </h2>
                  )
                }
                if (paragraph.startsWith("### ")) {
                  return (
                    <h3 key={index} className="text-xl font-semibold text-foreground mt-6 mb-3">
                      {paragraph.replace("### ", "")}
                    </h3>
                  )
                }
                if (paragraph.includes("1. ") || paragraph.includes("- ")) {
                  const items = paragraph.split("\n").filter((item) => item.trim())
                  return (
                    <ul key={index} className="space-y-2 ml-6">
                      {items.map((item, itemIndex) => (
                        <li key={itemIndex} className="list-disc">
                          {item.replace(/^[1-9]\.\s*/, "").replace(/^-\s*/, "")}
                        </li>
                      ))}
                    </ul>
                  )
                }
                return (
                  <p key={index} className="text-pretty">
                    {paragraph}
                  </p>
                )
              })}
            </div>
          </div>

          {/* Comments Section */}
          <section className="space-y-8">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-muted-foreground" />
              <h2 className="text-2xl font-bold text-foreground">Comments ({postComments.length})</h2>
            </div>

            {/* Comment Form */}
            {user ? (
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold text-foreground">Add a comment</h3>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmitComment} className="space-y-4">
                    <Textarea
                      placeholder="Share your thoughts on this post..."
                      className="min-h-[100px]"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      required
                    />
                    <Button type="submit" disabled={isSubmitting || !newComment.trim()}>
                      {isSubmitting ? "Submitting..." : "Submit Comment"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <p className="text-muted-foreground text-center">
                    Please{" "}
                    <a href="/login" className="text-primary hover:underline">
                      log in
                    </a>{" "}
                    to leave a comment.
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Comments List */}
            <div className="space-y-6">
              {postComments.length > 0 ? (
                postComments.map((comment) => (
                  <Card key={comment.id}>
                    <CardContent className="pt-6">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3 text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">{comment.author}</span>
                          <span>•</span>
                          <span>{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</span>
                        </div>
                        <p className="text-foreground text-pretty leading-relaxed">{comment.content}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-muted-foreground text-center">
                      No comments yet. Be the first to share your thoughts!
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </section>
        </div>
      </article>
    </div>
  )
}
