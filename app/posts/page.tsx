"use client"

import { Navigation } from "@/components/navigation"
import { PostCard } from "@/components/post-card"
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { CreatePostModal } from "@/components/create-post-modal"
import { getCurrentUser } from "@/lib/auth" // Added import for user authentication check

// Mock data - will be replaced with real database queries
const mockPosts = [
  {
    id: 1,
    title: "Understanding Bitcoin's Lightning Network",
    content:
      "The Lightning Network represents a significant advancement in Bitcoin's scalability solutions. This layer-2 protocol enables instant, low-cost transactions by creating payment channels between users. In this comprehensive analysis, we explore how the Lightning Network works, its benefits, and potential challenges for widespread adoption in the cryptocurrency ecosystem.",
    author: "crypto_analyst",
    createdAt: "2024-01-15T10:30:00Z",
    likesCount: 24,
    commentsCount: 8,
  },
  {
    id: 2,
    title: "DeFi Yield Farming: Opportunities and Risks",
    content:
      "Decentralized Finance (DeFi) has revolutionized traditional financial services through yield farming mechanisms. This practice allows users to earn rewards by providing liquidity to various protocols. However, with great rewards come significant risks including impermanent loss, smart contract vulnerabilities, and market volatility that every investor should understand.",
    author: "crypto_analyst",
    createdAt: "2024-01-12T14:20:00Z",
    likesCount: 18,
    commentsCount: 12,
  },
  {
    id: 3,
    title: "NFTs Beyond Art: Real-World Applications",
    content:
      "Non-Fungible Tokens (NFTs) have evolved far beyond digital art collections. From supply chain verification to academic credentials, NFTs are finding practical applications across various industries. This post explores innovative use cases that demonstrate the true potential of blockchain-based digital ownership and verification systems.",
    author: "blockchain_student",
    createdAt: "2024-01-10T09:15:00Z",
    likesCount: 31,
    commentsCount: 6,
  },
  {
    id: 4,
    title: "Central Bank Digital Currencies: The Future of Money?",
    content:
      "As governments worldwide explore Central Bank Digital Currencies (CBDCs), we stand at a crossroads between traditional monetary systems and digital innovation. This analysis examines the implications of CBDCs for privacy, monetary policy, and the broader cryptocurrency ecosystem, drawing insights from pilot programs across different nations.",
    author: "defi_researcher",
    createdAt: "2024-01-08T16:45:00Z",
    likesCount: 42,
    commentsCount: 15,
  },
  {
    id: 5,
    title: "Smart Contract Security: Best Practices for Developers",
    content:
      "Smart contract vulnerabilities have led to billions in losses across DeFi protocols. This comprehensive guide covers essential security practices, common attack vectors, and auditing techniques that every blockchain developer should know to build secure decentralized applications.",
    author: "security_expert",
    createdAt: "2024-01-05T11:20:00Z",
    likesCount: 67,
    commentsCount: 23,
  },
  {
    id: 6,
    title: "The Evolution of Consensus Mechanisms",
    content:
      "From Bitcoin's Proof of Work to Ethereum's Proof of Stake, consensus mechanisms continue to evolve. This post explores various consensus algorithms, their trade-offs in terms of security, scalability, and energy efficiency, and what the future holds for blockchain consensus.",
    author: "blockchain_researcher",
    createdAt: "2024-01-03T15:45:00Z",
    likesCount: 38,
    commentsCount: 19,
  },
]

export default function BlogPostsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [allPosts, setAllPosts] = useState(mockPosts)
  const [filteredPosts, setFilteredPosts] = useState(mockPosts)
  const [user, setUser] = useState<{ username: string; role: string } | null>(null) // Added user state

  useEffect(() => {
    loadPosts()
    setUser(getCurrentUser())
  }, [])

  const loadPosts = () => {
    const storedPosts = JSON.parse(localStorage.getItem("blog_posts") || "[]")
    const combinedPosts = [...storedPosts, ...mockPosts]
    setAllPosts(combinedPosts)
    setFilteredPosts(combinedPosts)
  }

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    if (term.trim() === "") {
      setFilteredPosts(allPosts)
    } else {
      const filtered = allPosts.filter(
        (post) =>
          post.title.toLowerCase().includes(term.toLowerCase()) ||
          post.content.toLowerCase().includes(term.toLowerCase()) ||
          post.author.toLowerCase().includes(term.toLowerCase()),
      )
      setFilteredPosts(filtered)
    }
  }

  const handlePostCreated = () => {
    loadPosts()
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Header Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-b border-border">
        <div className="container mx-auto max-w-6xl">
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground text-balance">All Blog Posts</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
                Explore our complete collection of insights on cryptocurrency, blockchain technology, and digital
                assets.
              </p>
            </div>

            {/* Search, Filter, and Create Post */}
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
              {user && <CreatePostModal onPostCreated={handlePostCreated} />}
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} {...post} />
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">No posts found matching your search.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/30 py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-2">
              <div className="h-6 w-6 rounded bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs">MC</span>
              </div>
              <span className="font-semibold text-foreground">Monash CryptoBlog</span>
            </div>
            <p className="text-sm text-muted-foreground">© 2024 Monash University. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
