"use client"

// Mock authentication utilities
// In a real application, this would handle JWT tokens and API calls

export interface User {
  username: string
  role: "BASIC_BLOGGER" | "PREMIUM_BLOGGER"
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  const userStr = localStorage.getItem("mockUser")
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null
}

export function isBlogger(): boolean {
  const user = getCurrentUser()
  return user?.role === "BASIC_BLOGGER" || user?.role === "PREMIUM_BLOGGER"
}

export function isPremiumBlogger(): boolean {
  const user = getCurrentUser()
  return user?.role === "PREMIUM_BLOGGER"
}

export function logout(): void {
  localStorage.removeItem("mockUser")
  // Trigger storage event for other components to update
  window.dispatchEvent(new Event("storage"))
}
