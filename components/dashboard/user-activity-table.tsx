import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

interface UserActivity {
  id: number
  user: string
  action: string
  post: string
  timestamp: string
}

const mockActivities: UserActivity[] = [
  {
    id: 1,
    user: "anonymous_user_1",
    action: "PAGE_VIEW",
    post: "Bitcoin Lightning Network",
    timestamp: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    user: "crypto_enthusiast",
    action: "LIKE",
    post: "DeFi Yield Farming",
    timestamp: "2024-01-15T09:45:00Z",
  },
  {
    id: 3,
    user: "blockchain_dev",
    action: "COMMENT",
    post: "NFTs Beyond Art",
    timestamp: "2024-01-15T08:20:00Z",
  },
  {
    id: 4,
    user: "anonymous_user_2",
    action: "SHARE",
    post: "Central Bank Digital Currencies",
    timestamp: "2024-01-15T07:15:00Z",
  },
  {
    id: 5,
    user: "defi_trader",
    action: "TIME_SPENT",
    post: "DeFi Yield Farming",
    timestamp: "2024-01-15T06:30:00Z",
  },
]

interface UserActivityTableProps {
  isBlurred?: boolean
}

export function UserActivityTable({ isBlurred = false }: UserActivityTableProps) {
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

  return (
    <Card className={isBlurred ? "relative" : ""}>
      <CardHeader>
        <CardTitle>Detailed User Journey</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Post/URL</TableHead>
              <TableHead>Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockActivities.map((activity) => (
              <TableRow key={activity.id}>
                <TableCell className="font-medium">{activity.user}</TableCell>
                <TableCell>
                  <Badge className={getActionColor(activity.action)}>{activity.action}</Badge>
                </TableCell>
                <TableCell>
                  <div className="max-w-xs truncate">{activity.post}</div>
                </TableCell>
                <TableCell>{formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
