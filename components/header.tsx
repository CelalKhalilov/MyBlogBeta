"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User, LogOut, PenSquare } from "lucide-react"

export function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          BlogApp
        </Link>
        <nav>
          <ul className="flex space-x-4 items-center">
            <li>
              <Link href="/" className="text-white hover:text-blue-100 transition-colors">
                Ana Sayfa
              </Link>
            </li>
            {user ? (
              <>
                <li>
                  <Link href="/new-post" passHref>
                    <Button variant="secondary" size="sm" className="flex items-center gap-1">
                      <PenSquare className="h-4 w-4" />
                      <span className="hidden sm:inline">Yazı Ekle</span>
                    </Button>
                  </Link>
                </li>
                <li>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="text-white hover:text-blue-100">
                        <User className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">{user.name}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => logout()} className="text-red-500 cursor-pointer">
                        <LogOut className="h-4 w-4 mr-2" />
                        Çıkış Yap
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link href="/login" passHref>
                    <Button variant="ghost" size="sm" className="text-white hover:text-blue-100">
                      Giriş Yap
                    </Button>
                  </Link>
                </li>
                <li>
                  <Link href="/register" passHref>
                    <Button variant="secondary" size="sm">
                      Kayıt Ol
                    </Button>
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}
