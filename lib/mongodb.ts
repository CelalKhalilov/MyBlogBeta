import { MongoClient } from "mongodb"

// MongoDB URI kontrolü
const uri = process.env.MONGODB_URI
if (!uri) {
  throw new Error("MongoDB URI bulunamadı. Lütfen MONGODB_URI ortam değişkenini ayarlayın.")
}

const options = {
  // Bağlantı seçeneklerini ayarlayalım
  connectTimeoutMS: 10000, // 10 saniye bağlantı zaman aşımı
  socketTimeoutMS: 45000, // 45 saniye soket zaman aşımı
}

let client
let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === "development") {
  // Geliştirme modunda, HMR (Hot Module Replacement) nedeniyle
  // modül yeniden yüklemeleri arasında değerin korunması için global değişken kullanın.
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect().catch((err) => {
      console.error("MongoDB bağlantı hatası:", err)
      throw new Error("MongoDB'ye bağlanılamadı. Lütfen bağlantı bilgilerinizi kontrol edin.")
    })
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  // Üretim modunda, global değişken kullanmamak en iyisidir.
  client = new MongoClient(uri, options)
  clientPromise = client.connect().catch((err) => {
    console.error("MongoDB bağlantı hatası:", err)
    throw new Error("MongoDB'ye bağlanılamadı. Lütfen bağlantı bilgilerinizi kontrol edin.")
  })
}

export default clientPromise
