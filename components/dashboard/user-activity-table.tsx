"use client"

import { useEffect, useState, useRef } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { formatDistanceToNow } from "date-fns"
import { fetchUserActivities, UserActivityData, UserActivityEnum } from "@/lib/user-activity"

// Interface for parsed activity details
interface ParsedActivityDetails {
  data?: string
  postId?: number
  duration?: number
  [key: string]: any
}

// Interface for formatted activity
interface FormattedActivity {
  id: string
  user: string
  userUuid: string
  action: string
  details: ParsedActivityDetails
  detailsDisplay: string
  timestamp: string
}

interface UserActivityTableProps {
  isBlurred?: boolean
}

const ITEMS_PER_PAGE = 10

export function UserActivityTable({ isBlurred = false }: UserActivityTableProps) {
  const [allActivities, setAllActivities] = useState<FormattedActivity[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const loadingRef = useRef(false)
  const mountedRef = useRef(true)

  useEffect(() => {
    // Ensure mounted ref is set to true on mount
    mountedRef.current = true
    
    // Prevent duplicate calls in React Strict Mode
    if (!loadingRef.current) {
      loadActivities()
    }

    // Cleanup function
    return () => {
      mountedRef.current = false
    }
  }, [])

  const loadActivities = async () => {
    // Prevent duplicate calls
    if (loadingRef.current) {
      return
    }

    try {
      loadingRef.current = true
      setLoading(true)
      setError(null)
      
      // Fetch all activities without pagination params
      const response = await fetchUserActivities()
      
      // Check if component is still mounted before updating state
      if (!mountedRef.current) {
        return
      }
      
      if (!response.success) {
        setError(response.message || "Failed to load activities")
        return
      }

      if (response.activities) {
        const formattedActivities = formatActivities(response.activities)
        setAllActivities(formattedActivities)
      } else {
        setAllActivities([])
      }
    } catch (err) {
      if (mountedRef.current) {
        setError("Error loading activities")
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false)
      }
      loadingRef.current = false
    }
  }

  const formatActivities = (rawActivities: UserActivityData[]): FormattedActivity[] => {
    return rawActivities.map((activity, index) => {
      let parsedDetails: ParsedActivityDetails = {}
      let detailsDisplay = ""
      
      try {
        // Parse the details JSON string
        parsedDetails = JSON.parse(activity.details)
        
        // Display the raw .data content for all activity types
        detailsDisplay = parsedDetails.data || "No data"
      } catch (e) {
        // If parsing fails, use the raw details string
        detailsDisplay = activity.details
      }

      return {
        id: `${activity.userUuid}-${activity.creationTime}-${index}`,
        user: activity.userUuid.substring(0, 8) + "...", // Shortened for backward compatibility
        userUuid: activity.userUuid, // Full UUID
        action: activity.eventType,
        details: parsedDetails,
        detailsDisplay,
        timestamp: activity.creationTime,
      }
    })
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case "PAGE_VIEW":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "LIKE":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      case "COMMENT":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "SHARE":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "TIME_SPENT":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  // Calculate pagination values
  const totalItems = allActivities.length
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
  const showPagination = totalPages > 1
  
  // Get activities for current page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentActivities = allActivities.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  const renderPaginationItems = () => {
    const items = []
    const maxVisiblePages = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink
            onClick={(e) => {
              e.preventDefault()
              handlePageChange(i)
            }}
            isActive={currentPage === i}
            className="cursor-pointer"
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      )
    }

    return items
  }

  return (
    <Card className={isBlurred ? "relative" : ""}>
      <CardHeader>
        <CardTitle>Detailed User Journey</CardTitle>
        {!loading && totalItems > 0 && (
          <p className="text-sm text-muted-foreground">
            Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} activities
          </p>
        )}
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {loading ? (
          <div className="space-y-2">
            {[...Array(ITEMS_PER_PAGE)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : (
          <>
            <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User UUID</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Details</TableHead>
                <TableHead>Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {                currentActivities.length === 0 && allActivities.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground">
                    No activities found
                  </TableCell>
                </TableRow>
              ) : (
                currentActivities.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-mono text-xs" title={activity.userUuid}>
                      {activity.userUuid}
                    </TableCell>
                    <TableCell>
                      <Badge className={getActionColor(activity.action)}>{activity.action}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate" title={activity.detailsDisplay}>
                        {activity.detailsDisplay}
                      </div>
                    </TableCell>
                    <TableCell>{formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          
          {showPagination && !loading && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={(e) => {
                        e.preventDefault()
                        handlePageChange(currentPage - 1)
                      }}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                  
                  {renderPaginationItems()}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={(e) => {
                        e.preventDefault()
                        handlePageChange(currentPage + 1)
                      }}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
