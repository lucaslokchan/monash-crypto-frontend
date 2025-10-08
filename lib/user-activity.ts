"use client"

import { getAuthToken } from "./auth"

// User Activity Event Types Enum
export enum UserActivityEnum {
  PAGE_VIEW = "PAGE_VIEW",
  LIKE = "LIKE",
  COMMENT = "COMMENT",
  SHARE = "SHARE",
  TIME_SPENT = "TIME_SPENT",
}

// Type for activity details
export interface ActivityDetails {
  postId?: number
  duration?: number
  page?: string
  [key: string]: any
}

// Type for the activity log request
export interface LogActivityRequest {
  eventType: UserActivityEnum
  details: ActivityDetails | string
}

// Type for the API response
export interface LogActivityResponse {
  success: boolean
  message?: string
  activityId?: string
}

/**
 * Logs user activity to the backend API
 * @param eventType - The type of user activity event
 * @param details - Additional details about the activity (can be an object or JSON string)
 * @returns Promise with the API response
 */
export async function logUserActivity(
  eventType: UserActivityEnum,
  details: ActivityDetails | string
): Promise<LogActivityResponse> {
  try {
    const authToken = getAuthToken()
    
    if (!authToken) {
      console.warn("No auth token available for logging activity")
      return {
        success: false,
        message: "User not authenticated",
      }
    }

    // Get API URL from environment variable or use default
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
    
    // Convert details to JSON string if it's an object
    const detailsString = JSON.stringify(details)

    const response = await fetch(`${apiUrl}/api/activity`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`,
      },
      body: JSON.stringify({
        eventType,
        details: detailsString,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Failed to log user activity:", errorText)
      return {
        success: false,
        message: `Failed to log activity: ${response.statusText}`,
      }
    }

    const data = await response.json()
    return {
      success: true,
      ...data,
    }
  } catch (error) {
    console.error("Error logging user activity:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}

/**
 * Convenience function to log a page view
 * @param path - The path the user navigated to
 * @param postId - Optional post ID if viewing a specific post
 */
export async function logPageView(path?: string, postId?: number): Promise<LogActivityResponse> {
  return logUserActivity(UserActivityEnum.PAGE_VIEW, {
    path: path || (typeof window !== "undefined" ? window.location.pathname : undefined),
    postId,
  })
}

/**
 * Convenience function to log a like action
 * @param postId - The ID of the post being liked
 */
export async function logLike(postId: number): Promise<LogActivityResponse> {
  return logUserActivity(UserActivityEnum.LIKE, { postId })
}

/**
 * Convenience function to log a comment action
 * @param postId - The ID of the post being commented on
 */
export async function logComment(postId: number): Promise<LogActivityResponse> {
  return logUserActivity(UserActivityEnum.COMMENT, { postId })
}

/**
 * Convenience function to log a share action
 * @param postId - The ID of the post being shared
 */
export async function logShare(postId: number): Promise<LogActivityResponse> {
  return logUserActivity(UserActivityEnum.SHARE, { postId })
}

/**
 * Convenience function to log time spent on a page/post
 * @param duration - Time spent in seconds
 * @param path - Optional path identifier
 * @param postId - Optional post ID if time spent on a specific post
 */
export async function logTimeSpent(
  duration: number,
  path?: string,
  postId?: number
): Promise<LogActivityResponse> {
  return logUserActivity(UserActivityEnum.TIME_SPENT, {
    duration,
    path: path || (typeof window !== "undefined" ? window.location.pathname : undefined),
    postId,
  })
}

// Type for user activity data from the API
export interface UserActivityData {
  userUuid: string
  eventType: UserActivityEnum
  details: string
  creationTime: string
}

// Type for fetching activities response
export interface FetchActivitiesResponse {
  success: boolean
  activities?: UserActivityData[]
  message?: string
}

// Type for pagination parameters
export interface PaginationParams {
  page?: number
  limit?: number
}

/**
 * Fetches user activities from the backend API with pagination support
 * @param params - Pagination parameters (page and limit)
 * @returns Promise with the activities data
 */
export async function fetchUserActivities(params?: PaginationParams): Promise<FetchActivitiesResponse> {
  try {
    const authToken = getAuthToken()
    
    if (!authToken) {
      console.warn("No auth token available for fetching activities")
      return {
        success: false,
        message: "User not authenticated",
      }
    }

    // Get API URL from environment variable or use default
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"
    
    // Build query params
    const queryParams = new URLSearchParams()
    if (params?.page) queryParams.append("page", params.page.toString())
    if (params?.limit) queryParams.append("limit", params.limit.toString())
    
    const queryString = queryParams.toString() ? `?${queryParams.toString()}` : ""
    
    const response = await fetch(`${apiUrl}/api/activity${queryString}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${authToken}`,
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Failed to fetch user activities:", errorText)
      return {
        success: false,
        message: `Failed to fetch activities: ${response.statusText}`,
      }
    }

    const data = await response.json()
    return {
      success: true,
      activities: data,
    }
  } catch (error) {
    console.error("Error fetching user activities:", error)
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
