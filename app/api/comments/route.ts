import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { getCurrentUser } from "@/lib/auth"
import type { Comment } from "@/lib/models"
import { ObjectId } from "mongodb"

// Yorum ekleme
export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: "Bu işlem için giriş yapmalısınız" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("blog")
    const data = await request.json()

    const comment: Comment = {
      postId: new ObjectId(data.postId),
      authorId: new ObjectId(currentUser.id),
      authorName: currentUser.name,
      content: data.content,
      createdAt: new Date(),
    }

    const result = await db.collection("comments").insertOne(comment)

    return NextResponse.json(
      {
        message: "Yorum başarıyla eklendi",
        commentId: result.insertedId,
        comment: {
          ...comment,
          _id: result.insertedId,
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Yorum ekleme hatası:", error)
    return NextResponse.json({ error: "Yorum eklenirken bir hata oluştu" }, { status: 500 })
  }
}
