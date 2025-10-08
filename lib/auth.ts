"use client"

// Authentication utilities with JWT support

export interface User {
  username: string;
  role: "NORMAL_USER" | "PREMIUM_USER" | "ADMIN_USER";
  userUuid?: string;
  email?: string;
}

export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null

  const userStr = localStorage.getItem("user")
  if (!userStr) return null

  try {
    return JSON.parse(userStr)
  } catch {
    return null
  }
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem("authToken")
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null && getAuthToken() !== null
}

export function isBlogger(): boolean {
  const user = getCurrentUser()
  return user?.role === "NORMAL_USER" || user?.role === "PREMIUM_USER";
}

export function isPremiumBlogger(): boolean {
  const user = getCurrentUser()
  return user?.role === "PREMIUM_USER";
}

export function isAdmin(): boolean {
  const user = getCurrentUser()
  return user?.role === "ADMIN_USER";
}

export function logout(): void {
  localStorage.removeItem("user")
  localStorage.removeItem("authToken")
  // Trigger storage event for other components to update
  window.dispatchEvent(new Event("storage"))
}
