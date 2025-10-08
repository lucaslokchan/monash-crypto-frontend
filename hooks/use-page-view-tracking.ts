"use client"

import { useEffect } from "react"
import { usePathname, useSearchParams } from "next/navigation"
import { logPageView } from "@/lib/user-activity"
import { isAuthenticated } from "@/lib/auth"

/**
 * Custom hook to automatically track page views when the route changes
 * Only logs when user is authenticated
 */
export function usePageViewTracking() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    // Only log if user is authenticated
    if (isAuthenticated()) {
      // Construct full path with search params
      const fullPath = searchParams?.toString() 
        ? `${pathname}?${searchParams.toString()}`
        : pathname

      // Log the page view
      logPageView(fullPath)
    }
  }, [pathname, searchParams])
}

