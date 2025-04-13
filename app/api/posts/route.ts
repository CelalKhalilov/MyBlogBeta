import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import type { Post } from "@/lib/models"
import { getCurrentUser } from "@/lib/auth"
import { ObjectId } from "mongodb"

// Tüm gönderileri getir
export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("blog")

    const posts = await db.collection("posts").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json(posts)
  } catch (error) {
    console.error("Gönderileri getirme hatası:", error)
    return NextResponse.json({ error: "Gönderiler getirilirken bir hata oluştu" }, { status: 500 })
  }
}

// Yeni gönderi oluştur
export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser()
    if (!currentUser) {
      return NextResponse.json({ error: "Bu işlem için giriş yapmalısınız" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("blog")

    const data = await request.json()

    const post: Post = {
      title: data.title,
      content: data.content,
      authorId: new ObjectId(currentUser.id),
      authorName: currentUser.name,
      createdAt: new Date(),
    }

    const result = await db.collection("posts").insertOne(post)

    return NextResponse.json(
      {
        message: "Gönderi başarıyla oluşturuldu",
        postId: result.insertedId,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Gönderi oluşturma hatası:", error)
    return NextResponse.json({ error: "Gönderi oluşturulurken bir hata oluştu" }, { status: 500 })
  }
}
