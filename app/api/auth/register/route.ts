import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { hashPassword, setUserSession } from "@/lib/auth"
import type { User } from "@/lib/models"

export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db("blog")
    const { name, email, password } = await request.json()

    // Gerekli alanları kontrol et
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Lütfen tüm alanları doldurun" }, { status: 400 })
    }

    // E-posta formatını kontrol et
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Geçerli bir e-posta adresi girin" }, { status: 400 })
    }

    // E-posta adresi zaten kullanılıyor mu kontrol et
    const existingUser = await db.collection("users").findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "Bu e-posta adresi zaten kullanılıyor" }, { status: 400 })
    }

    // Şifreyi hashle
    const hashedPassword = await hashPassword(password)

    // Kullanıcıyı oluştur
    const user: User = {
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    }

    const result = await db.collection("users").insertOne(user)
    const newUser = { ...user, _id: result.insertedId }

    // Kullanıcı oturumunu ayarla
    await setUserSession(newUser)

    // Hassas bilgileri kaldır
    const { password: _, ...userWithoutPassword } = newUser

    return NextResponse.json(
      {
        message: "Kayıt başarılı",
        user: userWithoutPassword,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Kayıt hatası:", error)
    return NextResponse.json({ error: "Kayıt işlemi sırasında bir hata oluştu" }, { status: 500 })
  }
}
