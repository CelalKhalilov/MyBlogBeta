import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db("blog")

    const comments = await db
      .collection("comments")
      .find({ postId: new ObjectId(params.id) })
      .sort({ createdAt: -1 })
      .toArray()

    return NextResponse.json(comments)
  } catch (error) {
    console.error("Yorumları getirme hatası:", error)
    return NextResponse.json({ error: "Yorumlar getirilirken bir hata oluştu" }, { status: 500 })
  }
}
