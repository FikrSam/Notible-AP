// types/db.ts

export type User = {
  id: number
  username: string
  email: string
  password_hash: string
  created_at: string
}

export type Note = {
  id: number
  user_id: number
  title: string
  content: string | null
  tags: string | null
  created_at: string
  updated_at: string
}
