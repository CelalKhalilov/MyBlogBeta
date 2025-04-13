import { NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const currentUser = await getCurrentUser()

    if (!currentUser) {
      return NextResponse.json({ error: "Kimlik doğrulanamadı" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("blog")

    const user = await db
      .collection("users")
      .findOne({ _id: new ObjectId(currentUser.id) }, { projection: { password: 0 } })

    if (!user) {
      return NextResponse.json({ error: "Kullanıcı bulunamadı" }, { status: 404 })
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
      },
    })
  } catch (error) {
    console.error("Kullanıcı bilgisi getirme hatası:", error)
    return NextResponse.json({ error: "Kullanıcı bilgisi getirilirken bir hata oluştu" }, { status: 500 })
  }
}
