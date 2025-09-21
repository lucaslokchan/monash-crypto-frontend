import { Navigation } from "@/components/navigation"
import { PostCard } from "@/components/post-card"
import { Button } from "@/components/ui/button"
import { ArrowRight, TrendingUp, Shield, Users } from "lucide-react"
import Link from "next/link"

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
]

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground text-balance">
                Insights on Digital Assets
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
                Explore the latest developments in cryptocurrency, blockchain technology, and decentralized finance
                through expert analysis and research from Monash University.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button size="lg" asChild>
                <Link href="#latest-posts" className="flex items-center space-x-2">
                  <span>Read Latest Posts</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Market Analysis</h3>
              <p className="text-muted-foreground text-pretty">
                In-depth analysis of cryptocurrency markets, trends, and investment opportunities.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Security Research</h3>
              <p className="text-muted-foreground text-pretty">
                Comprehensive coverage of blockchain security, smart contract audits, and best practices.
              </p>
            </div>

            <div className="text-center space-y-4">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Community Insights</h3>
              <p className="text-muted-foreground text-pretty">
                Perspectives from students, researchers, and industry experts in the crypto space.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section id="latest-posts" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-6xl">
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground">Latest Posts</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
                Stay updated with the latest insights and analysis from our community of crypto researchers and
                enthusiasts.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {mockPosts.map((post) => (
                <PostCard key={post.id} {...post} />
              ))}
            </div>
          </div>
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
