import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

interface Post {
  id: number
  title: string
  createdAt: string
  views: number
  likes: number
  comments: number
}

interface PostsTableProps {
  posts: Post[]
}

export function PostsTable({ posts }: PostsTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>My Posts</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Post Title</TableHead>
              <TableHead>Creation Date</TableHead>
              <TableHead className="text-right">Views</TableHead>
              <TableHead className="text-right">Likes</TableHead>
              <TableHead className="text-right">Comments</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">
                  <div className="max-w-xs truncate">{post.title}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</Badge>
                </TableCell>
                <TableCell className="text-right">{post.views.toLocaleString()}</TableCell>
                <TableCell className="text-right">{post.likes}</TableCell>
                <TableCell className="text-right">{post.comments}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
