"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { LogOut, BarChart3, Settings } from "lucide-react"
import { useState, useEffect } from "react"
import { getCurrentUser, logout, isBlogger } from "@/lib/auth"

export function Navigation() {
  const [user, setUser] = useState(null)

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

  const showDashboard = isBlogger()

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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.username.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 mr-4 bg-background border border-border shadow-lg"
                  align="end"
                  forceMount
                  sideOffset={8}
                >
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-sm">{user.username}</p>
                      <p className="text-xs text-muted-foreground">
                        {user.role === "PREMIUM_BLOGGER" ? "Premium User" : "Basic User"}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  {showDashboard && (
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/dashboard" className="flex items-center">
                        <BarChart3 className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/dashboard/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
