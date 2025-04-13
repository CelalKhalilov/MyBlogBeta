import { Header } from "@/components/header"
import clientPromise from "@/lib/mongodb"
import { formatDate } from "@/lib/utils"
import { ObjectId } from "mongodb"
import { notFound } from "next/navigation"
import Link from "next/link"
import { CommentSection } from "@/components/comment-section"
import { getCurrentUser } from "@/lib/auth"
import { ArrowLeft, Calendar, User } from "lucide-react"

async function getPost(id: string) {
  try {
    const client = await clientPromise
    const db = client.db("blog")

    const post = await db.collection("posts").findOne({ _id: new ObjectId(id) })

    if (!post) {
      return null
    }

    return JSON.parse(JSON.stringify(post))
  } catch (error) {
    console.error("Gönderi getirme hatası:", error)
    return null
  }
}

async function getComments(postId: string) {
  try {
    const client = await clientPromise
    const db = client.db("blog")

    const comments = await db
      .collection("comments")
      .find({ postId: new ObjectId(postId) })
      .sort({ createdAt: -1 })
      .toArray()

    return JSON.parse(JSON.stringify(comments))
  } catch (error) {
    console.error("Yorumları getirme hatası:", error)
    return []
  }
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPost(params.id)
  const comments = await getComments(params.id)
  const currentUser = await getCurrentUser()

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Tüm Yazılara Dön
          </Link>

          <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
            <h1 className="text-3xl font-bold mb-4 text-gray-900">{post.title}</h1>

            <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-6 border-b pb-4">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                <span>{post.authorName}</span>
              </div>
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
              </div>
            </div>

            <div className="prose max-w-none">
              {post.content.split("\n").map((paragraph: string, i: number) => (
                <p key={i} className="mb-4 text-gray-700 leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          <CommentSection postId={params.id} initialComments={comments} isLoggedIn={!!currentUser} />
        </div>
      </main>
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} BlogApp. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  )
}
