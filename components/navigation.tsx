"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import { LogOut, BarChart3, Settings } from "lucide-react"
import { useState, useEffect } from "react"
import { getCurrentUser, logout, isBlogger, type User } from "@/lib/auth"

export function Navigation() {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    setUser(getCurrentUser())

    // Listen for storage changes to update auth state
    const handleStorageChange = () => {
      setUser(getCurrentUser())
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const handleLogout = () => {
    logout()
    setUser(null)
    window.location.href = "/"
  }

  const showDashboard = user ? isBlogger() : false

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">MC</span>
            </div>
            <span className="font-bold text-xl text-foreground">Monash CryptoBlog</span>
          </Link>

          {/* Center Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              Home
            </Link>
            <Link href="/posts" className="text-foreground hover:text-primary transition-colors">
              Blog Posts
            </Link>
            <Link href="/about" className="text-foreground hover:text-primary transition-colors">
              About
            </Link>
            {showDashboard && (
              <Link
                href="/dashboard"
                className="text-foreground hover:text-primary transition-colors flex items-center space-x-1"
              >
                <BarChart3 className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            )}
          </div>

          {/* Right Side - Auth */}
          <div className="flex items-center space-x-4">
            {user ? (
              <Popover>
                <PopoverTrigger asChild>
                  <button 
                    className="relative h-8 w-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/80"
                    onClick={() => console.log('Button clicked')}
                  >
                    {user.username.charAt(0).toUpperCase()}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-56" align="end">
                  <div className="p-2">
                    <div className="pb-2 border-b">
                      <p className="font-medium text-sm">{user.username}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.role === "PREMIUM_BLOGGER" ? "Premium User" : "Basic User"}
                      </p>
                    </div>
                    <div className="pt-2 space-y-1">
                      {showDashboard && (
                        <Link 
                          href="/dashboard"
                          className="flex items-center px-2 py-1.5 text-sm rounded hover:bg-accent"
                        >
                          <BarChart3 className="mr-2 h-4 w-4" />
                          Dashboard
                        </Link>
                      )}
                      <Link 
                        href="/dashboard/settings"
                        className="flex items-center px-2 py-1.5 text-sm rounded hover:bg-accent"
                      >
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                      <div className="border-t pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-2 py-1.5 text-sm rounded text-destructive hover:bg-destructive/10"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Log out
                        </button>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" asChild>
                  <Link href="/login">Log In</Link>
                </Button>
                <Button asChild>
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
