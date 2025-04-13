import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { verifyPassword, setUserSession } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const client = await clientPromise
    const db = client.db("blog")
    const { email, password } = await request.json()

    // Gerekli alanları kontrol et
    if (!email || !password) {
      return NextResponse.json({ error: "E-posta ve şifre gereklidir" }, { status: 400 })
    }

    // Kullanıcıyı bul
    const user = await db.collection("users").findOne({ email })
    if (!user) {
      return NextResponse.json({ error: "Geçersiz e-posta veya şifre" }, { status: 401 })
    }

    // Şifreyi doğrula
    const isPasswordValid = await verifyPassword(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: "Geçersiz e-posta veya şifre" }, { status: 401 })
    }

    // Kullanıcı oturumunu ayarla
    await setUserSession(user)

    // Hassas bilgileri kaldır
    const { password: _, ...userWithoutPassword } = user

    return NextResponse.json({
      message: "Giriş başarılı",
      user: userWithoutPassword,
    })
  } catch (error) {
    console.error("Giriş hatası:", error)
    return NextResponse.json({ error: "Giriş sırasında bir hata oluştu" }, { status: 500 })
  }
}
