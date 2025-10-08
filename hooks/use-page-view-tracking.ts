"use client"

import { useEffect, useRef } from "react"
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
  const lastLoggedPath = useRef<string>("")
  const isLogging = useRef(false)

  useEffect(() => {
    // Only log if user is authenticated
    if (isAuthenticated()) {
      // Construct full path with search params
      const fullPath = searchParams?.toString() 
        ? `${pathname}?${searchParams.toString()}`
        : pathname

      // Prevent duplicate calls for the same path and avoid concurrent calls
      if (fullPath !== lastLoggedPath.current && !isLogging.current) {
        isLogging.current = true
        lastLoggedPath.current = fullPath
        
        // Log the page view
        logPageView(fullPath).finally(() => {
          isLogging.current = false
        })
      }
    }
  }, [pathname, searchParams])
}

