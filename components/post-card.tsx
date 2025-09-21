import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Heart, MessageCircle, Calendar, User } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface PostCardProps {
  id: number
  title: string
  content: string
  author: string
  createdAt: string
  likesCount: number
  commentsCount: number
}

export function PostCard({ id, title, content, author, createdAt, likesCount, commentsCount }: PostCardProps) {
  const snippet = content.length > 150 ? content.substring(0, 150) + "..." : content
  const timeAgo = formatDistanceToNow(new Date(createdAt), { addSuffix: true })

  return (
    <Link href={`/posts/${id}`}>
      <Card className="h-full hover:shadow-lg transition-all duration-200 hover:border-primary/20 cursor-pointer group">
        <CardHeader className="pb-3">
          <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors text-balance">
            {title}
          </h3>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <User className="h-3 w-3" />
              <span>{author}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{timeAgo}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pb-4">
          <p className="text-muted-foreground text-pretty leading-relaxed">{snippet}</p>
        </CardContent>
        <CardFooter className="pt-0">
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Heart className="h-4 w-4" />
              <span>{likesCount}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MessageCircle className="h-4 w-4" />
              <span>{commentsCount}</span>
            </div>
          </div>
        </CardFooter>
      </Card>
    </Link>
  )
}
