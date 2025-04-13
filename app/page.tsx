import { Header } from "@/components/header"
import { PostsList } from "@/components/PostsList"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Hoş Geldiniz!</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Düşüncelerinizi paylaşın, başkalarının fikirlerini keşfedin ve topluluğa katılın.
          </p>
        </div>

        <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Son Yazılar</h2>

        <PostsList />  {/* 🔥 Yeni veriler buradan otomatik çekilecek */}

      </main>
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} BlogApp. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  )
}


// import { Header } from "@/components/header"
// import { PostCard } from "@/components/post-card"
// import clientPromise from "@/lib/mongodb"
// import type { Post } from "@/lib/models"

// async function getPosts() {
//   try {
//     const client = await clientPromise
//     const db = client.db("blog")

//     const posts = await db.collection("posts").find({}).sort({ createdAt: -1 }).toArray()

//     return JSON.parse(JSON.stringify(posts))
//   } catch (error) {
//     console.error("Blog yazılarını getirirken hata oluştu:", error)
//     return []
//   }
// }

// export default async function Home() {
//   const posts = await getPosts()

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Header />
//       <main className="container mx-auto px-4 py-8">
//         <div className="text-center mb-12">
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">Hoş Geldiniz!</h1>
//           <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//             Düşüncelerinizi paylaşın, başkalarının fikirlerini keşfedin ve topluluğa katılın.
//           </p>
//         </div>

//         <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Son Yazılar</h2>

//         {posts.length === 0 ? (
//           <div className="text-center py-12 bg-white rounded-lg shadow-sm">
//             <p className="text-gray-600">Henüz yazı yok. İlk yazıyı siz oluşturun!</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {posts.map((post: Post & { _id: string }) => (
//               <PostCard key={post._id} post={post} />
//             ))}
//           </div>
//         )}
//       </main>
//       <footer className="bg-gray-800 text-white py-8 mt-12">
//         <div className="container mx-auto px-4 text-center">
//           <p>&copy; {new Date().getFullYear()} BlogApp. Tüm hakları saklıdır.</p>
//         </div>
//       </footer>
//     </div>
//   )
// }
