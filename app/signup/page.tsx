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
import { Eye, EyeOff, UserPlus, Crown, User } from "lucide-react"

export default function SignUpPage() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [accountType, setAccountType] = useState("NORMAL")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Basic validation
    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    // if (!email.includes("@monash.edu")) {
    //   setError("Please use a valid Monash University email address")
    //   setIsLoading(false)
    //   return
    // }

    try {
      // Call the registration API
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          accountType
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setError(errorData.message || "Registration failed. Please try again.")
        setIsLoading(false)
        return
      }

      const userData = await response.json()
      
      // Store user data in localStorage (in real app, this would be a JWT token)
      // localStorage.setItem("user", JSON.stringify({ 
      //   username: userData.username || username, 
      //   role: userData.accountType || accountType 
      // }))
      
      router.push("/login")
      router.refresh()

    } catch (error) {
      console.error('Registration error:', error)
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
            <h1 className="text-3xl font-bold text-foreground">Join the community</h1>
            <p className="text-muted-foreground">Create your Monash CryptoBlog account</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserPlus className="h-5 w-5" />
                <span>Sign Up</span>
              </CardTitle>
              <CardDescription>Fill in your details to create a new account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="crypto_enthusiast"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full"
                  />
                </div>

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
                  <p className="text-xs text-muted-foreground">Must be a valid Monash University email address</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
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
                  <p className="text-xs text-muted-foreground">Minimum 6 characters</p>
                </div>

                <div className="space-y-3">
                  <Label>Account Type</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      type="button"
                      variant={accountType === "NORMAL" ? "default" : "outline"}
                      className="h-auto p-4 flex flex-col items-center space-y-2"
                      onClick={() => setAccountType("NORMAL")}
                    >
                      <User className="h-5 w-5" />
                      <div className="text-center">
                        <div className="font-medium">NORMAL</div>
                        <div className="text-xs opacity-70">Free</div>
                      </div>
                    </Button>
                    <Button
                      type="button"
                      variant={accountType === "PREMIUM" ? "default" : "outline"}
                      className="h-auto p-4 flex flex-col items-center space-y-2"
                      onClick={() => setAccountType("PREMIUM")}
                    >
                      <Crown className="h-5 w-5" />
                      <div className="text-center">
                        <div className="font-medium">Premium</div>
                        <div className="text-xs opacity-70">Advanced</div>
                      </div>
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    NORMAL bloggers have access to standard features. Premium includes advanced analytics and insights.
                  </p>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create Account"}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link href="/login" className="text-primary hover:underline font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
