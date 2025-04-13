import { compare, hash } from "bcryptjs"
import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"
import type { User } from "./models"
import type { ObjectId } from "mongodb"

// JWT için gizli anahtar
const secretKey = new TextEncoder().encode(process.env.JWT_SECRET || "gizli_anahtar_buraya_gelecek_en_az_32_karakter")

// Şifre hashleme
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10)
}

// Şifre doğrulama
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return compare(password, hashedPassword)
}

// JWT token oluşturma
export async function createToken(user: Partial<User> & { _id: ObjectId | string }): Promise<string> {
  const token = await new SignJWT({
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d") // 7 gün geçerli
    .sign(secretKey)

  return token
}

// JWT token doğrulama
export async function verifyToken(token: string) {
  try {
    const verified = await jwtVerify(token, secretKey)
    return verified.payload
  } catch (error) {
    return null
  }
}

// Kullanıcı oturumunu ayarlama
export async function setUserSession(user: Partial<User> & { _id: ObjectId | string }) {
  const token = await createToken(user)
  cookies().set("auth-token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 gün
    path: "/",
  })
  return token
}

// Kullanıcı oturumunu sonlandırma
export function clearUserSession() {
  cookies().delete("auth-token")
}

// Mevcut kullanıcıyı alma
export async function getCurrentUser() {
  const token = cookies().get("auth-token")

  if (!token) {
    return null
  }

  try {
    const payload = await verifyToken(token.value)
    if (!payload) {
      return null
    }

    return {
      id: payload.id as string,
      name: payload.name as string,
      email: payload.email as string,
    }
  } catch (error) {
    return null
  }
}
