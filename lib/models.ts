import type { ObjectId } from "mongodb"

export interface User {
  _id?: ObjectId
  name: string
  email: string
  password: string
  createdAt: Date
}

export interface Post {
  _id?: ObjectId
  title: string
  content: string
  authorId: ObjectId | string
  authorName: string
  createdAt: Date
  updatedAt?: Date
}

export interface Comment {
  _id?: ObjectId
  postId: ObjectId | string
  authorId: ObjectId | string
  authorName: string
  content: string
  createdAt: Date
}
