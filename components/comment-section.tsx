"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { MessageSquare, User } from "lucide-react"
import Link from "next/link"

interface Comment {
  _id: string
  postId: string
  authorId: string
  authorName: string
  content: string
  createdAt: string | Date
}

interface CommentSectionProps {
  postId: string
  initialComments: Comment[]
  isLoggedIn: boolean
}

export function CommentSection({ postId, initialComments, isLoggedIn }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [content, setContent] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    setIsSubmitting(true)

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          content,
        }),
      })

      if (!response.ok) {
        throw new Error("Yorum gönderme hatası")
      }

      const data = await response.json()
      setComments([data.comment, ...comments])
      setContent("")
      router.refresh()
    } catch (error) {
      console.error("Yorum gönderme hatası:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MessageSquare className="h-5 w-5 mr-2" />
            Yorumlar ({comments.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoggedIn ? (
            <form onSubmit={handleSubmit} className="mb-6">
              <Textarea
                placeholder="Yorumunuzu yazın..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="mb-2 min-h-[100px]"
                required
              />
              <Button type="submit" disabled={isSubmitting || !content.trim()}>
                {isSubmitting ? "Gönderiliyor..." : "Yorum Yap"}
              </Button>
            </form>
          ) : (
            <div className="bg-blue-50 p-4 rounded-md mb-6">
              <p className="text-blue-800 mb-2">Yorum yapmak için giriş yapmalısınız.</p>
              <Link href="/login" passHref>
                <Button variant="outline" size="sm">
                  Giriş Yap
                </Button>
              </Link>
            </div>
          )}

          {comments.length === 0 ? (
            <div className="text-center py-6 text-gray-500">
              <p>Henüz yorum yok. İlk yorumu siz yapın!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment._id} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1 text-gray-500" />
                      <span className="font-medium">{comment.authorName}</span>
                    </div>
                    <time className="text-xs text-gray-500">{formatDate(comment.createdAt)}</time>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
