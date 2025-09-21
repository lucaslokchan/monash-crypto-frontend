"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Navigation } from "@/components/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, LogIn } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Mock users for demonstration
  const mockUsers = [
    { email: "analyst@monash.edu", password: "password123", username: "crypto_analyst", role: "PREMIUM_BLOGGER" },
    { email: "student@monash.edu", password: "password123", username: "blockchain_student", role: "BASIC_BLOGGER" },
    { email: "researcher@monash.edu", password: "password123", username: "defi_researcher", role: "PREMIUM_BLOGGER" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock authentication
    const user = mockUsers.find((u) => u.email === email && u.password === password)

    if (user) {
      // Store user in localStorage (in real app, this would be a JWT token)
      localStorage.setItem("mockUser", JSON.stringify({ username: user.username, role: user.role }))
      router.push("/")
      router.refresh()
    } else {
      setError("Invalid email or password. Try analyst@monash.edu / password123")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
            <p className="text-muted-foreground">Sign in to your Monash CryptoBlog account</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <LogIn className="h-5 w-5" />
                <span>Sign In</span>
              </CardTitle>
              <CardDescription>Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@monash.edu"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link href="/signup" className="text-primary hover:underline font-medium">
                    Sign up
                  </Link>
                </p>
              </div>

              {/* Demo Credentials */}
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <p className="text-xs text-muted-foreground mb-2 font-medium">Demo Credentials:</p>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <p>Premium: analyst@monash.edu / password123</p>
                  <p>Basic: student@monash.edu / password123</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
