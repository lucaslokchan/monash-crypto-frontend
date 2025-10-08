"use client"

import { useEffect, useState } from "react"
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

  useEffect(() => {
    loadActivities()
  }, [])

  const loadActivities = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Fetch all activities without pagination params
      const response = await fetchUserActivities()
      
      if (!response.success) {
        setError(response.message || "Failed to load activities")
        return
      }

      if (response.activities) {
        const formattedActivities = formatActivities(response.activities)
        setAllActivities(formattedActivities)
      }
    } catch (err) {
      setError("Error loading activities")
      console.error("Error loading activities:", err)
    } finally {
      setLoading(false)
    }
  }

  const formatActivities = (rawActivities: UserActivityData[]): FormattedActivity[] => {
    return rawActivities.map((activity, index) => {
      let parsedDetails: ParsedActivityDetails = {}
      let detailsDisplay = ""
      
      try {
        // Parse the details JSON string
        parsedDetails = JSON.parse(activity.details)
        
        // Format display based on event type
        switch (activity.eventType) {
          case UserActivityEnum.PAGE_VIEW:
            detailsDisplay = parsedDetails.data || "Unknown page"
            if (parsedDetails.postId) {
              detailsDisplay += ` (Post ID: ${parsedDetails.postId})`
            }
            break
          case UserActivityEnum.LIKE:
          case UserActivityEnum.COMMENT:
          case UserActivityEnum.SHARE:
            detailsDisplay = parsedDetails.postId ? `Post ID: ${parsedDetails.postId}` : "Unknown post"
            break
          case UserActivityEnum.TIME_SPENT:
            detailsDisplay = parsedDetails.data || "Unknown page"
            if (parsedDetails.duration) {
              const minutes = Math.floor(parsedDetails.duration / 60)
              const seconds = parsedDetails.duration % 60
              detailsDisplay += ` (${minutes}m ${seconds}s)`
            }
            break
          default:
            detailsDisplay = JSON.stringify(parsedDetails)
        }
      } catch (e) {
        // If parsing fails, use the raw details string
        detailsDisplay = activity.details
      }

      return {
        id: `${activity.userUuid}-${activity.creationTime}-${index}`,
        user: activity.userUuid.substring(0, 8) + "...", // Shorten UUID for display
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
                <TableHead>User</TableHead>
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
                    <TableCell className="font-medium">{activity.user}</TableCell>
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
