// @/hooks/useNotes.ts

import { useEffect, useState } from "react"
import type { Note } from "@/types"

const sampleNotes: Note[] = [
  {
    id: 1,
    user_id: 1,
    title: "First Note",
    content: "This is a sample note.",
    tags: "sample,hello",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    user_id: 1,
    title: "Second Note",
    content: "Another note for testing.",
    tags: "test,example",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export function useNotes(userId: number | null) {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) return

    const timeout = setTimeout(() => {
      setNotes(sampleNotes.filter(note => note.user_id === userId))
      setLoading(false)
    }, 300)

    return () => clearTimeout(timeout)
  }, [userId])

  return { notes, loading }
}
