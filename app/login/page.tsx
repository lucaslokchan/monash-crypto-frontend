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
    { email: "analyst@monash.edu", password: "password123", username: "crypto_analyst", role: "PREMIUM_USER" },
    { email: "student@monash.edu", password: "password123", username: "blockchain_student", role: "NORMAL_USER" },
    { email: "researcher@monash.edu", password: "password123", username: "defi_researcher", role: "PREMIUM_USER" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Call the login API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        }),
      })

      if (!response.ok) {
        if (response.status === 401) {
          setError("Invalid email or password. Please try again.")
        } else {
          const errorData = await response.json()
          setError(errorData.message || "Login failed. Please try again.")
        }
        setIsLoading(false)
        return
      }

      const loginData = await response.json()
      
      // Store the JWT token in localStorage
      localStorage.setItem("authToken", loginData.token)
      
      // Decode the JWT to get user information (basic decoding, not validation)
      const tokenPayload = JSON.parse(atob(loginData.token.split('.')[1]))
      
      // Store user data for the UI
      // TODO: Should get user data from backend API set into a global state instead of localStorage
      localStorage.setItem("user", JSON.stringify({ 
        username: tokenPayload.sub.split('@')[0], // Extract username from email
        role: tokenPayload.userRole, // Use the role directly from token (NORMAL_USER or PREMIUM_USER)
        userUuid: tokenPayload.userUuid,
        email: tokenPayload.sub
      }))
      
      router.push("/")
      router.refresh()

    } catch (error) {
      console.error('Login error:', error)
      setError("Network error. Please check your connection and try again.")
    } finally {
      setIsLoading(false)
    }
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
