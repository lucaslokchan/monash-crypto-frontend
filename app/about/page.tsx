import { Navigation } from "@/components/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap, Users, BookOpen, Target } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-4xl">
          <div className="space-y-16">
            {/* Header */}
            <div className="text-center space-y-6">
              <h1 className="text-4xl sm:text-5xl font-bold text-foreground text-balance">About Monash CryptoBlog</h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
                A university-driven platform dedicated to advancing knowledge and understanding of cryptocurrency,
                blockchain technology, and digital assets through academic research and analysis.
              </p>
            </div>

            {/* Mission Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardContent className="p-8 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Target className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Our Mission</h3>
                  <p className="text-muted-foreground text-pretty leading-relaxed">
                    To provide accessible, research-backed insights into the rapidly evolving world of digital assets,
                    helping students, researchers, and enthusiasts navigate the complex landscape of cryptocurrency and
                    blockchain technology.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Academic Excellence</h3>
                  <p className="text-muted-foreground text-pretty leading-relaxed">
                    Our content is created by students, researchers, and faculty at Monash University, ensuring
                    high-quality analysis backed by rigorous academic standards and cutting-edge research methodologies.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Community Focus</h3>
                  <p className="text-muted-foreground text-pretty leading-relaxed">
                    We foster a collaborative environment where diverse perspectives from the crypto community
                    contribute to meaningful discussions about the future of digital finance and decentralized
                    technologies.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-8 space-y-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">Educational Impact</h3>
                  <p className="text-muted-foreground text-pretty leading-relaxed">
                    Through comprehensive analysis and accessible explanations, we aim to bridge the gap between complex
                    technical concepts and practical understanding for learners at all levels of expertise.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Content Areas */}
            <div className="space-y-8">
              <h2 className="text-3xl font-bold text-foreground text-center">What We Cover</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center space-y-3">
                  <h3 className="text-lg font-semibold text-foreground">Market Analysis</h3>
                  <p className="text-sm text-muted-foreground text-pretty">
                    Technical and fundamental analysis of cryptocurrency markets, trends, and investment strategies.
                  </p>
                </div>
                <div className="text-center space-y-3">
                  <h3 className="text-lg font-semibold text-foreground">Technology Deep Dives</h3>
                  <p className="text-sm text-muted-foreground text-pretty">
                    In-depth exploration of blockchain protocols, consensus mechanisms, and emerging technologies.
                  </p>
                </div>
                <div className="text-center space-y-3">
                  <h3 className="text-lg font-semibold text-foreground">Regulatory Insights</h3>
                  <p className="text-sm text-muted-foreground text-pretty">
                    Analysis of regulatory developments and their impact on the cryptocurrency ecosystem.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
