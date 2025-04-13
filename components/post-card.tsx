import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { Post } from "@/lib/models"
import { formatDate } from "@/lib/utils"
import { MessageSquare, User } from "lucide-react"

interface PostCardProps {
  post: Post & { _id: any }
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="h-full flex flex-col hover:shadow-md transition-shadow overflow-hidden border-t-4 border-t-blue-500">
      <CardHeader className="pb-2">
        <CardTitle className="line-clamp-2">
          <Link href={`/posts/${post._id}`} className="hover:text-blue-600 transition-colors">
            {post.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600 line-clamp-3 mb-4">{post.content}</p>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-gray-500 border-t pt-3">
        <div className="flex items-center">
          <User className="h-3 w-3 mr-1" />
          <span>{post.authorName}</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href={`/posts/${post._id}`} className="flex items-center text-blue-500 hover:text-blue-700">
            <MessageSquare className="h-3 w-3 mr-1" />
            <span>Yorumlar</span>
          </Link>
          <time dateTime={post.createdAt?.toString()}>{formatDate(post.createdAt)}</time>
        </div>
      </CardFooter>
    </Card>
  )
}
