"use client"

import { usePageViewTracking } from "@/hooks/use-page-view-tracking"

/**
 * Component to track page views automatically
 * Add this to your root layout to track all route changes
 */
export function PageViewTracker() {
  usePageViewTracking()
  return null
}

