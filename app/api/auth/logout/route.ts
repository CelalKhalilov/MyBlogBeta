import { NextResponse } from "next/server"
import { clearUserSession } from "@/lib/auth"

export async function POST() {
  try {
    clearUserSession()
    return NextResponse.json({ message: "Çıkış başarılı" })
  } catch (error) {
    console.error("Çıkış hatası:", error)
    return NextResponse.json({ error: "Çıkış sırasında bir hata oluştu" }, { status: 500 })
  }
}
